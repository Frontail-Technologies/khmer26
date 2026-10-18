import { apiClient } from '@/lib/api/client';
import type { AdminChatConversation, AdminChatListing, AdminChatMessage, AdminChatParticipant } from '../types';

interface RawConversationRow {
  conversation?: { id: string; displayId: string; updatedAt: string };
  listing?: { id: string; title: string; price: string; currency: string; imageUrl?: string } | null;
  otherParticipant?: {
    userId: string;
    user?: { id: string; email?: string | null };
    sellerProfile?: { shopName: string } | null;
  } | null;
  lastMessage?: { body: string; createdAt: string } | null;
}

interface RawMessageRow {
  id: string;
  conversationId: string;
  senderUserId: string;
  type: "text" | "image" | "offer" | "system";
  body: string;
  media?: {
    id: string;
    url?: string;
    originalFilename?: string | null;
    mimeType: string;
    sizeBytes: number;
  } | null;
  createdAt: string;
}

interface ConversationContext {
  id: string;
  shopName?: string | null;
  email?: string | null;
}

function participantFromRow(row: RawConversationRow): AdminChatParticipant {
  const id = row.otherParticipant?.userId || row.otherParticipant?.user?.id || 'unknown';
  const shopName = row.otherParticipant?.sellerProfile?.shopName;
  return {
    id,
    name: shopName || row.otherParticipant?.user?.email?.split('@')[0] || 'User account',
    businessName: shopName || undefined,
    phone: '',
    email: row.otherParticipant?.user?.email || '',
    accountType: shopName ? 'seller' : 'buyer',
  };
}

export async function getAdminChatConversations(
  userId: string,
  user: AdminChatParticipant,
  params: { page?: number; limit?: number } = {}
): Promise<AdminChatConversation[]> {
  const res = await apiClient.get<RawConversationRow[]>('/admin/chats/conversations', {
    params: { userId, page: params.page || 1, limit: params.limit || 50 },
  });
  const rows = res.data || [];
  return rows
    .filter((r) => r.conversation)
    .map((r) => {
      const other = participantFromRow(r);
      return {
        id: r.conversation!.id,
        displayId: r.conversation!.displayId,
        participantA: user,
        participantB: other,
        listing: r.listing
          ? {
              id: r.listing.id,
              title: r.listing.title,
              price: Number(r.listing.price),
              currency: r.listing.currency,
              imageUrl: r.listing.imageUrl,
            }
          : undefined,
        messages: [],
        lastMessage: r.lastMessage?.body || '(no messages yet)',
        lastMessageAt: r.lastMessage?.createdAt ?? r.conversation!.updatedAt,
      };
    });
}

export async function getAdminChatConversationMessages(conversationId: string): Promise<{
  displayId: string;
  messages: AdminChatMessage[];
  participants: ConversationContext[];
  listing?: AdminChatListing;
}> {
  const res = await apiClient.get<{
    conversation: {
      displayId: string;
      listing?: { id: string; title: string; price: string; currency: string; imageUrl?: string } | null;
      participants: { userId: string; shopName: string | null; email: string | null }[];
    };
    messages: RawMessageRow[];
  }>(`/admin/chats/conversations/${conversationId}/messages`, { params: { limit: 100 } });

  const participants = res.data?.conversation.participants || [];
  const nameByUserId = new Map(
    participants.map((p) => [p.userId, p.shopName || p.email?.split('@')[0] || 'User account'])
  );

  const messages = (res.data?.messages || []).map((m) => ({
    id: m.id,
    conversationId: m.conversationId,
    senderId: m.senderUserId,
    senderName: nameByUserId.get(m.senderUserId) || 'User account',
    type: m.type,
    text: m.body,
    imageUrl: m.type === 'image' ? m.media?.url : undefined,
    imageAlt: m.media?.originalFilename || undefined,
    createdAt: m.createdAt,
  }));

  return {
    displayId: res.data?.conversation.displayId || "CHAT",
    messages,
    participants: participants.map((p) => ({
      id: p.userId,
      shopName: p.shopName,
      email: p.email,
    })),
    listing: res.data?.conversation.listing
      ? {
          id: res.data.conversation.listing.id,
          title: res.data.conversation.listing.title,
          price: Number(res.data.conversation.listing.price),
          currency: res.data.conversation.listing.currency,
          imageUrl: res.data.conversation.listing.imageUrl,
        }
      : undefined,
  };
}
