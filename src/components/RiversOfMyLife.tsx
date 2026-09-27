import { FormEvent, useEffect, useMemo, useState } from 'react';
import { firebaseConfigured } from '../lib/firebase';
import {
  saveRiverReaction,
  submitRiverComment,
  subscribeApprovedRiverComments,
  subscribeRiverReactions,
} from '../services/content';
import type {
  RiverComment,
  RiverReaction,
  RiverReactionKey,
} from '../types/content';
import { riverChapters } from '../data/riversOfMyLife';
import '../styles/rivers.css';

const reactions: Array<{
  key: RiverReactionKey;
  emoji: string;
  label: string;
}> = [
  { key: 'felt', emoji: '❤️', label: 'I felt this' },
  { key: 'inspired', emoji: '✨', label: 'This inspired me' },
  { key: 'rooting', emoji: '🙏', label: 'Rooting for you' },
  { key: 'respect', emoji: '👏', label: 'Respect' },
];

function getVisitorId() {
  const storageKey = 'wob-river-visitor-id';
  const existing = window.localStorage.getItem(storageKey);
  if (existing) return existing;

  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  window.localStorage.setItem(storageKey, id);
  return id;
}

export default function RiversOfMyLife() {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<RiverComment[]>([]);
  const [reactionItems, setReactionItems] = useState<RiverReaction[]>([]);
  const [myReaction, setMyReaction] = useState<RiverReactionKey | null>(null);
  const [commentSent, setCommentSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!firebaseConfigured) return;

    const unsubscribeComments = subscribeApprovedRiverComments(setComments);
    const unsubscribeReactions = subscribeRiverReactions((items) => {
      setReactionItems(items);
      const visitorId = getVisitorId();
      setMyReaction(items.find((item) => item.visitorId === visitorId)?.reaction ?? null);
    });

    return () => {
      unsubscribeComments();
      unsubscribeReactions();
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const reactionCounts = useMemo(() => {
    const counts: Record<RiverReactionKey, number> = {
      felt: 0,
      inspired: 0,
      rooting: 0,
      respect: 0,
    };

    reactionItems.forEach((item) => {
      counts[item.reaction] += 1;
    });

    return counts;
  }, [reactionItems]);

  const totalReactions = reactionItems.length;

  const react = async (reaction: RiverReactionKey) => {
    setError('');
    setMyReaction(reaction);

    if (!firebaseConfigured) return;

    try {
      await saveRiverReaction(getVisitorId(), reaction);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Your reaction could not be saved.',
      );
    }
  };

  const submitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    try {
      if (firebaseConfigured) {
        await submitRiverComment({
          name: String(form.get('name') || ''),
          message: String(form.get('message') || ''),
        });
      }

      formElement.reset();
      setCommentSent(true);
      window.setTimeout(() => setCommentSent(false), 5000);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Your comment could not be submitted.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rivers-section" id="rivers">
      <div className="rivers-preview">
        <div className="rivers-preview-copy">
          <p className="section-index">06 / THE RIVERS OF MY LIFE</p>
          <span className="rivers-kicker">A PERSONAL STORY · STILL BEING WRITTEN</span>
          <h2>The road here was never a straight line.</h2>
          <p>
            Before the projects, research, university and technology, there were years when the future felt much smaller. This is the story of the turns, setbacks, work, people and unexpected openings that carried me here.
          </p>
          <div className="rivers-preview-meta">
            <span>{riverChapters.length} chapters so far</span>
            <span>Personal reflection</span>
            <span>October Chapter · 2026</span>
          </div>
          <button type="button" onClick={() => setOpen(true)}>
            Read The Rivers Of My Life <span>↗</span>
          </button>
        </div>

        <div className="rivers-art" aria-hidden="true">
          <div className="river-line river-line-one" />
          <div className="river-line river-line-two" />
          <div className="river-line river-line-three" />
          <span>THE</span>
          <strong>RIVERS</strong>
          <span>OF MY LIFE</span>
          <small>WOB · MMXXVI</small>
        </div>
      </div>

      {open && (
        <div
          className="river-reader-overlay"
          role="presentation"
          onMouseDown={() => setOpen(false)}
        >
          <article
            className="river-reader"
            role="dialog"
            aria-modal="true"
            aria-label="The Rivers Of My Life"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="river-reader-header">
              <div>
                <span>WAHAB OPEYEMI BADMUS · OCTOBER 30, 2026</span>
                <h1>The Rivers Of My Life</h1>
                <p>A story about the bends I could not see from where I was standing.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)}>
                Close
              </button>
            </header>

            <div className="river-reader-note">
              <strong>Reader note</strong>
              <p>
                An early chapter mentions a period when I experienced suicidal thoughts. It is shared without graphic detail because it is part of the truth of the journey, not the centre of it.
              </p>
            </div>

            <div className="river-intro-quote">
              <span>“</span>
              <p>
                Some rivers begin quietly. Some disappear beneath the ground. Some meet rocks, change direction and keep moving. Looking back, my life has felt a little like that.
              </p>
            </div>

            <div className="river-chapters">
              {riverChapters.map((chapter) => (
                <section className="river-chapter" key={chapter.number}>
                  <div className="river-chapter-index">
                    <span>{chapter.number}</span>
                    <i />
                    <small>{chapter.period}</small>
                  </div>
                  <h2>{chapter.title}</h2>
                  <div className="river-chapter-copy">
                    {chapter.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="river-continuation">
              <span>TO BE CONTINUED</span>
              <h2>This river is still moving.</h2>
              <p>
                The story has reached the present, but not the end. More chapters will be added as life continues — new people, new work, new lessons, new places and whatever waits further downstream.
              </p>
              <strong>— Wahab Opeyemi Badmus</strong>
            </div>

            <section className="river-reactions">
              <div className="river-response-heading">
                <div>
                  <span>AFTER READING</span>
                  <h2>What did the story leave with you?</h2>
                </div>
                <strong>{totalReactions} reactions</strong>
              </div>

              <div className="river-reaction-grid">
                {reactions.map((reaction) => (
                  <button
                    key={reaction.key}
                    type="button"
                    className={myReaction === reaction.key ? 'selected' : ''}
                    onClick={() => void react(reaction.key)}
                  >
                    <span>{reaction.emoji}</span>
                    <div>
                      <strong>{reaction.label}</strong>
                      <small>{reactionCounts[reaction.key]}</small>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="river-comments">
              <div className="river-response-heading">
                <div>
                  <span>READER REFLECTIONS</span>
                  <h2>Leave a thought behind.</h2>
                </div>
                <p>Comments are reviewed before appearing publicly.</p>
              </div>

              <form onSubmit={submitComment} className="river-comment-form">
                <label>
                  <span>Your name</span>
                  <input
                    required
                    name="name"
                    minLength={2}
                    maxLength={80}
                    placeholder="Name"
                  />
                </label>
                <label>
                  <span>Your thought</span>
                  <textarea
                    required
                    name="message"
                    minLength={3}
                    maxLength={900}
                    rows={4}
                    placeholder="What stayed with you after reading?"
                  />
                </label>
                {commentSent && (
                  <p className="river-comment-success">
                    Thank you. Your reflection is waiting for approval.
                  </p>
                )}
                {error && <p className="river-comment-error">{error}</p>}
                <button type="submit" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Leave my reflection'} <span>↗</span>
                </button>
              </form>

              {comments.length > 0 && (
                <div className="river-comment-wall">
                  {comments.map((comment) => (
                    <article key={comment.id}>
                      <span>READER</span>
                      <p>“{comment.message}”</p>
                      <strong>— {comment.name}</strong>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </article>
        </div>
      )}
    </section>
  );
}
