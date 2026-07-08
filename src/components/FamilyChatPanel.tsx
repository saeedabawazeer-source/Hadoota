import React, { useState, useMemo } from 'react';
import { MessageCircle, Users, ArrowLeft, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { ChatRoom } from './ChatRoom';
import type { Message, KidProfile, ParentProfile } from '../types';
import type { useChatStore } from '../hooks/useChatStore';

interface FamilyMember {
  id: string;
  name: string;
  type: 'parent' | 'child';
  avatar?: string;
}

interface FamilyChatPanelProps {
  chatStore: ReturnType<typeof useChatStore>;
  currentUserId: string;
  currentUserName: string;
  currentUserType: 'parent' | 'child';
  familyMembers: FamilyMember[];
  compact?: boolean; // smaller sizing for embedded use
}

export function FamilyChatPanel({
  chatStore,
  currentUserId,
  currentUserName,
  currentUserType,
  familyMembers,
  compact = false,
}: FamilyChatPanelProps) {
  // 'family' = group, or a member id for DMs
  const [activeChannel, setActiveChannel] = useState<string | null>(null);

  // Figure out who we're chatting with
  const activeMember = activeChannel && activeChannel !== 'family'
    ? familyMembers.find(m => m.id === activeChannel) || null
    : null;

  const channelMessages = useMemo(() => {
    if (!activeChannel) return [];
    return chatStore.getMessagesForChannel(activeChannel, currentUserId);
  }, [activeChannel, chatStore, currentUserId]);

  // Build channel list with last message preview
  const channels = useMemo(() => {
    const list: { id: string; label: string; type: 'group' | 'dm'; avatar?: string; lastMsg: Message | null }[] = [
      {
        id: 'family',
        label: 'Family Chat',
        type: 'group',
        lastMsg: chatStore.getLastMessageForChannel('family', currentUserId),
      },
    ];

    for (const member of familyMembers) {
      if (member.id === currentUserId) continue; // Don't show self
      list.push({
        id: member.id,
        label: member.name,
        type: 'dm',
        avatar: member.avatar,
        lastMsg: chatStore.getLastMessageForChannel(member.id, currentUserId),
      });
    }
    return list;
  }, [familyMembers, currentUserId, chatStore]);

  // --- Channel List View ---
  if (!activeChannel) {
    return (
      <div className={`flex flex-col gap-3 ${compact ? '' : 'max-w-lg mx-auto w-full'}`}>
        {channels.map(ch => {
          const preview = ch.lastMsg
            ? ch.lastMsg.type === 'text'
              ? ch.lastMsg.content.slice(0, 40) + (ch.lastMsg.content.length > 40 ? '...' : '')
              : ch.lastMsg.type === 'image' ? '📷 Photo' : '🎤 Voice memo'
            : 'No messages yet';

          return (
            <motion.button
              key={ch.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveChannel(ch.id)}
              className="bg-white border-3 border-black p-3 md:p-4 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 cursor-pointer hover:bg-purple-50 transition-colors text-left w-full"
            >
              {/* Avatar */}
              <div className={`shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl border-3 border-black flex items-center justify-center ${ch.type === 'group' ? 'bg-purple-400' : 'bg-lime-400'}`}>
                {ch.type === 'group'
                  ? <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  : <User className="w-5 h-5 md:w-6 md:h-6 text-black" />
                }
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-sm md:text-base uppercase truncate">{ch.label}</h4>
                <p className="text-xs md:text-sm text-gray-500 font-bold truncate">{preview}</p>
              </div>
              {/* Time */}
              {ch.lastMsg && (
                <span className="text-[10px] font-bold text-gray-400 shrink-0">
                  {new Date(ch.lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </motion.button>
          );
        })}

        {channels.length <= 1 && (
          <div className="text-center py-6 text-gray-400 font-bold text-sm uppercase tracking-widest">
            No other family members yet
          </div>
        )}
      </div>
    );
  }

  // --- Chat View ---
  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Back bar */}
      <div className="shrink-0 flex items-center gap-3 mb-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveChannel(null)}
          className="p-2 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-purple-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-black" />
        </motion.button>
        <div className={`shrink-0 w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center ${activeChannel === 'family' ? 'bg-purple-400' : 'bg-lime-400'}`}>
          {activeChannel === 'family'
            ? <Users className="w-4 h-4 text-white" />
            : <User className="w-4 h-4 text-black" />
          }
        </div>
        <h3 className="font-black text-sm md:text-base uppercase truncate">
          {activeChannel === 'family' ? 'Family Chat' : activeMember?.name || 'Chat'}
        </h3>
      </div>

      {/* Chat room fills remaining space */}
      <div className="flex-1 min-h-0">
        <ChatRoom
          messages={channelMessages}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          currentUserType={currentUserType}
          onSendMessage={(sid, sname, stype, content, type) => {
            const recipientId = activeChannel === 'family' ? null : activeChannel;
            chatStore.sendMessage(sid, sname, stype, content, type || 'text', recipientId);
          }}
          onUploadMedia={async (sid, sname, stype, file, type) => {
            const recipientId = activeChannel === 'family' ? null : activeChannel;
            await chatStore.uploadMediaAndSend(sid, sname, stype, file, type, recipientId);
          }}
        />
      </div>
    </div>
  );
}
