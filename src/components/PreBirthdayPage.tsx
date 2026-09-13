import { useEffect, useMemo, useState } from "react";

type CountdownState = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getNextBirthdayTarget() {
  const now = new Date();

  const currentYear = now.getFullYear();

  let target = new Date(
    `${currentYear}-10-30T00:00:00+01:00`
  );

  if (now.getTime() >= target.getTime()) {
    target = new Date(
      `${currentYear + 1}-10-30T00:00:00+01:00`
    );
  }

  return target;
}

function calculateCountdown(target: Date): CountdownState {
  const now = new Date();
  const difference = target.getTime() - now.getTime();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  const hours = Math.floor(
    (difference / (1000 * 60 * 60)) % 24
  );

  const minutes = Math.floor(
    (difference / (1000 * 60)) % 60
  );

  const seconds = Math.floor(
    (difference / 1000) % 60
  );

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

function formatNumber(value: number) {
  return String(value).padStart(2, "0");
}

export default function PreBirthdayPage() {
  const target = useMemo(() => getNextBirthdayTarget(), []);

  const [countdown, setCountdown] = useState<CountdownState>(
    calculateCountdown(target)
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      const nextCountdown = calculateCountdown(target);

      setCountdown(nextCountdown);

      const hasReachedBirthday =
        nextCountdown.days === 0 &&
        nextCountdown.hours === 0 &&
        nextCountdown.minutes === 0 &&
        nextCountdown.seconds === 0;

      if (hasReachedBirthday) {
        window.clearInterval(timer);

        window.setTimeout(() => {
          window.location.reload();
        }, 1200);
      }
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [target]);

  return (
    <main className="prebirthday-page">
      <div className="prebirthday-glow prebirthday-glow-one" />
      <div className="prebirthday-glow prebirthday-glow-two" />

      <div className="balloon balloon-one">
        <span className="balloon-body" />
        <span className="balloon-string" />
      </div>

      <div className="balloon balloon-two">
        <span className="balloon-body" />
        <span className="balloon-string" />
      </div>

      <div className="balloon balloon-three">
        <span className="balloon-body" />
        <span className="balloon-string" />
      </div>

      <div className="balloon balloon-four">
        <span className="balloon-body" />
        <span className="balloon-string" />
      </div>

      <section className="prebirthday-content">
        <p className="prebirthday-date-label">
          OCTOBER 30
        </p>

        <p className="prebirthday-kicker">
          IN ADDY TO
        </p>

        <h1 className="prebirthday-name">
          Wahab Opeyemi Badmus
        </h1>

        <div className="countdown-wrapper">
          <div className="countdown-grid">
            <div className="countdown-card">
              <span className="countdown-number">
                {formatNumber(countdown.days)}
              </span>
              <span className="countdown-label">
                DAYS
              </span>
            </div>

            <div className="countdown-card">
              <span className="countdown-number">
                {formatNumber(countdown.hours)}
              </span>
              <span className="countdown-label">
                HOURS
              </span>
            </div>

            <div className="countdown-card">
              <span className="countdown-number">
                {formatNumber(countdown.minutes)}
              </span>
              <span className="countdown-label">
                MINUTES
              </span>
            </div>

            <div className="countdown-card">
              <span className="countdown-number">
                {formatNumber(countdown.seconds)}
              </span>
              <span className="countdown-label">
                SECONDS
              </span>
            </div>
          </div>

          <p className="countdown-caption">
            Counting down to October 30 · Africa/Lagos
          </p>
        </div>

        <div className="prebirthday-divider">
          <span />
          <strong>30 · 10</strong>
          <span />
        </div>
      </section>
    </main>
  );
}