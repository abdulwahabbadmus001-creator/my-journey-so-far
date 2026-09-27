import type { MemoryEntry } from '../types/content';

export type MomentGalleryImage = {
  imageUrl: string;
  altText: string;
  label?: string;
};

export type CuratedMemory = MemoryEntry & {
  gallery?: MomentGalleryImage[];
  disclosure?: string;
};

export const curatedMoments: CuratedMemory[] = [
  {
    id: 'before-any-of-this',
    title: 'Before Any of This',
    caption: 'Long before research, software, fellowships and products, there was simply a child who had no idea where the road would lead.',
    story: 'Every journey looks obvious in reverse. Living it is different. This photograph belongs to a time before the titles, projects and plans that now make parts of the story look connected. I keep it here as a reminder that becoming usually begins long before we have language for what we are becoming.',
    category: 'Life',
    dateLabel: 'EARLY YEARS',
    imageUrl: '/images/moments/01-before-any-of-this.webp',
    altText: 'A childhood portrait of Wahab.',
    displayOrder: 1,
    published: true,
  },
  {
    id: 'ilorin-research',
    title: 'Ilorin - Where Research Found Me',
    caption: 'An undergraduate field trip became one of the places where research started becoming part of who I was.',
    story: 'I travelled to Ilorin with my project partners Sarah and Mariam for field research connected to our undergraduate work. Between community visits, conversations, data gathering and the ordinary moments in between, I found myself taking greater responsibility for turning what we gathered into written research. I also met my cousin Aminat there. One of these photographs was taken in front of the house of the Baale of Dada, within the community we were researching. Looking back, Ilorin was more than a field trip. It was one of the places where research began to feel like a skill I wanted to keep developing.',
    category: 'Learning',
    dateLabel: 'ILORIN',
    imageUrl: '/images/moments/06-ilorin-baale-dada.webp',
    altText: 'Wahab and his research partners in front of the house of the Baale of Dada in Ilorin.',
    displayOrder: 2,
    published: true,
    gallery: [
      { imageUrl: '/images/moments/03-ilorin-aminat.webp', altText: 'Wahab with his cousin Aminat during the Ilorin research trip.', label: 'With my cousin Aminat' },
      { imageUrl: '/images/moments/04-ilorin-mariam.webp', altText: 'Wahab with Mariam during the undergraduate research trip in Ilorin.', label: 'A lighter moment with Mariam' },
      { imageUrl: '/images/moments/05-ilorin-research-team.webp', altText: 'Wahab with Mariam and Sarah during their undergraduate field research.', label: 'With Mariam and Sarah' },
      { imageUrl: '/images/moments/06-ilorin-baale-dada.webp', altText: 'Wahab and his research partners at the house of the Baale of Dada.', label: "At the Baale of Dada's house" },
    ],
  },
  {
    id: 'graduation',
    title: 'The Gown Was Never Just the Gown',
    caption: 'The photographs show a celebration. Behind them were years of uncertainty, commuting, friendships, research and persistence.',
    story: 'Graduation looked like gowns, cameras and smiles on the outside. Behind those images were years of moving through university life, meeting people who became part of the story, learning to research, and continuing through seasons that were not always easy. What made the day especially memorable was seeing people show up to celebrate with me. Among the people captured here are my Mum, Dr. Adepoju, Mrs Shokunbi and Adunni Mi ❤️🥰. The gown marked the end of one formal chapter, but it also made something else clear: another part of the river had been crossed.',
    category: 'Milestones',
    dateLabel: 'UNIVERSITY CHAPTER',
    imageUrl: '/images/moments/07-graduation-day.webp',
    altText: 'Wahab wearing his graduation gown outdoors.',
    displayOrder: 3,
    published: true,
    gallery: [
      { imageUrl: '/images/moments/07-graduation-day.webp', altText: 'Wahab wearing his graduation gown outdoors.', label: 'The day itself' },
      { imageUrl: '/images/moments/08-graduation-studio.webp', altText: 'A studio graduation portrait of Wahab.', label: 'A studio portrait' },
      { imageUrl: '/images/moments/09-graduation-creative.webp', altText: 'Wahab posing in graduation attire beside graduation props.', label: 'One for the archive' },
      { imageUrl: '/images/moments/10-graduation-support.webp', altText: 'Wahab at graduation with his Mum and Dr. Adepoju.', label: 'My Mum and Dr. Adepoju' },
      { imageUrl: '/images/moments/11-graduation-people.webp', altText: 'Wahab at graduation with Mrs Shokunbi and his Mum.', label: 'Mrs Shokunbi and my Mum' },
      { imageUrl: '/images/moments/12-graduation-studio-together.webp', altText: 'Adunni Mi ❤️🥰 kissing Wahab on the cheek during their graduation studio shoot.', label: 'With Adunni Mi ❤️🥰' },
    ],
  },
  {
    id: 'techcrush',
    title: 'A New River',
    caption: 'A fully funded Mobile Development programme at TechCrush gave my growing interest in technology a more practical direction.',
    story: 'In February 2026, I applied for a fully funded Mobile Development opportunity at TechCrush and was selected. Completing the programme gave me structured exposure to building software, working through projects and thinking more seriously about development as something I could continue doing. The graduation graphic is small evidence of a much bigger shift: technology was no longer only an interest. I was beginning to build with it.',
    category: 'Milestones',
    dateLabel: 'TECHCRUSH Ã‚- 2026',
    imageUrl: '/images/moments/14-techcrush-graduating.webp',
    altText: 'TechCrush graduation graphic celebrating WahabÃ¢â‚¬â„¢s completion of the Tech4Africans Scholarship programme.',
    displayOrder: 4,
    published: true,
  },
  {
    id: 'learning-machine',
    title: 'Learning How the Machine Thinks',
    caption: 'Assignments that once looked strange gradually became problems I could sit with, break down and solve.',
    story: 'My development journey did not begin with already knowing how to code. It began with learning. CS50 pushed me into computer science fundamentals and C. Python for Everybody introduced another way of thinking about programming. These screenshots may look ordinary, but I wanted them in this archive because they record the work behind the transition Ã¢â‚¬" the hours of reading, trying, failing, debugging and eventually seeing an assignment work.',
    category: 'Learning',
    dateLabel: 'CS50 Ã‚- PYTHON FOR EVERYBODY',
    imageUrl: '/images/moments/16-cs50-codespace.webp',
    altText: 'A screen showing Wahab working inside a CS50 coding environment.',
    displayOrder: 5,
    published: true,
    gallery: [
      { imageUrl: '/images/moments/15-cs50-readability.webp', altText: 'A CS50 assignment and submission screen.', label: 'CS50 Ã‚- Readability' },
      { imageUrl: '/images/moments/16-cs50-codespace.webp', altText: 'WahabÃ¢â‚¬â„¢s CS50 Codespace showing programming work.', label: 'Inside CS50 Codespace' },
      { imageUrl: '/images/moments/17-python-for-everybody.webp', altText: 'A Python for Everybody assignment and successful program output.', label: 'Python for Everybody' },
    ],
  },
  {
    id: 'learning-to-building',
    title: 'From Learning to Building',
    caption: 'At some point, learning syntax stopped being enough. I wanted to build things people could actually use.',
    story: 'That curiosity moved me from exercises into products and prototypes across weather, education, productivity, culture, language, offline technology and business tools. The images here are deliberately imperfect: development environments, product previews and experiments. They show the process rather than only the polished result. Even this birthday experience became part of that journey Ã¢â‚¬" using code not only to solve a technical problem, but to preserve a story.',
    category: 'Working',
    dateLabel: 'BUILDING Ã‚- 2026',
    imageUrl: '/images/moments/18-naijahomes-build.webp',
    altText: 'A development environment showing work on the NaijaHomes project.',
    displayOrder: 6,
    published: true,
    gallery: [
      { imageUrl: '/images/moments/18-naijahomes-build.webp', altText: 'A development environment showing work on NaijaHomes.', label: 'Building NaijaHomes' },
      { imageUrl: '/images/moments/19-birthday-site-build.webp', altText: 'A development screen from the birthday website project.', label: 'Building this October Chapter' },
      { imageUrl: '/images/moments/20-foretrend-preview.webp', altText: 'A browser preview of the ForeTrend product.', label: 'ForeTrend preview' },
      { imageUrl: '/images/moments/21-generative-ai-experiment.webp', altText: 'An AI-generated portrait created during a generative AI experiment.', label: 'Generative AI experiment Ã‚- AI-generated' },
    ],
    disclosure: 'One image in this set is AI-generated and is labelled as such. It is included as an experiment, not presented as a real photograph.',
  },
  {
    id: 'abuja',
    title: 'Abuja Ã¢â‚¬" New Rooms, New People',
    caption: 'The Heinrich BÃƒÂ¶ll Stiftung Nigeria Green Academy brought learning, conversations and a new circle of people into the journey.',
    story: 'In 2026, another branch of the river led to Abuja through the Heinrich BÃƒÂ¶ll Stiftung Nigeria Green Academy. The programme was informative and educational, but the experience was also about the people, conversations and perspectives that filled the days around the sessions. Some opportunities change you because of what is taught. Others change you because of who you encounter while you are there. Abuja gave me some of both.',
    category: 'Events',
    dateLabel: 'ABUJA Ã‚- 2026',
    imageUrl: '/images/moments/22-nga-profile.webp',
    altText: 'A Nigeria Green Academy 2026 fellow profile graphic featuring Wahab.',
    displayOrder: 7,
    published: true,
    gallery: [
      { imageUrl: '/images/moments/22-nga-profile.webp', altText: 'Nigeria Green Academy 2026 fellow profile graphic featuring Wahab.', label: 'The fellowship chapter' },
      { imageUrl: '/images/moments/23-nga-community.webp', altText: 'Wahab with other participants during the Nigeria Green Academy programme.', label: 'New people, new conversations' },
      { imageUrl: '/images/moments/24-nga-banner.webp', altText: 'Wahab beside a Nigeria Green Academy banner with another participant.', label: 'Nigeria Green Academy' },
      { imageUrl: '/images/moments/25-nga-group.webp', altText: 'A group moment during the Nigeria Green Academy programme.', label: 'The room beyond the sessions' },
      { imageUrl: '/images/moments/26-nga-session.webp', altText: 'A learning session during the Nigeria Green Academy programme.', label: 'Inside a session' },
      { imageUrl: '/images/moments/27-nga-milestone.webp', altText: 'Wahab at a Nigeria Green Academy milestone moment.', label: 'A chapter worth keeping' },
    ],
  },
  {
    id: 'chess-two-zero',
    title: 'A Very Short Chess Career',
    caption: 'Mr. Wisdom taught us the game. Later that night, Mr. Ismail and I sat down for a match. Final score: Ismail 2 Ã¢â‚¬" Wahab 0.',
    story: 'Not every memory needs to carry a major lesson. This one stays because it makes me laugh. While in Abuja, Mr. Wisdom taught us chess. Mr. Ismail and I later tested what we had learned against each other. I was beaten 2Ã¢â‚¬"0 that night. Some moments deserve a place in the archive precisely because they are ordinary, funny and human.',
    category: 'Life',
    dateLabel: 'ABUJA Ã‚- 2Ã¢â‚¬"0',
    imageUrl: '/images/moments/28-chess-2-0.webp',
    altText: 'A chessboard from the night Wahab played Mr. Ismail in Abuja.',
    displayOrder: 8,
    published: true,
  },
  {
    id: 'going-home',
    title: 'Going Home, Not Going Back',
    caption: 'The Abuja journey began inside a plane and eventually ended inside another, but returning to Lagos did not mean returning as exactly the same person.',
    story: 'The first image records the flight to Abuja for the HBS Nigeria Green Academy journey. The final images are from the Air Peace Boeing First Class journey back to Lagos. Between those flights were new conversations, people, lessons and experiences that became part of the larger story. Sometimes a journey ends geographically before it ends inside you.',
    category: 'Travel',
    dateLabel: 'ABUJA Ã¢â€ " LAGOS',
    imageUrl: '/images/moments/29-flight-to-abuja.webp',
    altText: 'View from inside the plane carrying Wahab to Abuja for the Nigeria Green Academy programme.',
    displayOrder: 9,
    published: true,
    gallery: [
      { imageUrl: '/images/moments/29-flight-to-abuja.webp', altText: 'Inside the plane on the journey to Abuja.', label: 'Going to Abuja' },
      { imageUrl: '/images/moments/30-return-first-class-cabin.webp', altText: 'Inside the Air Peace Boeing First Class cabin on the return journey to Lagos.', label: 'The return flight' },
      { imageUrl: '/images/moments/31-return-first-class-seat.webp', altText: 'Wahab seated on the Air Peace Boeing First Class return journey from Abuja to Lagos.', label: 'Coming back to Lagos' },
    ],
  },
];


