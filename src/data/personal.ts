export interface PersonalImage {
  src: string;
  alt: string;
  caption: string;
}

export interface PersonalCollection {
  slug: string;
  name: string;
  count: number;
  intro: string;
  accent: string;
  cover: string;
  images: PersonalImage[];
}

export const personalCollections: PersonalCollection[] = [
  {
    slug: 'doodling',
    name: 'Doodling',
    count: 4,
    intro: 'Little drawn details, playful lines, and small moments turned into something of my own.',
    accent: '#738b70',
    cover: 'personal/doodling/doodling-02.jpg',
    images: [
      { src: 'personal/doodling/doodling-01.jpg', alt: 'Portrait with a hand-drawn doodle overlay', caption: 'A few lines in the frame' },
      { src: 'personal/doodling/doodling-02.jpg', alt: 'Portrait in a garden with a playful doodle overlay', caption: 'Daydreaming in green' },
      { src: 'personal/doodling/doodling-03.jpg', alt: 'Portrait on a colorful outdoor staircase with doodle details', caption: 'A little color, a little ink' },
      { src: 'personal/doodling/doodling-04.jpg', alt: 'Portrait among flowers with doodle details', caption: 'Growing ideas' },
    ],
  },
  {
    slug: 'mandala-art',
    name: 'Mandala art',
    count: 3,
    intro: 'Repeating shapes and patiently layered details, each pattern finding its own center.',
    accent: '#bb6471',
    cover: 'personal/mandala-art/mandala-art-03.jpg',
    images: [
      { src: 'personal/mandala-art/mandala-art-01.jpg', alt: 'A collection of intricate black-and-white mandala drawings', caption: 'Circles in conversation' },
      { src: 'personal/mandala-art/mandala-art-02.jpg', alt: 'Detailed black-ink drawing with ornamental patterns', caption: 'A page full of little details' },
      { src: 'personal/mandala-art/mandala-art-03.jpg', alt: 'Pink artwork with three intricate mandala patterns', caption: 'Patterns in pink' },
    ],
  },
  {
    slug: 'calligraphy',
    name: 'Calligraphy',
    count: 2,
    intro: 'Letterforms with flow, weight, and movement: a way to make writing feel like drawing.',
    accent: '#786a91',
    cover: 'personal/calligraphy/calligraphy-01.jpg',
    images: [
      { src: 'personal/calligraphy/calligraphy-01.jpg', alt: 'Bold black calligraphic lettering on a warm paper background', caption: 'Letters with a strong voice' },
      { src: 'personal/calligraphy/calligraphy-02.jpg', alt: 'Expressive black calligraphy drawn in sweeping lines', caption: 'Ink in motion' },
    ],
  },
  {
    slug: 'greeting-cards',
    name: 'Handmade greeting cards',
    count: 13,
    intro: 'Small paper keepsakes, made by hand and sent to mark the moments worth celebrating.',
    accent: '#c57867',
    cover: 'personal/greeting-cards/greeting-cards-03.jpg',
    images: [
      { src: 'personal/greeting-cards/greeting-cards-01.jpg', alt: 'Handmade greeting cards displayed at a grocery store', caption: 'On the grocery-store shelf' },
      { src: 'personal/greeting-cards/greeting-cards-02.jpg', alt: 'Hand-lettered thank-you cards arranged together', caption: 'A handwritten thank-you' },
      { src: 'personal/greeting-cards/greeting-cards-03.jpg', alt: 'A selection of handmade cards with lettering and floral details', caption: 'A small collection of kind words' },
      { src: 'personal/greeting-cards/greeting-cards-04.jpg', alt: 'Handmade cards with colorful lettering and illustrations', caption: 'Color, lettering, and a little humor' },
      { src: 'personal/greeting-cards/greeting-cards-05.jpg', alt: 'Handmade greeting cards displayed on a grocery-store counter', caption: 'A little corner of the store' },
      { src: 'personal/greeting-cards/greeting-cards-06.jpg', alt: 'Illustrated greeting cards arranged on a tabletop', caption: 'Playful illustrated cards' },
      { src: 'personal/greeting-cards/greeting-cards-07.jpg', alt: 'A set of illustrated and hand-lettered greeting cards', caption: 'Cards for all kinds of days' },
      { src: 'personal/greeting-cards/greeting-cards-08.jpg', alt: 'Handmade cards with small illustrated messages', caption: 'Messages made by hand' },
      { src: 'personal/greeting-cards/greeting-cards-09.jpg', alt: 'Floral greeting cards with hand-lettered notes', caption: 'Flowers and thoughtful words' },
      { src: 'personal/greeting-cards/greeting-cards-10.jpg', alt: 'Greeting cards with a heart illustration and hand-drawn message', caption: 'A little love, in ink' },
      { src: 'personal/greeting-cards/greeting-cards-11.jpg', alt: 'A playful collection of handmade greeting cards', caption: 'A card for a good laugh' },
      { src: 'personal/greeting-cards/greeting-cards-12.jpg', alt: 'Colorful handmade cards arranged in a row', caption: 'A few favorites together' },
      { src: 'personal/greeting-cards/greeting-cards-13.jpg', alt: 'Two handmade greeting cards with illustrated designs', caption: 'Little details, made to give' },
    ],
  },
];
