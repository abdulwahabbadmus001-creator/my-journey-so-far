import { FormEvent, useEffect, useMemo, useState } from 'react';
import { firebaseConfigured } from '../lib/firebase';
import { submitGuestbook, submitLead, submitTimeCapsule, submitWish, subscribeApprovedGuestbook, subscribeApprovedWishes, subscribePublishedMemories } from '../services/content';
import type { BirthdayWish, GuestbookEntry, MemoryEntry } from '../types/content';
import GratitudeWall from "./GratitudeWall";
import RiversOfMyLife from "./RiversOfMyLife";
import '../styles/signature.css';

type Project = {
  name: string;
  type: string;
  statement: string;
  stack: string;
  status: 'Built' | 'In progress';
  index: string;
};

const projects: Project[] = [
  { name: 'Decidr', type: 'Decision-making PWA', statement: 'A structured decision tool that helps people compare options using weighted criteria, scoring and group voting instead of relying only on guesswork.', stack: 'PWA · Decision scoring · Netlify', status: 'Built', index: '01' },
  { name: 'ForeTrend', type: 'Weather intelligence', statement: 'A multi-model weather experience designed around ECMWF IFS, NOAA GFS and DWD ICON forecasts, with clearer activity windows and hazard-aware planning.', stack: 'Multi-model weather data · Web', status: 'Built', index: '02' },
  { name: 'EduPath', type: 'Education technology', statement: 'An exam-preparation PWA for WAEC, JAMB, NECO and POST-UTME with targeted practice, simulations, weak-topic tracking and data-driven revision.', stack: 'PWA · Firebase Auth · Paystack', status: 'Built', index: '03' },
  { name: 'FocusMate', type: 'Productivity PWA', statement: 'A focused-work companion with configurable sessions, presets, ambient sounds, streaks and weekly progress tracking for distraction-free work.', stack: 'HTML · CSS · JavaScript · PWA', status: 'Built', index: '04' },
  { name: 'AfriSync', type: 'Resilient infrastructure', statement: 'An offline-first synchronization system for reliably moving local project data to a central backend when connectivity becomes available.', stack: 'Python · FastAPI · SQLite · REST APIs', status: 'In progress', index: '05' },
  { name: 'LinguaNaija', type: 'Language technology', statement: 'An offline-first multilingual Nigerian dictionary and learning experience for English, Yoruba, Hausa, Igbo and Nigerian Pidgin.', stack: 'React Native · Expo · TypeScript · SQLite · Firebase', status: 'In progress', index: '06' },
  { name: "Moji's Heritage", type: 'Culture & education', statement: 'A Nigerian cultural-heritage platform preserving stories, languages, traditions, festivals, heroes, oral history, food, music and cultural memory.', stack: 'React · Vite · Firebase · Leaflet · i18next', status: 'In progress', index: '07' },
  { name: 'NextStep', type: 'Career technology', statement: 'A career-pathfinder and matchmaking platform connecting skills, interests and qualifications to career directions, learning and opportunity.', stack: 'PWA · Career matching · APIs', status: 'In progress', index: '08' },
  { name: 'OjaFlow', type: 'SME technology', statement: 'A business-management product for African traders to track inventory, sales, expenses, debtors and everyday transactions more clearly.', stack: 'React Native · Expo · TypeScript · Firebase', status: 'In progress', index: '09' },
  { name: '20 Modern Mini-Python Projects', type: 'Python build series', statement: 'A practical build series for strengthening Python through real developer problems including utilities, APIs, automation, data handling and backend workflows.', stack: 'Python · APIs · Automation · Databases', status: 'In progress', index: '10' },
];

const birthdayConfetti = Array.from({ length: 30 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  duration: `${7 + (index % 6)}s`,
  delay: `-${(index % 10) * 0.7}s`,
}));
const birthdayBalloons = Array.from({ length: 6 }, (_, index) => index);

const journey = [
  ['History & Diplomacy', 'Learning to read systems, institutions, people and power.'],
  ['Research', 'Turning questions into evidence, analysis and useful explanations.'],
  ['Technology', 'Moving from analysing problems to designing tools that can address them.'],
  ['Software Building', 'Creating practical digital products across web, mobile and backend systems.'],
  ['AI & Africa', 'Exploring how responsible technology can be useful in African realities.'],
];

const memorySlots = [
  ['01', 'Working on the idea', 'A place for a photograph of you building, researching or solving a problem.'],
  ['02', 'Learning in motion', 'A moment from school, a programme, a technical session or independent study.'],
  ['03', 'Outside the screen', 'Events, travel, people and experiences that shaped the year beyond the laptop.'],
  ['04', 'Milestones worth keeping', 'Graduation, certification, publication, launch or another personal chapter.'],
];

export default function BirthdayExperience({ postBirthday = false }: { postBirthday?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [capsuleOpen, setCapsuleOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<MemoryEntry | null>(null);
  const [giftCopied, setGiftCopied] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);
  const [wishSent, setWishSent] = useState(false);
  const [guestbookSent, setGuestbookSent] = useState(false);
  const [capsuleSent, setCapsuleSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [approvedWishes, setApprovedWishes] = useState<BirthdayWish[]>([]);
  const [approvedGuestbook, setApprovedGuestbook] = useState<GuestbookEntry[]>([]);

  useEffect(() => {
    if (!firebaseConfigured) return;
    const unsubscribeMemories = subscribePublishedMemories(setMemories);
    const unsubscribeWishes = subscribeApprovedWishes(setApprovedWishes);
    const unsubscribeGuestbook = subscribeApprovedGuestbook(setApprovedGuestbook);
    return () => { unsubscribeMemories(); unsubscribeWishes(); unsubscribeGuestbook(); };
  }, []);

  useEffect(() => {
    if (!menuOpen && !creatorOpen && !enquiryOpen && !wishOpen && !capsuleOpen && !selectedMemory) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setCreatorOpen(false);
        setEnquiryOpen(false);
        setWishOpen(false);
        setCapsuleOpen(false);
        setSelectedMemory(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, creatorOpen, enquiryOpen, wishOpen, capsuleOpen, selectedMemory]);

  const featuredWish = useMemo(() => approvedWishes.find((wish) => wish.featured) ?? approvedWishes[0], [approvedWishes]);
  const regularWishes = useMemo(() => approvedWishes.filter((wish) => wish.id !== featuredWish?.id).slice(0, 5), [approvedWishes, featuredWish]);

  const copyAccount = async () => {
    await navigator.clipboard.writeText('9042044060');
    setGiftCopied(true);
    window.setTimeout(() => setGiftCopied(false), 2200);
  };

  const submitEnquiryForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true); setFormError('');
    const form = new FormData(event.currentTarget);
    try {
      if (firebaseConfigured) {
        await submitLead({
          name: String(form.get('name') || ''),
          email: String(form.get('email') || ''),
          phone: String(form.get('phone') || ''),
          preferredContact: String(form.get('preferredContact') || 'Email') as 'Email' | 'WhatsApp' | 'Phone',
          organisation: String(form.get('organisation') || ''),
          projectType: String(form.get('projectType') || ''),
          brief: String(form.get('brief') || ''),
          budget: String(form.get('budget') || ''),
        });
      }
      setEnquirySent(true);
    } catch (error) { setFormError(error instanceof Error ? error.message : 'Could not send your enquiry.'); }
    finally { setSubmitting(false); }
  };

  const submitWishForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true); setFormError('');
    const form = new FormData(event.currentTarget);
    try {
      if (firebaseConfigured) {
        await submitWish({
          name: String(form.get('name') || ''),
          relationship: String(form.get('relationship') || ''),
          message: String(form.get('message') || ''),
        });
      }
      setWishSent(true);
    } catch (error) { setFormError(error instanceof Error ? error.message : 'Could not add your wish.'); }
    finally { setSubmitting(false); }
  };

  const submitGuestbookForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true); setFormError('');
    const form = new FormData(event.currentTarget);
    try {
      if (firebaseConfigured) await submitGuestbook({ name: String(form.get('name') || ''), note: String(form.get('note') || '') });
      event.currentTarget.reset();
      setGuestbookSent(true);
      window.setTimeout(() => setGuestbookSent(false), 3500);
    } catch (error) { setFormError(error instanceof Error ? error.message : 'Could not sign the guestbook.'); }
    finally { setSubmitting(false); }
  };

  const submitCapsuleForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true); setFormError('');
    const form = new FormData(event.currentTarget);
    try {
      if (firebaseConfigured) await submitTimeCapsule({ name: String(form.get('name') || ''), message: String(form.get('message') || '') });
      setCapsuleSent(true);
    } catch (error) { setFormError(error instanceof Error ? error.message : 'Could not seal your future note.'); }
    finally { setSubmitting(false); }
  };

  const closeEnquiry = () => { setEnquiryOpen(false); setFormError(''); window.setTimeout(() => setEnquirySent(false), 250); };
  const closeWish = () => { setWishOpen(false); setFormError(''); window.setTimeout(() => setWishSent(false), 250); };
  const closeCapsule = () => { setCapsuleOpen(false); setFormError(''); window.setTimeout(() => setCapsuleSent(false), 250); };

  return (
    <main className="chapter-shell">
      <header className="chapter-nav">
        <a className="chapter-brand" href="#top" aria-label="October 30 home"><span>WOB</span><small>October Chapter</small></a>
        <nav className="desktop-nav" aria-label="Primary navigation"><a href="#wishes">Wishes</a><a href="#memories">Moments</a><a href="#gratitude">Gratitude</a><a href="#rivers">My Story</a><a href="#gift">Gift</a></nav>
        <button className="nav-menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><span /> <span /></button>
      </header>

      <aside className="chapter-rail" aria-label="Chapter navigation">
        <a href="#wishes"><span>01</span><i /></a>
        <a href="#memories"><span>02</span><i /></a>
        <a href="#gratitude"><span>03</span><i /></a>
        <a href="#journey"><span>04</span><i /></a>
        <a href="#built"><span>05</span><i /></a>
        <a href="#rivers"><span>06</span><i /></a>
      </aside>

      <section className="chapter-hero birthday-hero" id="top">
        <div className="hero-aura hero-aura-one" aria-hidden="true" /><div className="hero-aura hero-aura-two" aria-hidden="true" /><div className="hero-rule hero-rule-left" aria-hidden="true" /><div className="hero-rule hero-rule-right" aria-hidden="true" />
        {!postBirthday && <div className="birthday-celebration-layer" aria-hidden="true">
          {birthdayConfetti.map((piece) => <i key={`confetti-${piece.id}`} className={`birthday-confetti birthday-confetti-${piece.id % 6}`} style={{ left: piece.left, animationDuration: piece.duration, animationDelay: piece.delay }} />)}
          {birthdayBalloons.map((balloon) => <span key={`hero-balloon-${balloon}`} className={`birthday-hero-balloon birthday-hero-balloon-${balloon + 1}`}><b /></span>)}
          <span className="birthday-spark birthday-spark-one">✦</span><span className="birthday-spark birthday-spark-two">✦</span><span className="birthday-spark birthday-spark-three">✦</span>
        </div>}
        <div className="hero-edition"><span>OCT</span><strong>30</strong><span>2026</span></div>
        <div className="hero-copy">
          {!postBirthday && <div className="birthday-badge"><span>IT'S MY BIRTHDAY</span><i /><b>OCTOBER 30</b></div>}
          <p className="section-label">{postBirthday ? 'THE OCTOBER CHAPTER · ARCHIVED' : 'WELCOME TO MY OCTOBER CHAPTER'}</p>
          <h1>{postBirthday ? 'Thank you for being part of the chapter.' : 'A chapter in motion.'}</h1>
          <p className="hero-name">Wahab Opeyemi Badmus</p>
          <p className="hero-intro">{postBirthday ? 'The day has passed, but the messages, memories, people and work that shaped it remain here.' : 'A living birthday archive of memory, gratitude, becoming — and the river still flowing.'}</p>
          <div className="hero-actions"><button className="primary-link hero-primary-button" type="button" onClick={() => setWishOpen(true)}>Leave a birthday wish <span aria-hidden="true">↗</span></button><a className="hero-secondary-link" href="#wishes">Enter the chapter <span>↓</span></a></div>
          {!postBirthday && <div className="birthday-cheers"><span>✦</span><p>Celebrate · Remember · Build · Dream</p><span>✦</span></div>}
        </div>
        <div className="hero-scroll-note" aria-hidden="true"><span>SCROLL</span><i /></div>
      </section>

      {!postBirthday && <div className="birthday-marquee" aria-hidden="true"><div><span>HAPPY BIRTHDAY WAHAB</span><i>✦</i><span>OCTOBER 30</span><i>✦</i><span>THE CHAPTER IS OPEN</span><i>✦</i><span>CELEBRATE THE JOURNEY</span><i>✦</i><span>HAPPY BIRTHDAY WAHAB</span><i>✦</i><span>OCTOBER 30</span></div></div>}

      <section className="wishes-section" id="wishes">
        <div className="section-heading-row"><div><p className="section-index">01 / BIRTHDAY WISHES</p><h2>Leave a line in this chapter.</h2></div><span className="section-note">Messages are moderated before appearing publicly.</span></div>
        <div className="wish-composer-card"><div className="wish-quote-mark">“</div><div><p className="wish-placeholder">Your birthday message can live here.</p><p className="wish-supporting">A note, a memory, a prayer, a joke, a hope — make it yours.</p></div><button className="text-button" type="button" onClick={() => setWishOpen(true)}>Write a wish <span>↗</span></button></div>

        {featuredWish ? (
          <div className="wish-preview-grid public-wish-grid">
            <article className="wish-preview featured-wish"><span>{featuredWish.featured ? 'FEATURED MESSAGE' : 'BIRTHDAY MESSAGE'}</span><p>“{featuredWish.message}”</p><small>— {featuredWish.name} · {featuredWish.relationship}</small></article>
            <div className="wish-wall-mini">{regularWishes.length ? regularWishes.map((wish) => <article key={wish.id}><span>“</span><p>{wish.message}</p><small>{wish.name} · {wish.relationship}</small></article>) : <article><span>+</span><p>More approved wishes will gather here through the day.</p><small>The wall grows with the celebration.</small></article>}</div>
          </div>
        ) : (
          <div className="wish-preview-grid"><article className="wish-preview featured-wish"><span>FEATURED MESSAGE</span><p>Selected messages from important people will be given room to breathe here.</p><small>— The wall opens with approved wishes</small></article><article className="wish-preview"><span>THE WALL</span><p>Approved wishes become a living wall of words from family, friends, colleagues and visitors.</p><small>Moderated · personal · preserved</small></article></div>
        )}
      </section>

      <section className="memories-section" id="memories">
        <div className="section-heading-row light-heading"><div><p className="section-index">02 / MOMENTS BEHIND THE JOURNEY</p><h2>Some moments deserve more than a camera roll.</h2></div><p className="built-intro">Work. Learning. People. Travel. Milestones. Each photograph can carry the story behind it.</p></div>
        {memories.length > 0 ? (
          <div className="photo-story-grid">{memories.map((memory, index) => <button className={`photo-story-card photo-story-card-${(index % 5) + 1}`} type="button" key={memory.id} onClick={() => setSelectedMemory(memory)}><img src={memory.imageUrl} alt={memory.altText} loading="lazy" /><div className="photo-story-shade" /><span className="photo-story-index">{String(index + 1).padStart(2, '0')}</span><div className="photo-story-copy"><small>{memory.category}{memory.dateLabel ? ` · ${memory.dateLabel}` : ''}</small><h3>{memory.title}</h3><p>{memory.caption}</p><b>Read the moment ↗</b></div></button>)}</div>
        ) : (
          <div className="memory-grid">{memorySlots.map(([number, title, description], index) => <article className={`memory-card memory-card-${index + 1}`} key={number}><span>{number}</span><div className="memory-placeholder-mark" aria-hidden="true"><i /><b>YOUR PHOTO</b></div><div><h3>{title}</h3><p>{description}</p></div></article>)}</div>
        )}
      </section>

      <GratitudeWall />
      
      <section className="journey-section" id="journey">
        <div className="section-heading-row light-heading"><div><p className="section-index">04 / MY JOURNEY</p><h2>From understanding systems to building them.</h2></div></div>
        <div className="journey-list">{journey.map(([title, description], index) => <article className="journey-row" key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
      </section>

      <section className="built-section" id="built">
        <div className="section-heading-row"><div><p className="section-index">05 / THINGS I BUILT</p><h2>Some ideas shipped. Others are still becoming.</h2></div><p className="built-intro">A transparent view of what I have built and what I am actively developing — shaped by real problems, learning and an African context.</p></div>
        <div className="project-summary" aria-label="Project status summary"><article><strong>{projects.filter((project) => project.status === 'Built').length}</strong><span>Built</span></article><article><strong>{projects.filter((project) => project.status === 'In progress').length}</strong><span>In progress</span></article><p>Every unfinished product is labelled clearly. The point is not to look complete — it is to show the work, direction and momentum behind the journey.</p></div>
        <div className="project-group-heading"><span>BUILT &amp; SHIPPED</span><i /></div>
        <div className="project-list">{projects.filter((project) => project.status === 'Built').map((project) => <article className="project-row" key={project.name}><span className="project-index">{project.index}</span><div className="project-main"><p>{project.type}</p><h3>{project.name}</h3></div><p className="project-statement">{project.statement}</p><div className="project-meta"><span>{project.stack}</span><b className="status-built">{project.status}</b></div></article>)}</div>
        <div className="project-group-heading project-group-progress"><span>IN ACTIVE DEVELOPMENT</span><i /></div>
        <div className="project-list project-list-progress">{projects.filter((project) => project.status === 'In progress').map((project) => <article className="project-row" key={project.name}><span className="project-index">{project.index}</span><div className="project-main"><p>{project.type}</p><h3>{project.name}</h3></div><p className="project-statement">{project.statement}</p><div className="project-meta"><span>{project.stack}</span><b className="status-progress">{project.status}</b></div></article>)}</div>
      </section>

      <RiversOfMyLife />

      <section className="guestbook-section" id="guestbook">
        <div className="guestbook-copy"><p className="section-index">07 / GUESTBOOK</p><h2>Leave your name before you go.</h2><p>Sign the permanent birthday archive. Entries are reviewed before publication.</p></div>
        <form className="guestbook-form" onSubmit={submitGuestbookForm}><label><span>Your name</span><input required name="name" type="text" minLength={2} maxLength={80} placeholder="Name" /></label><label><span>A short note</span><textarea name="note" maxLength={500} rows={3} placeholder="Write something worth keeping…" /></label>{guestbookSent && <p className="inline-success">Signed. Thank you for leaving your mark.</p>}{formError && <p className="form-error">{formError}</p>}<button disabled={submitting} type="submit">{submitting ? 'Saving…' : 'Sign the guestbook'} <span>↗</span></button></form>
        {approvedGuestbook.length > 0 && <div className="guestbook-wall"><div className="guestbook-wall-heading"><span>APPROVED SIGNATURES</span><strong>{approvedGuestbook.length}</strong></div><div className="guestbook-wall-grid">{approvedGuestbook.slice(0, 8).map((entry) => <article key={entry.id}><span>GUEST</span><h3>{entry.name}</h3><p>{entry.note || 'Signed the October Chapter.'}</p></article>)}</div></div>}
      </section>

      <section className="gift-section" id="gift"><div className="gift-copy"><p className="section-index">08 / OPTIONAL BIRTHDAY GIFT</p><h2>Your message already counts.</h2><p>If you would also like to send a birthday gift, the receiving details are here.</p></div><div className="bank-card"><div className="bank-card-topline"><span>OPay</span><b>OCT · 30</b></div><div className="bank-number">9042&nbsp;0440&nbsp;60</div><div className="bank-card-footer"><div><span>ACCOUNT NAME</span><strong>Wahab Opeyemi Badmus</strong></div><button type="button" onClick={copyAccount}>{giftCopied ? 'Copied ✓' : 'Copy number'}</button></div></div></section>

      <section className="timecapsule-section" id="time-capsule"><span className="capsule-lock" aria-hidden="true">⌁</span><p className="section-index">09 / TIME CAPSULE</p><h2>Write something for the next October 30.</h2><p>A hope. A prediction. A challenge. A prayer. The note is stored privately for the next chapter.</p><button type="button" onClick={() => setCapsuleOpen(true)}>Seal a future note <span>↗</span></button></section>

      <section className="creator-section" id="work-with-me"><div><p className="section-label">10 / BUILD SOMETHING WITH ME</p><h2>You just experienced something I designed and built.</h2><p>I work across software, digital products, research and AI — turning ideas and operational problems into useful experiences.</p></div><div className="creator-actions"><button className="primary-link button-link" type="button" onClick={() => setEnquiryOpen(true)}>Build something with me <span>↗</span></button><button className="secondary-link" type="button" onClick={() => setCreatorOpen(true)}>About the builder</button></div></section>

      <footer className="chapter-footer" id="end-credits"><button type="button" onClick={() => setCreatorOpen(true)}>Designed &amp; built by Wahab Opeyemi Badmus</button><span>11 / END CREDITS · OCTOBER 30 · 2026</span></footer>

      {selectedMemory && <div className="overlay memory-story-overlay" role="presentation" onMouseDown={() => setSelectedMemory(null)}><article className="memory-story-panel" role="dialog" aria-modal="true" aria-label={selectedMemory.title} onMouseDown={(e) => e.stopPropagation()}><button className="memory-story-close" onClick={() => setSelectedMemory(null)} type="button">Close</button><div className="memory-story-photo"><img src={selectedMemory.imageUrl} alt={selectedMemory.altText} /></div><div className="memory-story-text"><span>{selectedMemory.category}{selectedMemory.dateLabel ? ` · ${selectedMemory.dateLabel}` : ''}</span><h2>{selectedMemory.title}</h2><p className="memory-story-caption">{selectedMemory.caption}</p>{selectedMemory.story && <p>{selectedMemory.story}</p>}</div></article></div>}

      {capsuleOpen && <div className="overlay" role="presentation" onMouseDown={closeCapsule}><aside className="enquiry-panel capsule-panel" role="dialog" aria-modal="true" aria-label="Birthday time capsule" onMouseDown={(e) => e.stopPropagation()}><div className="panel-topline"><span>TIME CAPSULE · 2027</span><button type="button" onClick={closeCapsule}>Close</button></div>{capsuleSent ? <div className="enquiry-success"><span>⌁</span><h2>Your note is sealed.</h2><p>It has been stored privately for the next October 30 and will not appear on the public birthday wall.</p><button type="button" onClick={closeCapsule}>Return to the chapter</button></div> : <><h2>Write to the next chapter.</h2><p className="enquiry-intro">A hope, prayer, prediction, challenge or reminder for Wahab one year from now.</p><form className="enquiry-form" onSubmit={submitCapsuleForm}><label><span>Your name</span><input required name="name" minLength={2} maxLength={80} type="text" placeholder="Name" /></label><label><span>Your future note</span><textarea required name="message" minLength={5} maxLength={1500} rows={7} placeholder="Before the next October 30, I hope…" /></label>{formError && <p className="form-error">{formError}</p>}<button disabled={submitting} type="submit">{submitting ? 'Sealing…' : 'Seal for next year'} <span>↗</span></button></form></>}</aside></div>}

      {wishOpen && <div className="overlay" role="presentation" onMouseDown={closeWish}><aside className="enquiry-panel wish-panel" role="dialog" aria-modal="true" aria-label="Write a birthday wish" onMouseDown={(e) => e.stopPropagation()}><div className="panel-topline"><span>BIRTHDAY WISH</span><button type="button" onClick={closeWish}>Close</button></div>{wishSent ? <div className="enquiry-success"><span>✓</span><h2>Your words are in the chapter.</h2><p>Your wish has entered the private moderation queue. Once approved, it can appear on the public wishes wall.</p><button type="button" onClick={closeWish}>Return to the celebration</button></div> : <><h2>Leave a line for Wahab.</h2><p className="enquiry-intro">A message, a memory, a prayer, a joke or a hope. Keep it personal.</p><form className="enquiry-form" onSubmit={submitWishForm}><label><span>Your name</span><input required name="name" type="text" placeholder="Name" /></label><label><span>How do you know Wahab?</span><select name="relationship" defaultValue="Friend"><option>Family</option><option>Friend</option><option>Colleague</option><option>Professional connection</option><option>Schoolmate</option><option>Other</option></select></label><label><span>Your message</span><textarea required name="message" minLength={5} maxLength={1000} rows={6} placeholder="Write something worth keeping…" /></label>{formError && <p className="form-error">{formError}</p>}<button disabled={submitting} type="submit">{submitting ? 'Adding…' : 'Add my wish'} <span>↗</span></button></form></>}</aside></div>}

      {menuOpen && <div className="overlay" role="presentation" onMouseDown={() => setMenuOpen(false)}><aside className="menu-panel" role="dialog" aria-modal="true" aria-label="Navigation" onMouseDown={(e) => e.stopPropagation()}><div className="panel-topline"><span>OCTOBER CHAPTER</span><button type="button" onClick={() => setMenuOpen(false)}>Close</button></div><nav>{[['Birthday Wishes','#wishes'],['Moments','#memories'],['Gratitude','#gratitude'],['My Journey','#journey'],['Things I Built','#built'],['The Rivers Of My Life','#rivers'],['Guestbook','#guestbook'],['Birthday Gift','#gift'],['Time Capsule','#time-capsule'],['Build With Me','#work-with-me']].map(([label,href],index)=><a href={href} key={label} onClick={()=>setMenuOpen(false)}><span>{String(index + 1).padStart(2, '0')}</span>{label}</a>)}</nav></aside></div>}

      {creatorOpen && <div className="overlay" role="presentation" onMouseDown={() => setCreatorOpen(false)}><aside className="creator-panel" role="dialog" aria-modal="true" aria-label="About the builder" onMouseDown={(e) => e.stopPropagation()}><div className="panel-topline"><span>THE BUILDER</span><button type="button" onClick={() => setCreatorOpen(false)}>Close</button></div><div className="creator-monogram">WOB</div><h2>Wahab Opeyemi Badmus</h2><p>Software development · AI · research · digital products</p><div className="creator-skill-grid"><span>React</span><span>TypeScript</span><span>Python</span><span>Firebase</span><span>FastAPI</span><span>Research</span></div><button className="primary-link button-link" type="button" onClick={() => { setCreatorOpen(false); setEnquiryOpen(true); }}>Start a project <span>↗</span></button></aside></div>}

      {enquiryOpen && <div className="overlay" role="presentation" onMouseDown={closeEnquiry}><aside className="enquiry-panel" role="dialog" aria-modal="true" aria-label="Project enquiry" onMouseDown={(e) => e.stopPropagation()}><div className="panel-topline"><span>PROJECT ENQUIRY</span><button type="button" onClick={closeEnquiry}>Close</button></div>{enquirySent ? <div className="enquiry-success"><span>✓</span><h2>Your project is now on my radar.</h2><p>Your enquiry has been sent to my private leads dashboard. I can review the problem, scope and your contact details from there.</p><button type="button" onClick={closeEnquiry}>Return to the chapter</button></div> : <><h2>What should we build?</h2><p className="enquiry-intro">Tell me enough to understand the problem. Your enquiry goes directly to the private project leads dashboard.</p><form className="enquiry-form" onSubmit={submitEnquiryForm}><label><span>Name</span><input required name="name" minLength={2} maxLength={100} type="text" placeholder="Your name" /></label><label><span>Organisation / business</span><input name="organisation" maxLength={140} type="text" placeholder="Optional" /></label><label><span>Email</span><input required name="email" maxLength={180} type="email" placeholder="you@example.com" /></label><label><span>Phone / WhatsApp</span><input name="phone" maxLength={40} type="tel" placeholder="Optional" /></label><label><span>Preferred contact</span><select name="preferredContact" defaultValue="Email"><option>Email</option><option>WhatsApp</option><option>Phone</option></select></label><label><span>What do you need?</span><select required name="projectType" defaultValue=""><option value="" disabled>Select a project type</option><option>Website</option><option>Web application</option><option>Mobile application</option><option>AI solution</option><option>Digital experience</option><option>Research / strategy</option><option>Other</option></select></label><label><span>Brief</span><textarea required name="brief" minLength={10} maxLength={2500} rows={5} placeholder="What are you trying to create or solve?" /></label><label><span>Estimated budget</span><select name="budget" defaultValue="Not sure yet"><option>Not sure yet</option><option>Small project</option><option>Medium project</option><option>Large / ongoing project</option></select></label>{formError && <p className="form-error">{formError}</p>}<button disabled={submitting} type="submit">{submitting ? 'Sending…' : 'Send project enquiry'} <span>↗</span></button></form></>}</aside></div>}
    </main>
  );
}
