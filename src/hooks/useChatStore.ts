import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import type { Message } from '../types';

export function useChatStore(familyId: string | null) {
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial messages and subscribe to realtime
  useEffect(() => {
    if (!familyId) {
      setAllMessages([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const mapRow = (d: any): Message => ({
      id: d.id,
      familyId: d.family_id,
      senderId: d.sender_id,
      senderName: d.sender_name,
      senderType: d.sender_type,
      recipientId: d.recipient_id || null,
      content: d.content,
      type: d.type as 'text' | 'image' | 'audio',
      createdAt: new Date(d.created_at).getTime()
    });

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('family_id', familyId)
        .order('created_at', { ascending: true })
        .limit(200);

      if (!error && data && isMounted) {
        setAllMessages(data.map(mapRow));
      }
      if (isMounted) setIsLoading(false);
    };

    loadMessages();

    // Subscribe to realtime inserts
    const channel = supabase
      .channel(`chat_${familyId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `family_id=eq.${familyId}`,
        },
        (payload) => {
          const newMsg = mapRow(payload.new);
          setAllMessages((prev) => {
            if (prev.find(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [familyId]);

  // Filter messages for a specific channel
  const getMessagesForChannel = useCallback((channelId: string, currentUserId: string): Message[] => {
    if (channelId === 'family') {
      // Group chat: only messages with no recipient
      return allMessages.filter(m => !m.recipientId);
    }
    // DM: messages between me and the other person
    return allMessages.filter(m =>
      (m.senderId === currentUserId && m.recipientId === channelId) ||
      (m.senderId === channelId && m.recipientId === currentUserId)
    );
  }, [allMessages]);

  const sendMessage = useCallback(async (
    senderId: string,
    senderName: string,
    senderType: 'parent' | 'child',
    content: string,
    type: 'text' | 'image' | 'audio' = 'text',
    recipientId: string | null = null
  ) => {
    if (!familyId) return;

    const { error } = await supabase.from('messages').insert({
      family_id: familyId,
      sender_id: senderId,
      sender_name: senderName,
      sender_type: senderType,
      content,
      type,
      recipient_id: recipientId
    });

    if (error) {
      console.error('[Chat] Failed to send message:', error);
    }
  }, [familyId]);

  const uploadMediaAndSend = useCallback(async (
    senderId: string,
    senderName: string,
    senderType: 'parent' | 'child',
    file: File | Blob,
    type: 'image' | 'audio',
    recipientId: string | null = null
  ) => {
    if (!familyId) return;

    let ext: string;
    if (type === 'audio') {
      const mime = file.type || '';
      if (mime.includes('mp4')) ext = 'mp4';
      else if (mime.includes('ogg')) ext = 'ogg';
      else if (mime.includes('wav')) ext = 'wav';
      else ext = 'webm';
    } else {
      ext = (file as File).name?.split('.').pop() || 'jpg';
    }
    const filename = `${familyId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

    const { data, error } = await supabase.storage
      .from('chat_media')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || (type === 'audio' ? 'audio/webm' : 'image/jpeg'),
      });

    if (error || !data) {
      console.error('[Chat] Failed to upload media:', error);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from('chat_media').getPublicUrl(data.path);

    if (publicUrlData.publicUrl) {
      await sendMessage(senderId, senderName, senderType, publicUrlData.publicUrl, type, recipientId);
    }
  }, [familyId, sendMessage]);

  // Get unread count hint per channel (simple: count messages I haven't "seen")
  const getLastMessageForChannel = useCallback((channelId: string, currentUserId: string): Message | null => {
    const msgs = channelId === 'family'
      ? allMessages.filter(m => !m.recipientId)
      : allMessages.filter(m =>
          (m.senderId === currentUserId && m.recipientId === channelId) ||
          (m.senderId === channelId && m.recipientId === currentUserId)
        );
    return msgs.length > 0 ? msgs[msgs.length - 1] : null;
  }, [allMessages]);

  return {
    allMessages,
    isLoading,
    getMessagesForChannel,
    getLastMessageForChannel,
    sendMessage,
    uploadMediaAndSend,
    // Keep backward compat
    messages: allMessages
  };
}
