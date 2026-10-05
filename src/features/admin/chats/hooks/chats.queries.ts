import { useQuery } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import { getAdminChatConversations, getAdminChatConversationMessages } from '../api/chats.api';
import type { AdminChatParticipant } from '../types';

export function useAdminChatConversations(userId: string, user: AdminChatParticipant | null) {
  return useQuery({
    queryKey: adminKeys.chatConversations(userId),
    queryFn: () => getAdminChatConversations(userId, user!),
    enabled: !!userId && !!user,
  });
}

export function useAdminChatConversationMessages(conversationId: string, enabled: boolean) {
  return useQuery({
    queryKey: adminKeys.chatConversationMessages(conversationId),
    queryFn: () => getAdminChatConversationMessages(conversationId),
    enabled: enabled && !!conversationId,
  });
}
