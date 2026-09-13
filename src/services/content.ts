import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, firebaseConfigured, storage } from '../lib/firebase';
import type {
  BirthdayWish,
  GuestbookEntry,
  Lead,
  LetterEntry,
  MemoryEntry,
  RiverComment,
  RiverReaction,
  RiverReactionKey,
  TimeCapsuleEntry,
} from '../types/content';

function requireFirestore() {
  if (!firebaseConfigured || !db) {
    throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* variables first.');
  }
  return db;
}

function requireStorage() {
  if (!firebaseConfigured || !storage) {
    throw new Error('Firebase Storage is not configured.');
  }
  return storage;
}

export function subscribePublishedMemories(callback: (items: MemoryEntry[]) => void): Unsubscribe {
  const q = query(collection(requireFirestore(), 'memories'), where('published', '==', true));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as MemoryEntry));
    callback(items.sort((a, b) => a.displayOrder - b.displayOrder));
  });
}

export async function listAllMemories(): Promise<MemoryEntry[]> {
  const snapshot = await getDocs(collection(requireFirestore(), 'memories'));
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() } as MemoryEntry))
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function createMemory(
  input: Omit<MemoryEntry, 'id' | 'createdAt' | 'updatedAt'>,
  file: File,
) {
  const cloudStorage = requireStorage();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `memories/${Date.now()}-${safeName}`;
  const objectRef = ref(cloudStorage, path);
  await uploadBytes(objectRef, file, { contentType: file.type });
  const imageUrl = await getDownloadURL(objectRef);
  const result = await addDoc(collection(requireFirestore(), 'memories'), {
    ...input,
    imageUrl,
    imagePath: path,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: result.id, imageUrl, imagePath: path };
}

export async function updateMemory(id: string, patch: Partial<MemoryEntry>) {
  const { id: _ignored, createdAt: _created, updatedAt: _updated, ...safePatch } = patch as MemoryEntry;
  return updateDoc(doc(requireFirestore(), 'memories', id), {
    ...safePatch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMemory(memory: MemoryEntry) {
  if (memory.imagePath) {
    try {
      await deleteObject(ref(requireStorage(), memory.imagePath));
    } catch {
      // Storage object may already be removed.
    }
  }
  return deleteDoc(doc(requireFirestore(), 'memories', memory.id));
}

export function subscribeApprovedWishes(callback: (items: BirthdayWish[]) => void): Unsubscribe {
  const q = query(collection(requireFirestore(), 'wishes'), where('status', '==', 'approved'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as BirthdayWish)));
  });
}

export async function submitWish(input: Pick<BirthdayWish, 'name' | 'relationship' | 'message'>) {
  return addDoc(collection(requireFirestore(), 'wishes'), {
    ...input,
    status: 'pending',
    featured: false,
    createdAt: serverTimestamp(),
  });
}

export async function listWishes(): Promise<BirthdayWish[]> {
  const snapshot = await getDocs(collection(requireFirestore(), 'wishes'));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as BirthdayWish));
}

export async function updateWish(id: string, patch: Partial<BirthdayWish>) {
  const { id: _ignored, ...safePatch } = patch as BirthdayWish;
  return updateDoc(doc(requireFirestore(), 'wishes', id), safePatch);
}

export async function deleteWish(id: string) {
  return deleteDoc(doc(requireFirestore(), 'wishes', id));
}

export async function submitLead(input: Omit<Lead, 'id' | 'status' | 'createdAt'>) {
  return addDoc(collection(requireFirestore(), 'leads'), {
    ...input,
    status: 'new',
    createdAt: serverTimestamp(),
  });
}

export async function listLeads(): Promise<Lead[]> {
  const snapshot = await getDocs(collection(requireFirestore(), 'leads'));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Lead));
}

export async function updateLead(id: string, patch: Partial<Lead>) {
  const { id: _ignored, ...safePatch } = patch as Lead;
  return updateDoc(doc(requireFirestore(), 'leads', id), safePatch);
}

export async function submitGuestbook(input: Pick<GuestbookEntry, 'name' | 'note'>) {
  return addDoc(collection(requireFirestore(), 'guestbook'), {
    ...input,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

export function subscribeApprovedGuestbook(callback: (items: GuestbookEntry[]) => void): Unsubscribe {
  const q = query(collection(requireFirestore(), 'guestbook'), where('status', '==', 'approved'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as GuestbookEntry)));
  });
}

export async function listGuestbook(): Promise<GuestbookEntry[]> {
  const snapshot = await getDocs(collection(requireFirestore(), 'guestbook'));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as GuestbookEntry));
}

export async function updateGuestbook(id: string, patch: Partial<GuestbookEntry>) {
  const { id: _ignored, ...safePatch } = patch as GuestbookEntry;
  return updateDoc(doc(requireFirestore(), 'guestbook', id), safePatch);
}

export async function submitTimeCapsule(input: Pick<TimeCapsuleEntry, 'name' | 'message'>) {
  return addDoc(collection(requireFirestore(), 'timeCapsule'), {
    ...input,
    unlockDate: '2027-10-30',
    createdAt: serverTimestamp(),
  });
}

export async function listTimeCapsule(): Promise<TimeCapsuleEntry[]> {
  const snapshot = await getDocs(collection(requireFirestore(), 'timeCapsule'));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as TimeCapsuleEntry));
}

// Legacy letter helpers are kept so older admin data does not break.
export function subscribePublishedLetters(callback: (items: LetterEntry[]) => void): Unsubscribe {
  const q = query(collection(requireFirestore(), 'letters'), where('published', '==', true));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as LetterEntry));
    callback(items.sort((a, b) => a.displayOrder - b.displayOrder));
  });
}

export async function listLetters(): Promise<LetterEntry[]> {
  const snapshot = await getDocs(collection(requireFirestore(), 'letters'));
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() } as LetterEntry))
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function createLetter(input: Omit<LetterEntry, 'id' | 'createdAt' | 'updatedAt'>) {
  return addDoc(collection(requireFirestore(), 'letters'), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateLetter(id: string, patch: Partial<LetterEntry>) {
  const { id: _ignored, createdAt: _created, updatedAt: _updated, ...safePatch } = patch as LetterEntry;
  return updateDoc(doc(requireFirestore(), 'letters', id), {
    ...safePatch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteLetter(id: string) {
  return deleteDoc(doc(requireFirestore(), 'letters', id));
}

// =========================================
// THE RIVERS OF MY LIFE
// =========================================

export function subscribeApprovedRiverComments(
  callback: (items: RiverComment[]) => void,
): Unsubscribe {
  const q = query(
    collection(requireFirestore(), 'riverComments'),
    where('status', '==', 'approved'),
  );

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(
      (item) => ({ id: item.id, ...item.data() } as RiverComment),
    );
    callback(items);
  });
}

export async function submitRiverComment(
  input: Pick<RiverComment, 'name' | 'message'>,
) {
  return addDoc(collection(requireFirestore(), 'riverComments'), {
    ...input,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

export async function listRiverComments(): Promise<RiverComment[]> {
  const snapshot = await getDocs(collection(requireFirestore(), 'riverComments'));
  return snapshot.docs.map(
    (item) => ({ id: item.id, ...item.data() } as RiverComment),
  );
}

export async function updateRiverComment(
  id: string,
  patch: Partial<RiverComment>,
) {
  const { id: _ignored, ...safePatch } = patch as RiverComment;
  return updateDoc(doc(requireFirestore(), 'riverComments', id), safePatch);
}

export async function deleteRiverComment(id: string) {
  return deleteDoc(doc(requireFirestore(), 'riverComments', id));
}

export function subscribeRiverReactions(
  callback: (items: RiverReaction[]) => void,
): Unsubscribe {
  return onSnapshot(collection(requireFirestore(), 'riverReactions'), (snapshot) => {
    callback(
      snapshot.docs.map(
        (item) => ({ id: item.id, ...item.data() } as RiverReaction),
      ),
    );
  });
}


export async function listRiverReactions(): Promise<RiverReaction[]> {
  const snapshot = await getDocs(collection(requireFirestore(), 'riverReactions'));
  return snapshot.docs.map(
    (item) => ({ id: item.id, ...item.data() } as RiverReaction),
  );
}

export async function saveRiverReaction(
  visitorId: string,
  reaction: RiverReactionKey,
) {
  return setDoc(doc(requireFirestore(), 'riverReactions', visitorId), {
    visitorId,
    reaction,
    createdAt: serverTimestamp(),
  });
}

export async function isAdmin(uid: string) {
  const snapshot = await getDoc(doc(requireFirestore(), 'admins', uid));
  return snapshot.exists() && snapshot.data()?.role === 'owner';
}
