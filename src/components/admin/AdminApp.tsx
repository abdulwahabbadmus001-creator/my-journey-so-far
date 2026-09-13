import { FormEvent, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { auth, firebaseConfigured } from '../../lib/firebase';
import {
  createLetter,
  createMemory,
  deleteLetter,
  deleteMemory,
  deleteWish,
  isAdmin,
  listAllMemories,
  listGuestbook,
  listLeads,
  listLetters,
  listRiverComments,
  listRiverReactions,
  listTimeCapsule,
  listWishes,
  updateGuestbook,
  updateLead,
  updateLetter,
  updateMemory,
  updateRiverComment,
  deleteRiverComment,
  updateWish,
} from '../../services/content';
import type { BirthdayWish, GuestbookEntry, Lead, LetterEntry, MemoryCategory, MemoryEntry, RiverComment, RiverReaction, TimeCapsuleEntry } from '../../types/content';

type Tab = 'overview' | 'memories' | 'wishes' | 'rivers' | 'capsule' | 'leads' | 'guestbook';

const categories: MemoryCategory[] = ['Working', 'Learning', 'Events', 'Travel', 'People', 'Milestones', 'Life', 'Other'];
const demoEnabled = import.meta.env.DEV && import.meta.env.VITE_ADMIN_DEMO === 'true';

const demoMemories: MemoryEntry[] = [
  { id: 'demo-1', title: 'Building after hours', caption: 'A working session where an idea started becoming a product.', story: 'Use this longer field for the context behind the photograph.', category: 'Working', dateLabel: '2026', imageUrl: '', altText: 'Wahab working on a computer', displayOrder: 1, published: true },
  { id: 'demo-2', title: 'Learning in public', caption: 'A chapter from classes, research, a programme or a technical session.', category: 'Learning', dateLabel: '2026', imageUrl: '', altText: 'Wahab during a learning session', displayOrder: 2, published: true },
];

export default function AdminApp() {
  const [user, setUser] = useState<User | null>(null);
  const [authorised, setAuthorised] = useState(false);
  const [authLoading, setAuthLoading] = useState(firebaseConfigured && !demoEnabled);
  const [tab, setTab] = useState<Tab>('overview');
  const [memories, setMemories] = useState<MemoryEntry[]>(demoEnabled ? demoMemories : []);
  const [wishes, setWishes] = useState<BirthdayWish[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>([]);
  const [letters, setLetters] = useState<LetterEntry[]>([]);
  const [riverComments, setRiverComments] = useState<RiverComment[]>([]);
  const [riverReactions, setRiverReactions] = useState<RiverReaction[]>([]);
  const [capsule, setCapsule] = useState<TimeCapsuleEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (demoEnabled) {
      setAuthorised(true);
      setAuthLoading(false);
      return;
    }
    if (!firebaseConfigured || !auth) {
      setAuthLoading(false);
      return;
    }
    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setAuthorised(false);
        setAuthLoading(false);
        return;
      }
      try { setAuthorised(await isAdmin(currentUser.uid)); }
      catch { setAuthorised(false); }
      finally { setAuthLoading(false); }
    });
  }, []);

  const loadData = async () => {
    if (demoEnabled || !firebaseConfigured || !authorised) return;
    setRefreshing(true);
    try {
      const [
        memoryData,
        wishData,
        leadData,
        guestbookData,
        letterData,
        riverCommentData,
        riverReactionData,
        capsuleData,
      ] = await Promise.all([
        listAllMemories(),
        listWishes(),
        listLeads(),
        listGuestbook(),
        listLetters(),
        listRiverComments(),
        listRiverReactions(),
        listTimeCapsule(),
      ]);
      setMemories(memoryData);
      setWishes(wishData);
      setLeads(leadData);
      setGuestbook(guestbookData);
      setLetters(letterData);
      setRiverComments(riverCommentData);
      setRiverReactions(riverReactionData);
      setCapsule(capsuleData);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not load dashboard data.');
    } finally { setRefreshing(false); }
  };

  useEffect(() => { void loadData(); }, [authorised]);

  if (authLoading) return <div className="admin-loading">Opening private studio…</div>;
  if (!firebaseConfigured && !demoEnabled) return <FirebaseSetup />;
  if (!authorised) return <AdminLogin user={user} />;

  const counts = {
    publishedMemories: memories.filter((item) => item.published).length,
    pendingWishes: wishes.filter((item) => item.status === 'pending').length,
    newLeads: leads.filter((item) => item.status === 'new').length,
    pendingGuests: guestbook.filter((item) => item.status === 'pending').length,
    pendingRiverComments: riverComments.filter((item) => item.status === 'pending').length,
    riverReactions: riverReactions.length,
    capsuleNotes: capsule.length,
  };

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/"><strong>WOB</strong><span>Birthday Studio</span></a>
        <nav>
          {(['overview','memories','wishes','rivers','capsule','leads','guestbook'] as Tab[]).map((item) => (
            <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)} type="button">
              <span>{item === 'overview' ? '01' : item === 'memories' ? '02' : item === 'wishes' ? '03' : item === 'rivers' ? '04' : item === 'capsule' ? '05' : item === 'leads' ? '06' : '07'}</span>
              {item === 'overview' ? 'Overview' : item === 'memories' ? 'Photo Stories' : item === 'wishes' ? 'Wishes' : item === 'rivers' ? 'River Story' : item === 'capsule' ? 'Time Capsule' : item === 'leads' ? 'Leads' : 'Guestbook'}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          {demoEnabled ? <span>Development demo mode</span> : <span>{user?.email}</span>}
          <a href="/" target="_blank" rel="noreferrer">View public site ↗</a>
          {!demoEnabled && auth && <button type="button" onClick={() => signOut(auth)}>Sign out</button>}
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div><span>PRIVATE ADMIN</span><h1>{tab === 'memories' ? 'Photo Stories' : tab === 'rivers' ? 'The Rivers Of My Life' : tab.charAt(0).toUpperCase() + tab.slice(1)}</h1></div>
          <div className="admin-top-actions">
            {refreshing && <span>Refreshing…</span>}
            {!demoEnabled && <button type="button" onClick={() => void loadData()}>Refresh</button>}
          </div>
        </header>
        {notice && <div className="admin-notice"><span>{notice}</span><button onClick={() => setNotice('')} type="button">×</button></div>}

        {tab === 'overview' && <Overview counts={counts} />}
        {tab === 'memories' && <MemoriesManager items={memories} setItems={setMemories} setNotice={setNotice} />}
        {tab === 'wishes' && <WishesManager items={wishes} setItems={setWishes} setNotice={setNotice} />}
        {tab === 'rivers' && <RiversManager comments={riverComments} setComments={setRiverComments} reactions={riverReactions} setNotice={setNotice} />}
        {tab === 'capsule' && <CapsuleManager items={capsule} />}
        {tab === 'leads' && <LeadsManager items={leads} setItems={setLeads} setNotice={setNotice} />}
        {tab === 'guestbook' && <GuestbookManager items={guestbook} setItems={setGuestbook} setNotice={setNotice} />}
      </section>
    </main>
  );
}

function FirebaseSetup() {
  return (
    <main className="admin-setup">
      <a href="/">← Public site</a>
      <span className="admin-kicker">PRIVATE STUDIO</span>
      <h1>Connect Firebase to activate the admin.</h1>
      <p>The interface is already built. Add your Firebase web-app values to <code>.env.local</code>, enable Email/Password Authentication and Firestore, then create your owner record. Photo uploads use Cloud Storage, which Firebase currently requires a Blaze billing account to activate.</p>
      <pre>{`VITE_FIREBASE_API_KEY=\nVITE_FIREBASE_AUTH_DOMAIN=\nVITE_FIREBASE_PROJECT_ID=\nVITE_FIREBASE_STORAGE_BUCKET=\nVITE_FIREBASE_MESSAGING_SENDER_ID=\nVITE_FIREBASE_APP_ID=`}</pre>
      <p>Follow <code>FIREBASE_SETUP.md</code> in the project for the exact activation sequence. For design-only preview on your computer, set <code>VITE_ADMIN_DEMO=true</code>. Never deploy that flag to production.</p>
    </main>
  );
}

function AdminLogin({ user }: { user: User | null }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(user ? 'This Firebase account is signed in but is not listed as an owner in admins/{uid}.' : '');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!auth) return;
    setLoading(true); setError('');
    try { await signInWithEmailAndPassword(auth, email, password); }
    catch { setError('Login failed. Check your email/password and Firebase Authentication setup.'); }
    finally { setLoading(false); }
  };

  return (
    <main className="admin-login-shell">
      <section className="admin-login-copy"><span>OCTOBER CHAPTER</span><h1>The private studio.</h1><p>Prepare photographs, moderate wishes, review enquiries and manage the birthday experience before October 30.</p></section>
      <form className="admin-login-form" onSubmit={submit}>
        <span>OWNER ACCESS</span><h2>Welcome back.</h2>
        <label>Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Password<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {error && <p className="admin-form-error">{error}</p>}
        <button disabled={loading} type="submit">{loading ? 'Checking…' : 'Enter studio'}</button>
        <a href="/">Return to public site</a>
      </form>
    </main>
  );
}

function Overview({ counts }: { counts: Record<string, number> }) {
  const cards = [
    ['Published photo stories', counts.publishedMemories, 'Curated moments currently visible'],
    ['Pending wishes', counts.pendingWishes, 'Messages waiting for moderation'],
    ['New client leads', counts.newLeads, 'People interested in working with you'],
    ['Guestbook queue', counts.pendingGuests, 'Entries waiting for approval'],
    ['River comment queue', counts.pendingRiverComments, 'Reader reflections waiting for moderation'],
    ['River reactions', counts.riverReactions, 'Responses to The Rivers Of My Life'],
    ['Time-capsule notes', counts.capsuleNotes, 'Private notes for the next October 30'],
  ];
  return (
    <div className="admin-overview">
      <div className="admin-stat-grid">{cards.map(([label,value,note]) => <article key={String(label)}><span>{label}</span><strong>{value}</strong><p>{note}</p></article>)}</div>
      <section className="admin-launch-card"><span>PUBLIC LAUNCH</span><h2>October 30 · Africa/Lagos</h2><p>The public gate stays closed before the birthday. You can continue preparing content here privately.</p><div><i />Pre-birthday gate configured</div></section>
    </div>
  );
}

function MemoriesManager({ items, setItems, setNotice }: { items: MemoryEntry[]; setItems: (items: MemoryEntry[]) => void; setNotice: (message: string) => void }) {
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<MemoryEntry | null>(null);
  const ordered = useMemo(() => [...items].sort((a,b) => a.displayOrder - b.displayOrder), [items]);

  const togglePublished = async (item: MemoryEntry) => {
    const next = !item.published;
    try {
      if (!demoEnabled) await updateMemory(item.id, { published: next });
      setItems(items.map((memory) => memory.id === item.id ? { ...memory, published: next } : memory));
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not update photo story.'); }
  };

  const remove = async (item: MemoryEntry) => {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    try {
      if (!demoEnabled) await deleteMemory(item);
      setItems(items.filter((memory) => memory.id !== item.id));
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not delete photo story.'); }
  };

  return (
    <div className="admin-manager">
      <div className="manager-intro"><div><h2>Moments Behind the Journey</h2><p>Add photographs of you working, learning, attending events, travelling, celebrating milestones or sharing moments with people. Each image can carry its own context.</p></div><button type="button" onClick={() => setCreating(true)}>+ Add photo story</button></div>
      <div className="memory-admin-grid">
        {ordered.length === 0 && <div className="admin-empty"><h3>No photographs yet.</h3><p>Your first photo story will appear here after upload.</p></div>}
        {ordered.map((item) => <article className="memory-admin-card" key={item.id}>
          <div className="memory-admin-image">{item.imageUrl ? <img src={item.imageUrl} alt={item.altText} /> : <div><span>PHOTO</span><small>{item.category}</small></div>}<b className={item.published ? 'published' : ''}>{item.published ? 'Published' : 'Hidden'}</b></div>
          <div className="memory-admin-body"><span>{item.category}{item.dateLabel ? ` · ${item.dateLabel}` : ''}</span><h3>{item.title}</h3><p>{item.caption}</p><div><button onClick={() => setEditing(item)} type="button">Edit</button><button onClick={() => void togglePublished(item)} type="button">{item.published ? 'Hide' : 'Publish'}</button><button onClick={() => void remove(item)} type="button">Delete</button></div></div>
        </article>)}
      </div>
      {creating && <MemoryComposer onClose={() => setCreating(false)} onSaved={(item) => { setItems([...items, item]); setCreating(false); }} setNotice={setNotice} />}
      {editing && <MemoryComposer existing={editing} onClose={() => setEditing(null)} onSaved={(item) => { setItems(items.map((memory) => memory.id === item.id ? item : memory)); setEditing(null); }} setNotice={setNotice} />}
    </div>
  );
}

function MemoryComposer({ onClose, onSaved, setNotice, existing }: { onClose: () => void; onSaved: (item: MemoryEntry) => void; setNotice: (message: string) => void; existing?: MemoryEntry }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(existing?.imageUrl || '');
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState<MemoryCategory>(existing?.category || 'Working');

  useEffect(() => {
    if (!file) { setPreview(existing?.imageUrl || ''); return; }
    const url = URL.createObjectURL(file); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, existing?.imageUrl]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!existing && !file) { setNotice('Choose a photograph before saving.'); return; }
    const base = {
      title: String(form.get('title') || ''),
      caption: String(form.get('caption') || ''),
      story: String(form.get('story') || ''),
      category,
      dateLabel: String(form.get('dateLabel') || ''),
      altText: String(form.get('altText') || ''),
      displayOrder: Number(form.get('displayOrder') || 1),
      published: form.get('published') === 'on',
    };
    setSaving(true);
    try {
      if (existing) {
        if (file) {
          setNotice('To replace an existing image, create a new photo story and delete the old one. Text and publication settings can be edited here.');
        }
        if (!demoEnabled) await updateMemory(existing.id, base);
        onSaved({ ...existing, ...base });
      } else if (demoEnabled) {
        onSaved({ id: `demo-${Date.now()}`, ...base, imageUrl: preview, imagePath: '' });
      } else if (file) {
        const result = await createMemory({ ...base, imageUrl: '', imagePath: '' }, file);
        onSaved({ id: result.id, ...base, imageUrl: result.imageUrl, imagePath: result.imagePath });
      }
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not save photo story.'); }
    finally { setSaving(false); }
  };

  return <div className="admin-modal-backdrop" onMouseDown={onClose}><form className="memory-composer" onSubmit={submit} onMouseDown={(e) => e.stopPropagation()}>
    <header><div><span>{existing ? 'EDIT PHOTO STORY' : 'NEW PHOTO STORY'}</span><h2>{existing ? 'Refine the moment.' : 'Add a moment.'}</h2></div><button onClick={onClose} type="button">Close</button></header>
    <div className="memory-compose-grid">
      <label className={`photo-drop ${existing ? 'photo-drop-existing' : ''}`}><input accept="image/jpeg,image/png,image/webp,image/avif" required={!existing} type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />{preview ? <img src={preview} alt="Selected preview" /> : <div><strong>Choose photograph</strong><span>JPG · PNG · WebP · AVIF</span><small>Use meaningful, high-quality images. Aim below 5 MB.</small></div>}</label>
      <div className="memory-fields">
        <label>Title<input required name="title" defaultValue={existing?.title} placeholder="Building after hours" /></label>
        <label>Caption<textarea required maxLength={220} name="caption" rows={3} defaultValue={existing?.caption} placeholder="A concise line people will see beneath the photograph." /></label>
        <label>Longer story<textarea name="story" rows={5} defaultValue={existing?.story} placeholder="Optional: what was happening, why the moment mattered, what you learned…" /></label>
        <div className="field-row"><label>Category<select value={category} onChange={(e) => setCategory(e.target.value as MemoryCategory)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label>Date / label<input name="dateLabel" defaultValue={existing?.dateLabel} placeholder="June 2026" /></label></div>
        <label>Accessible image description<input required name="altText" defaultValue={existing?.altText} placeholder="Wahab working on a laptop during…" /></label>
        <div className="field-row"><label>Display order<input min="1" name="displayOrder" type="number" defaultValue={existing?.displayOrder || 1} /></label><label className="check-label"><input name="published" type="checkbox" defaultChecked={existing?.published} /><span>Published</span></label></div>
        <button className="admin-primary" disabled={saving} type="submit">{saving ? 'Saving…' : existing ? 'Save changes' : 'Save photo story'}</button>
      </div>
    </div>
  </form></div>;
}

function WishesManager({ items, setItems, setNotice }: { items: BirthdayWish[]; setItems: (items: BirthdayWish[]) => void; setNotice: (message: string) => void }) {
  const act = async (item: BirthdayWish, status: BirthdayWish['status']) => { try { if (!demoEnabled) await updateWish(item.id,{status}); setItems(items.map((wish)=>wish.id===item.id?{...wish,status}:wish)); } catch(error){setNotice(error instanceof Error?error.message:'Could not update wish.');} };
  const feature = async (item: BirthdayWish) => { const featured=!item.featured; try{ if(!demoEnabled) await updateWish(item.id,{featured}); setItems(items.map((wish)=>wish.id===item.id?{...wish,featured}:wish)); }catch(error){setNotice(error instanceof Error?error.message:'Could not update wish.');}};
  return <div className="admin-manager"><div className="manager-intro"><div><h2>Birthday moderation</h2><p>Nothing submitted by visitors appears publicly until you approve it.</p></div></div><div className="admin-list">{items.length===0&&<div className="admin-empty"><h3>No wishes yet.</h3><p>Submitted birthday wishes will appear here.</p></div>}{items.map((item)=><article key={item.id}><div><span>{item.relationship} · {item.status}</span><h3>{item.name}</h3><p>{item.message}</p></div><div className="row-actions"><button onClick={()=>void act(item,'approved')}>Approve</button><button onClick={()=>void act(item,'rejected')}>Reject</button><button onClick={()=>void feature(item)}>{item.featured?'Unfeature':'Feature'}</button><button onClick={async()=>{if(window.confirm('Delete this wish?')){try{if(!demoEnabled)await deleteWish(item.id);setItems(items.filter(w=>w.id!==item.id));}catch(error){setNotice(error instanceof Error?error.message:'Could not delete wish.')}}}}>Delete</button></div></article>)}</div></div>;
}



function RiversManager({
  comments,
  setComments,
  reactions,
  setNotice,
}: {
  comments: RiverComment[];
  setComments: (items: RiverComment[]) => void;
  reactions: RiverReaction[];
  setNotice: (message: string) => void;
}) {
  const setStatus = async (
    item: RiverComment,
    status: RiverComment['status'],
  ) => {
    try {
      if (!demoEnabled) {
        await updateRiverComment(item.id, { status });
      }

      setComments(
        comments.map((comment) =>
          comment.id === item.id
            ? { ...comment, status }
            : comment,
        ),
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : 'Could not update reader reflection.',
      );
    }
  };

  const remove = async (item: RiverComment) => {
    if (!window.confirm(`Delete comment from ${item.name}?`)) return;

    try {
      if (!demoEnabled) {
        await deleteRiverComment(item.id);
      }
      setComments(comments.filter((comment) => comment.id !== item.id));
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : 'Could not delete reader reflection.',
      );
    }
  };

  const counts = reactions.reduce(
    (total, reaction) => {
      total[reaction.reaction] += 1;
      return total;
    },
    { felt: 0, inspired: 0, rooting: 0, respect: 0 } as Record<
      RiverReaction['reaction'],
      number
    >,
  );

  return (
    <div className="admin-manager">
      <div className="manager-intro">
        <div>
          <h2>The Rivers Of My Life</h2>
          <p>
            Reader reactions appear automatically. Written reflections stay
            private until you approve them.
          </p>
        </div>
      </div>

      <div className="admin-stat-grid">
        <article>
          <span>I felt this</span>
          <strong>{counts.felt}</strong>
          <p>Heart reactions</p>
        </article>
        <article>
          <span>This inspired me</span>
          <strong>{counts.inspired}</strong>
          <p>Inspiration reactions</p>
        </article>
        <article>
          <span>Rooting for you</span>
          <strong>{counts.rooting}</strong>
          <p>Support reactions</p>
        </article>
        <article>
          <span>Respect</span>
          <strong>{counts.respect}</strong>
          <p>Applause reactions</p>
        </article>
      </div>

      <div className="manager-intro river-admin-comments-heading">
        <div>
          <h2>Reader reflections</h2>
          <p>
            Approve only the comments you are comfortable preserving publicly
            beneath your story.
          </p>
        </div>
      </div>

      <div className="admin-list">
        {comments.length === 0 && (
          <div className="admin-empty">
            <h3>No reader reflections yet.</h3>
            <p>Comments on your story will arrive here for moderation.</p>
          </div>
        )}

        {comments.map((item) => (
          <article key={item.id}>
            <div>
              <span>{item.status}</span>
              <h3>{item.name}</h3>
              <p>{item.message}</p>
            </div>

            <div className="row-actions">
              <button
                type="button"
                onClick={() => void setStatus(item, 'approved')}
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => void setStatus(item, 'rejected')}
              >
                Reject
              </button>
              <button type="button" onClick={() => void remove(item)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}


function LettersManager({ items, setItems, setNotice }: { items: LetterEntry[]; setItems: (items: LetterEntry[]) => void; setNotice: (message: string) => void }) {
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<LetterEntry | null>(null);
  const ordered = useMemo(() => [...items].sort((a, b) => a.displayOrder - b.displayOrder), [items]);

  const save = async (event: FormEvent<HTMLFormElement>, existing?: LetterEntry) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const base = {
      senderName: String(form.get('senderName') || ''),
      title: String(form.get('title') || ''),
      message: String(form.get('message') || ''),
      displayOrder: Number(form.get('displayOrder') || 1),
      published: form.get('published') === 'on',
    };
    try {
      if (existing) {
        if (!demoEnabled) await updateLetter(existing.id, base);
        setItems(items.map((item) => item.id === existing.id ? { ...item, ...base } : item));
        setEditing(null);
      } else {
        if (demoEnabled) setItems([...items, { id: `letter-${Date.now()}`, ...base }]);
        else {
          const result = await createLetter(base);
          setItems([...items, { id: result.id, ...base }]);
        }
        setCreating(false);
      }
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not save letter.'); }
  };

  const toggle = async (item: LetterEntry) => {
    const published = !item.published;
    try {
      if (!demoEnabled) await updateLetter(item.id, { published });
      setItems(items.map((letter) => letter.id === item.id ? { ...letter, published } : letter));
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not update letter.'); }
  };

  const remove = async (item: LetterEntry) => {
    if (!window.confirm(`Delete letter from ${item.senderName}?`)) return;
    try {
      if (!demoEnabled) await deleteLetter(item.id);
      setItems(items.filter((letter) => letter.id !== item.id));
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not delete letter.'); }
  };

  return <div className="admin-manager">
    <div className="manager-intro"><div><h2>Letters to Wahab</h2><p>Curate longer messages from selected people. Published letters open as part of the public birthday experience.</p></div><button type="button" onClick={() => setCreating(true)}>+ Add letter</button></div>
    <div className="admin-list">{ordered.length === 0 && <div className="admin-empty"><h3>No letters yet.</h3><p>Add longer messages from family, friends, mentors or colleagues.</p></div>}{ordered.map((item) => <article key={item.id}><div><span>{item.published ? 'Published' : 'Hidden'} · Order {item.displayOrder}</span><h3>{item.title}</h3><p><strong>{item.senderName}</strong> — {item.message.slice(0, 220)}{item.message.length > 220 ? '…' : ''}</p></div><div className="row-actions"><button onClick={() => setEditing(item)}>Edit</button><button onClick={() => void toggle(item)}>{item.published ? 'Hide' : 'Publish'}</button><button onClick={() => void remove(item)}>Delete</button></div></article>)}</div>
    {(creating || editing) && <div className="admin-modal-backdrop" onMouseDown={() => { setCreating(false); setEditing(null); }}><form className="letter-composer" onSubmit={(e) => void save(e, editing || undefined)} onMouseDown={(e) => e.stopPropagation()}><header><div><span>{editing ? 'EDIT LETTER' : 'NEW LETTER'}</span><h2>{editing ? 'Refine the letter.' : 'Add a letter.'}</h2></div><button type="button" onClick={() => { setCreating(false); setEditing(null); }}>Close</button></header><label>Sender name<input required name="senderName" defaultValue={editing?.senderName} maxLength={100} /></label><label>Letter title<input required name="title" defaultValue={editing?.title} maxLength={140} placeholder="For the road ahead" /></label><label>Message<textarea required name="message" defaultValue={editing?.message} minLength={20} maxLength={5000} rows={12} /></label><div className="field-row"><label>Display order<input name="displayOrder" type="number" min="1" defaultValue={editing?.displayOrder || 1} /></label><label className="check-label"><input name="published" type="checkbox" defaultChecked={editing?.published} /><span>Published</span></label></div><button className="admin-primary" type="submit">{editing ? 'Save changes' : 'Save letter'}</button></form></div>}
  </div>;
}

function CapsuleManager({ items }: { items: TimeCapsuleEntry[] }) {
  return <div className="admin-manager"><div className="manager-intro"><div><h2>Birthday Time Capsule</h2><p>These notes are private. They are intended for the next October 30 and never appear on the public wall.</p></div><span className="capsule-admin-count">{items.length} sealed</span></div><div className="admin-list capsule-admin-list">{items.length === 0 && <div className="admin-empty"><h3>No future notes yet.</h3><p>Visitor time-capsule messages will arrive here privately.</p></div>}{items.map((item, index) => <article key={item.id}><div><span>SEALED NOTE {String(index + 1).padStart(3, '0')} · Opens {item.unlockDate}</span><h3>{item.name}</h3><p>{item.message}</p></div></article>)}</div></div>;
}

function LeadsManager({ items, setItems, setNotice }: { items: Lead[]; setItems: (items: Lead[]) => void; setNotice: (message: string) => void }) {
  const statuses: Lead['status'][]=['new','contacted','negotiating','won','closed'];
  return <div className="admin-manager"><div className="manager-intro"><div><h2>Potential customers</h2><p>Every “Build something with me” submission arrives here so the birthday experience can generate real opportunities.</p></div></div><div className="admin-list leads-list">{items.length===0&&<div className="admin-empty"><h3>No leads yet.</h3><p>Project enquiries will appear here with their contact details and brief.</p></div>}{items.map((item)=><article key={item.id}><div><span>{item.projectType} · {item.budget||'Budget not stated'}{item.organisation ? ` · ${item.organisation}` : ''}</span><h3>{item.name}</h3><div className="lead-contact-row"><a href={`mailto:${item.email}`}>{item.email}</a>{item.phone && <a href={`tel:${item.phone}`}>{item.phone}</a>}{item.preferredContact && <b>Prefers {item.preferredContact}</b>}</div><p>{item.brief}</p></div><select value={item.status} onChange={async(e)=>{const status=e.target.value as Lead['status'];try{if(!demoEnabled)await updateLead(item.id,{status});setItems(items.map(l=>l.id===item.id?{...l,status}:l));}catch(error){setNotice(error instanceof Error?error.message:'Could not update lead.')}}}>{statuses.map(s=><option key={s} value={s}>{s}</option>)}</select></article>)}</div></div>;
}

function GuestbookManager({ items, setItems, setNotice }: { items: GuestbookEntry[]; setItems: (items: GuestbookEntry[]) => void; setNotice: (message: string) => void }) {
  const setStatus=async(item:GuestbookEntry,status:GuestbookEntry['status'])=>{try{if(!demoEnabled)await updateGuestbook(item.id,{status});setItems(items.map(g=>g.id===item.id?{...g,status}:g));}catch(error){setNotice(error instanceof Error?error.message:'Could not update guestbook.')}};
  return <div className="admin-manager"><div className="manager-intro"><div><h2>Guestbook moderation</h2><p>Review names and notes before they become part of the permanent archive.</p></div></div><div className="admin-list">{items.length===0&&<div className="admin-empty"><h3>No entries yet.</h3><p>Guestbook signatures will appear here.</p></div>}{items.map(item=><article key={item.id}><div><span>{item.status}</span><h3>{item.name}</h3><p>{item.note||'Signed without a note.'}</p></div><div className="row-actions"><button onClick={()=>void setStatus(item,'approved')}>Approve</button><button onClick={()=>void setStatus(item,'rejected')}>Reject</button></div></article>)}</div></div>;
}
