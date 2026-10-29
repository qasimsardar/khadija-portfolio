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
    statement: 'I’m dedicated to crafting meaningful visual experiences through a multidisciplinary design approach.',
    // Disciplines taken from the sections of her own case studies.
    skills: ['User Research', 'Ideation & Sketching', 'CAD', 'Prototyping', 'Branding', 'Packaging', 'UI/UX Design', 'Usability Testing'],
    // Not in the Figma file yet. Each block appears on the site once it has content.
    bio: '',
    tools: [] as string[],
    education: [] as { school: string; detail: string }[],
  },
};

export type Theme = 'light' | 'dark';
