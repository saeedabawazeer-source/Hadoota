import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wand2, ArrowLeft, ArrowRight, Star, Loader2, PlayCircle, X } from 'lucide-react';
import { GoogleGenAI, Modality, Type } from '@google/genai';

export function StoryEngine({ topic, onClose, kidName }: { topic: string; onClose: () => void; kidName: string }) {
  const [prompt, setPrompt] = useState(topic === 'Magic' ? '' : topic);
  const [pages, setPages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingState, setLoadingState] = useState('');
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const hasGenerated = useRef(false);

  useEffect(() => {
    if (topic !== 'Magic' && !hasGenerated.current) {
      hasGenerated.current = true;
      generateStory();
    }
  }, [topic]);

  useEffect(() => {
    const playPageAudio = async () => {
      if (pages.length > 0 && pages[currentPage] && !pages[currentPage].loading) {
        if (audioSourceRef.current) { try { audioSourceRef.current.stop(); } catch (e) {} audioSourceRef.current = null; }
        window.speechSynthesis.cancel();
        const page = pages[currentPage];
        if (!page.audioData) {
          const utterance = new SpeechSynthesisUtterance(page.text);
          utterance.rate = 0.9; utterance.pitch = 1.1;
          window.speechSynthesis.speak(utterance);
          return;
        }
        try {
          if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          const audioCtx = audioCtxRef.current;
          if (audioCtx.state === 'suspended') await audioCtx.resume();
          const binaryString = window.atob(page.audioData);
          const validLen = binaryString.length - (binaryString.length % 2);
          const bytes = new Uint8Array(validLen);
          for (let i = 0; i < validLen; i++) bytes[i] = binaryString.charCodeAt(i);
          const int16Array = new Int16Array(bytes.buffer);
          const audioBuffer = audioCtx.createBuffer(1, int16Array.length, 24000);
          const channelData = audioBuffer.getChannelData(0);
          for (let i = 0; i < int16Array.length; i++) channelData[i] = int16Array[i] / 32768.0;
          const source = audioCtx.createBufferSource();
          source.buffer = audioBuffer; source.connect(audioCtx.destination); source.start();
          audioSourceRef.current = source;
        } catch (err) {
          const utterance = new SpeechSynthesisUtterance(page.text);
          utterance.rate = 0.9; utterance.pitch = 1.1;
          window.speechSynthesis.speak(utterance);
        }
      }
    };
    playPageAudio();
    return () => { if (audioSourceRef.current) { try { audioSourceRef.current.stop(); } catch (e) {} } window.speechSynthesis.cancel(); };
  }, [currentPage, pages]);

  const generateStory = async () => {
    if (!prompt) return;
    setLoadingState('Writing the story...');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      const textRes = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a cohesive 10-page children's story about: ${prompt}. For a child named ${kidName}. 
        CRITICAL SAFETY RULE: If the topic is inappropriate for a child (violence, sexual content, profanity, adult themes), set 'isAppropriate' to false with a polite 'refusalReason'. 
        If safe, write a story with clear beginning, middle, climax, and moral. Each page: exactly 1 short sentence (max 15 words). 
        Provide 'visualStyle' and 'mainCharacterDesign' for consistency.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isAppropriate: { type: Type.BOOLEAN }, refusalReason: { type: Type.STRING },
              title: { type: Type.STRING }, moral: { type: Type.STRING },
              visualStyle: { type: Type.STRING }, mainCharacterDesign: { type: Type.STRING },
              pages: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { text: { type: Type.STRING }, imagePrompt: { type: Type.STRING } }, required: ["text", "imagePrompt"] } }
            }, required: ["isAppropriate"]
          }
        }
      });
      const storyData = JSON.parse(textRes.text || '{}');
      if (storyData.isAppropriate === false) {
        setLoadingState(storyData.refusalReason || "I can't write a story about that. Let's pick a fun topic!");
        setTimeout(() => { setLoadingState(''); onClose(); }, 4000);
        return;
      }
      const visualStyle = storyData.visualStyle || '3D Pixar style, vibrant colors';
      const characterDesign = storyData.mainCharacterDesign || 'A cute kid';
      const initialPages = (storyData.pages || []).slice(0, 10).map((p: any) => ({ text: p.text, imagePrompt: p.imagePrompt, imageUrl: '', audioData: '', loading: true }));
      setPages(initialPages); setCurrentPage(0); setLoadingState('');

      for (let index = 0; index < initialPages.length; index++) {
        const page = initialPages[index];
        const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(`Children's book illustration. Style: ${visualStyle}. Character: ${characterDesign}. Scene: ${page.imagePrompt}`)}?width=800&height=600&nologo=true`;
        let audioBase64 = '';
        try {
          const audioRes = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Say cheerfully: ${page.text}` }] }],
            config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } } },
          });
          audioBase64 = audioRes.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || '';
        } catch (e) { /* TTS may fail, browser TTS fallback */ }
        setPages(prev => { const n = [...prev]; n[index] = { ...n[index], imageUrl: imgUrl, audioData: audioBase64, loading: false }; return n; });
      }
    } catch (e) {
      console.error(e);
      setLoadingState('Oops! The magic machine had a hiccup. Try again!');
      setTimeout(() => setLoadingState(''), 3000);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4 md:gap-6 min-h-0">
      {pages.length === 0 && !loadingState && (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 md:gap-8 max-w-xl mx-auto w-full">
          <Wand2 className="w-20 h-20 md:w-28 md:h-28 text-lime-400 mx-auto shrink-0" />
          <h2 className="text-4xl md:text-6xl font-bold text-white uppercase shrink-0" >Magic Story</h2>
          <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="What is it about?"
            className="w-full bg-white border border-slate-200 p-4 md:p-6 rounded-2xl md:rounded-3xl text-xl md:text-3xl font-bold text-slate-800 text-center shadow-xl shadow-slate-200/50 focus:outline-none focus:ring-4 focus:ring-lime-400 shrink-0"
            aria-label="Story topic" />
          <button onClick={generateStory} disabled={!prompt}
            className="w-full bg-lime-400 border border-slate-200 text-slate-800 py-4 md:py-6 rounded-2xl md:rounded-3xl font-bold text-2xl md:text-3xl uppercase shadow-xl shadow-slate-200/50 disabled:opacity-50 shrink-0">
            Generate
          </button>
        </div>
      )}
      {loadingState && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 md:gap-8">
          <Loader2 className="w-16 h-16 md:w-24 md:h-24 text-lime-400 animate-spin shrink-0" />
          <p className="font-bold text-white text-2xl md:text-4xl uppercase tracking-widest shrink-0 text-center" >{loadingState}</p>
        </div>
      )}
      {pages.length > 0 && !loadingState && (
        <motion.div key={currentPage} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col gap-4 md:gap-6 min-h-0">
          <div className="flex justify-between items-center shrink-0">
            <span className="bg-white text-slate-800 font-bold px-4 py-2 rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50 uppercase tracking-widest">Page {currentPage + 1}/{pages.length}</span>
            <button onClick={() => { setPages([]); setPrompt(''); }} className="bg-white text-slate-800 font-bold px-4 py-2 rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50 uppercase hover:bg-red-400 transition-colors">Close Book</button>
          </div>
          <div className="w-full flex-1 bg-slate-800 border border-slate-200 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 relative flex items-center justify-center min-h-0">
            {pages[currentPage].imageUrl ? (
              <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={pages[currentPage].imageUrl} alt="Story Illustration" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-3"><Loader2 className="w-10 h-10 text-lime-400 animate-spin" /><span className="font-bold uppercase text-lime-400 text-sm tracking-widest">Drawing Page...</span></div>
            )}
          </div>
          <div className="shrink-0 bg-white border border-slate-200 p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/50 max-h-[30vh] overflow-y-auto">
            <p className="font-bold text-slate-800 whitespace-pre-wrap text-xl md:text-3xl leading-relaxed uppercase">{pages[currentPage].text}</p>
          </div>
          <div className="flex gap-4 shrink-0">
            <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}
              className="flex-1 bg-white border border-slate-200 text-slate-800 py-4 md:py-5 rounded-2xl font-bold text-xl uppercase shadow-xl shadow-slate-200/50 disabled:opacity-50 flex items-center justify-center gap-2">
              <ArrowLeft className="w-6 h-6" /> Prev
            </button>
            {currentPage < pages.length - 1 ? (
              <button onClick={() => setCurrentPage(p => p + 1)}
                className="flex-1 bg-lime-400 border border-slate-200 text-slate-800 py-4 md:py-5 rounded-2xl font-bold text-xl uppercase shadow-xl shadow-slate-200/50 flex items-center justify-center gap-2">
                Next <ArrowRight className="w-6 h-6" />
              </button>
            ) : (
              <button onClick={() => { setPages([]); setPrompt(''); }}
                className="flex-1 bg-purple-500 border border-slate-200 text-white py-4 md:py-5 rounded-2xl font-bold text-xl uppercase shadow-xl shadow-slate-200/50 flex items-center justify-center gap-2">
                Finish <Star className="w-6 h-6 fill-white" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function StoryCard({ title, image, onClick }: { title: string; image: string; onClick: () => void }) {
  return (
    <motion.div whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }} onClick={onClick}
      className="bg-white border border-slate-200 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 md:shadow-xl shadow-slate-200/50 cursor-pointer group flex flex-col">
      <div className="aspect-video bg-slate-800 overflow-hidden relative border-b-4 border-black">
        <img src={`https://image.pollinations.ai/prompt/cute%20cartoon%20${encodeURIComponent(image)}%203d%20pixar?width=600&height=400&nologo=true`} alt={title} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-slate-800/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <PlayCircle className="w-12 h-12 md:w-16 md:h-16 text-lime-400" />
        </div>
      </div>
      <div className="p-3 md:p-5 bg-purple-500 flex items-center justify-center shrink-0">
        <h4 className="font-bold text-white text-lg md:text-2xl uppercase tracking-tight text-center leading-none" >{title}</h4>
      </div>
    </motion.div>
  );
}
