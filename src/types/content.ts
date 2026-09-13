export type MemoryCategory =
  | 'Working'
  | 'Learning'
  | 'Events'
  | 'Travel'
  | 'People'
  | 'Milestones'
  | 'Life'
  | 'Other';

export interface MemoryEntry {
  id: string;
  title: string;
  caption: string;
  story?: string;
  category: MemoryCategory;
  dateLabel?: string;
  imageUrl: string;
  imagePath?: string;
  altText: string;
  displayOrder: number;
  published: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface BirthdayWish {
  id: string;
  name: string;
  relationship: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  createdAt?: unknown;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  preferredContact?: 'Email' | 'WhatsApp' | 'Phone';
  organisation?: string;
  projectType: string;
  brief: string;
  budget?: string;
  status: 'new' | 'contacted' | 'negotiating' | 'won' | 'closed';
  createdAt?: unknown;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  note?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: unknown;
}

export interface TimeCapsuleEntry {
  id: string;
  name: string;
  message: string;
  unlockDate: string;
  createdAt?: unknown;
}

export interface LetterEntry {
  id: string;
  senderName: string;
  title: string;
  message: string;
  displayOrder: number;
  published: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface RiverComment {
  id: string;
  name: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: unknown;
}

export type RiverReactionKey =
  | 'felt'
  | 'inspired'
  | 'rooting'
  | 'respect';

export interface RiverReaction {
  id: string;
  visitorId: string;
  reaction: RiverReactionKey;
  createdAt?: unknown;
}
