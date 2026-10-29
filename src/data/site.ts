// Site-wide settings. A link left empty renders as plain text instead of a dead link.
export const site = {
  name: 'Khadija Sardar',
  role: 'Industrial Designer · UI/UX Designer',
  url: 'https://khadijasardar.com',
  description:
    'Khadija Sardar is an industrial and UI/UX designer exploring the intersection of function, aesthetics and human-centered design.',
  /** Shows the "Available for work" dot in the nav. */
  available: true,
  contact: {
    email: 'sardarkhadija03@gmail.com',
    behance: 'https://www.behance.net/sardarkhadija',
    linkedin: 'https://www.linkedin.com/in/sardarkhadija/',
  },
  // "View full competitive audit here." on the Pennie case study.
  pennieAuditUrl: '',
  about: {
    statement: 'My design perspective is shaped by the people I meet, the places I learn, and the things I make.',
    skills: ['User Research', 'Human-Centered Design', 'Ideation', 'Prototyping', 'Branding', 'Packaging', 'UI/UX Design', 'Usability Testing'],
    bio: 'I’m an industrial design student drawn to people-centered problems and ideas you can hold in your hands. My path began with three semesters at NUST in Pakistan, took me to METU in Türkiye as an exchange student, and brought me to Iowa State after transferring to the U.S. Each place has added a new perspective to how I design.',
    tools: ['Onshape', 'Fusion', 'KeyShot', 'Rhino', 'Figma', 'Illustrator', 'Photoshop'],
    education: [] as { school: string; detail: string }[],
    journey: [
      { place: 'Pakistan', school: 'NUST · Islamabad', detail: 'Industrial Design · 3 semesters', dates: '2022 — 2024', mark: '01' },
      { place: 'Türkiye', school: 'METU · Ankara', detail: 'Exchange student · selected 1 of 4 from Pakistan', dates: 'Spring 2024', mark: '02' },
      { place: 'United States', school: 'Iowa State · Ames, Iowa', detail: 'Transferred to complete a B.I.D. in Industrial Design', dates: 'Expected 2027', mark: '03' },
    ],
    experience: [
      { role: 'Undergraduate Research Assistant', place: 'Iowa State · 2026—now', detail: 'Human-centered and pediatric assistive-device research; co-authored a faculty-mentored paper and designed a book frame now used in clinics.' },
      { role: 'UX & Brand Designer', place: 'Independent · 2024—now', detail: 'Creating identities, websites, and digital experiences for small-business clients.' },
      { role: 'Summer Assistant', place: 'ISU Extension & Outreach · 2026', detail: 'Supported 4-H youth and community programming.' },
    ],
    recognition: ['Iowa State Dean’s List · 2025—now', 'NUST High Achiever List · 2024', 'Google UX Design Certificate', 'CITI Social & Behavioral Research Certificate'],
  },
};

export type Theme = 'light' | 'dark';
