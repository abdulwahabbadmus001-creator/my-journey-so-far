const gratitudeGroups = [
  {
    number: "01",
    title: "Family",
    subtitle: "The foundation",
    message:
      "To the people who have been there from the beginning — thank you for the sacrifices, prayers, encouragement, patience and support that have carried me through different seasons of my life. Much of what I continue to become has roots in what you have given me.",
  },
  {
    number: "02",
    title: "Friends",
    subtitle: "The people beside the journey",
    message:
      "To the friends who checked in, listened, laughed with me, challenged me, celebrated the small wins and remained present through uncertain moments — thank you. Some chapters become meaningful because of the people we get to share them with.",
  },
  {
    number: "03",
    title: "Mentors & Teachers",
    subtitle: "The people who helped me see further",
    message:
      "To every teacher, mentor and person who shared knowledge, corrected me, opened my mind to new possibilities or encouraged me to keep learning — your influence continues to shape the way I think, research, build and approach the future.",
  },
  {
    number: "04",
    title: "Colleagues & Collaborators",
    subtitle: "The people I have built alongside",
    message:
      "To everyone I have had the privilege of working, researching, learning, creating or building with — thank you for the conversations, ideas, opportunities, disagreements, lessons and shared experiences that have contributed to my growth.",
  },
  {
    number: "05",
    title: "Those Who Opened Doors",
    subtitle: "Opportunities that became turning points",
    message:
      "Some people entered my journey by offering an opportunity, recommendation, introduction, platform or simply believing I deserved a chance. I may never fully explain what those moments meant, but I remain deeply grateful for every door that was opened.",
  },
  {
    number: "06",
    title: "You",
    subtitle: "For being here",
    message:
      "And to you, reading this today — thank you for taking a moment to celebrate with me. Whether we have known each other for years or our paths crossed recently, your presence here has become part of this chapter too.",
  },
];

export default function GratitudeWall() {
  return (
    <section id="gratitude" className="gratitude-section">
      <div className="gratitude-container">
        <div className="gratitude-intro">
          <p className="gratitude-eyebrow">
            GRATITUDE · OCTOBER 30
          </p>

          <h2>
            People Who Have Been
            <span> Part of the Journey.</span>
          </h2>

          <p className="gratitude-lead">
            No journey is entirely ours alone. Behind the milestones,
            lessons, ideas and memories are people whose presence,
            encouragement and kindness helped shape the story.
          </p>
        </div>

        <div className="gratitude-grid">
          {gratitudeGroups.map((group) => (
            <article
              className="gratitude-card"
              key={group.title}
            >
              <div className="gratitude-card-top">
                <span className="gratitude-number">
                  {group.number}
                </span>

                <span className="gratitude-line" />
              </div>

              <p className="gratitude-subtitle">
                {group.subtitle}
              </p>

              <h3>{group.title}</h3>

              <p className="gratitude-message">
                {group.message}
              </p>
            </article>
          ))}
        </div>

        <div className="gratitude-ending">
          <span className="gratitude-small">
            A personal note
          </span>

          <p>
            There are people whose names may not appear on this page,
            but whose impact I carry with me. Some supported quietly.
            Some challenged me. Some believed before there was much to
            believe in. Some stayed only for a season, but left lessons
            that remained.
          </p>

          <strong>
            To everyone who has genuinely been part of my journey —
            thank you.
          </strong>

          <span className="gratitude-signature">
            — Wahab Opeyemi Badmus
          </span>
        </div>
      </div>
    </section>
  );
}