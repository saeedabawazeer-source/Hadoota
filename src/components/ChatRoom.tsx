import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Image as ImageIcon, Mic, Square, Loader2, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Message } from '../types';

interface ChatRoomProps {
  messages: Message[];
  currentUserId: string;
  currentUserName: string;
  currentUserType: 'parent' | 'child';
  onSendMessage: (senderId: string, senderName: string, senderType: 'parent' | 'child', content: string, type?: 'text' | 'image' | 'audio') => void;
  onUploadMedia: (senderId: string, senderName: string, senderType: 'parent' | 'child', file: File | Blob, type: 'image' | 'audio') => Promise<void>;
}

// Detect the best supported audio MIME type for MediaRecorder
function getSupportedAudioMime(): { mimeType: string; ext: string } {
  const candidates = [
    { mimeType: 'audio/webm;codecs=opus', ext: 'webm' },
    { mimeType: 'audio/webm', ext: 'webm' },
    { mimeType: 'audio/mp4', ext: 'mp4' },
    { mimeType: 'audio/ogg;codecs=opus', ext: 'ogg' },
    { mimeType: 'audio/wav', ext: 'wav' },
  ];
  for (const c of candidates) {
    try {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(c.mimeType)) {
        return c;
      }
    } catch { /* skip */ }
  }
  // Fallback — let the browser pick whatever it wants
  return { mimeType: '', ext: 'webm' };
}

export function ChatRoom({ messages, currentUserId, currentUserName, currentUserType, onSendMessage, onUploadMedia }: ChatRoomProps) {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioMime = useRef(getSupportedAudioMime());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle Recording Timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  // ---- Image upload helper (shared by file input, drag-drop, and paste) ----
  const uploadImageFile = useCallback(async (file: File | Blob) => {
    if (isUploading) return;
    setIsUploading(true);
    try {
      await onUploadMedia(currentUserId, currentUserName, currentUserType, file, 'image');
    } catch (err) {
      console.error('[Chat] Image upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  }, [isUploading, currentUserId, currentUserName, currentUserType, onUploadMedia]);

  const handleSendText = () => {
    if (!inputText.trim()) return;
    onSendMessage(currentUserId, currentUserName, currentUserType, inputText.trim(), 'text');
    setInputText('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadImageFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ---- Drag & Drop handlers ----
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      return; // Only accept images via drag-and-drop
    }
    await uploadImageFile(file);
  }, [uploadImageFile]);

  // ---- Paste handler (Ctrl/Cmd+V with image) ----
  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          await uploadImageFile(file);
        }
        return;
      }
    }
    // If no image found, let the default paste (text) happen
  }, [uploadImageFile]);

  // ---- Voice recording ----
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const options: MediaRecorderOptions = {};
      if (audioMime.current.mimeType) {
        options.mimeType = audioMime.current.mimeType;
      }

      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, options);
      } catch {
        // If the preferred MIME failed, fall back to no options
        recorder = new MediaRecorder(stream);
      }

      audioChunks.current = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };
      
      recorder.onstop = async () => {
        const blobMime = recorder.mimeType || audioMime.current.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunks.current, { type: blobMime });
        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
        
        if (audioBlob.size === 0) {
          console.warn('[Chat] Empty audio recording, skipping upload');
          return;
        }

        setIsUploading(true);
        try {
          await onUploadMedia(currentUserId, currentUserName, currentUserType, audioBlob, 'audio');
        } catch (err) {
          console.error('[Chat] Voice memo upload failed:', err);
        } finally {
          setIsUploading(false);
        }
      };
      
      mediaRecorder.current = recorder;
      recorder.start(250); // Collect data every 250ms so we always get chunks
      setIsRecording(true);
    } catch (err) {
      console.error('[Chat] Mic access denied or failed:', err);
      alert('Could not access microphone. Please allow microphone permission and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }
    setIsRecording(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col h-full bg-white border-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-colors relative
        ${isDragOver ? 'border-purple-500 bg-purple-50' : 'border-black'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onPaste={handlePaste}
    >
      
      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-30 bg-purple-500/20 backdrop-blur-sm flex items-center justify-center pointer-events-none rounded-2xl">
          <div className="bg-white border-3 border-black rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-purple-600" />
            <span className="font-black uppercase text-sm">Drop image here</span>
          </div>
        </div>
      )}

      {/* Messages Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 md:p-5 flex flex-col gap-3 bg-purple-50 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center p-6 text-gray-500 font-bold uppercase tracking-widest">
            No messages yet. Say hi! 👋
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.senderId === currentUserId;
            const showName = i === 0 || messages[i-1].senderId !== msg.senderId;
            
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${isMe ? 'self-end' : 'self-start'}`}>
                {showName && !isMe && (
                  <span className="text-xs font-black text-gray-500 mb-1 ml-1 uppercase">{msg.senderName}</span>
                )}
                
                <div className={`p-3 md:p-4 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isMe ? 'bg-lime-400 rounded-tr-sm' : 'bg-white rounded-tl-sm'}`}>
                  {msg.type === 'text' && (
                    <p className="font-bold text-black break-words whitespace-pre-wrap">{msg.content}</p>
                  )}
                  {msg.type === 'image' && (
                    <img src={msg.content} alt="Chat attachment" className="max-w-full rounded-xl border-2 border-black max-h-64 object-cover" />
                  )}
                  {msg.type === 'audio' && (
                    <audio controls src={msg.content} className="max-w-[200px] md:max-w-[250px] h-10" preload="metadata" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-2.5 md:p-3 bg-white border-t-3 border-black flex gap-2 items-end">
        {isRecording ? (
          <div className="flex-1 bg-red-100 border-2 border-black rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-600 font-bold animate-pulse">
              <div className="w-3 h-3 bg-red-600 rounded-full" />
              Recording... {formatTime(recordingTime)}
            </div>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={stopRecording} className="p-2 bg-black text-white rounded-full cursor-pointer">
              <Square className="w-4 h-4 fill-current" />
            </motion.button>
          </div>
        ) : (
          <>
            <div className="flex gap-1.5">
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="p-2.5 md:p-3 bg-purple-200 border-2 border-black rounded-xl hover:bg-purple-300 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 cursor-pointer"
                aria-label="Send image"
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-black" /> : <ImageIcon className="w-5 h-5 text-black" />}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={startRecording}
                disabled={isUploading}
                className="p-2.5 md:p-3 bg-orange-200 border-2 border-black rounded-xl hover:bg-orange-300 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 cursor-pointer"
                aria-label="Send voice memo"
              >
                <Mic className="w-5 h-5 text-black" />
              </motion.button>
            </div>
            
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendText();
                  }
                }}
                placeholder="Type a message..."
                className="w-full bg-gray-100 border-2 border-black p-2.5 md:p-3 rounded-xl font-bold text-sm md:text-base text-black focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none custom-scrollbar"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '100px' }}
              />
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleSendText}
              disabled={!inputText.trim()}
              className={`p-2.5 md:p-3 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center transition-colors cursor-pointer
                ${inputText.trim() ? 'bg-lime-400 hover:bg-lime-500 text-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
