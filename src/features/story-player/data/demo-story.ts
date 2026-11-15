import { storySchema } from '../schemas/story';

export const demoStory = storySchema.parse({
  schemaVersion: 2,
  id: 'los-caminos-que-nos-quedan',
  title: 'Los caminos que nos quedan',
  theme: 'celestial-nostalgia',
  scenes: {
    intro: {
      paragraphs: [
        'Para Nico. Hay caminos que seguimos recorriendo incluso después de volver a casa.',
      ],
    },
    connection: {
      title: 'Un encuentro sencillo',
      paragraphs: [
        'Nos conocimos compartiendo un mapa. Terminamos compartiendo las ganas de perdernos un rato.',
      ],
    },
    memories: {
      title: 'Tres lugares, una amistad',
      introduction:
        'No guardamos todos los días. Estos tres todavía nos acompañan.',
    },
    discovery: {
      title: 'Lo que tenían en común',
      paragraphs: [
        'Creí que recordaba los lugares. Ahora sé que también recordaba cómo me sentía al recorrerlos contigo.',
      ],
    },
    letter: {
      title: 'Lo que quería decirte',
      paragraphs: [
        'Gracias por hacer espacio para las conversaciones sin prisa. Ojalá sigamos encontrando caminos, incluso cuando no sepamos adónde llevan.',
      ],
      signature: 'Alma',
    },
    epilogue: {
      title: 'Todavía queda camino',
      paragraphs: [
        'Algunos recuerdos no terminan: nos acompañan hacia lo que viene.',
      ],
    },
  },
  memories: [
    {
      id: 'sobre-las-nubes',
      date: '2024-06-15',
      title: 'Sobre las nubes',
      message:
        'Llegamos sin ver la cima. Nos quedamos hasta que las nubes nos dejaron encontrarla.',
      image: {
        src: '/images/demo-mountain.webp',
        alt: 'Una montaña entre nubes blancas',
        width: 640,
        height: 423,
        credit: {
          author: 'Paula Vermeulen',
          sourceUrl: 'https://unsplash.com/photos/_f2m3mEkaaU',
          license: 'Unsplash License',
          licenseUrl: 'https://unsplash.com/license',
        },
      },
    },
    {
      id: 'el-camino-largo',
      date: '2024-10-19',
      title: 'El camino largo',
      message: 'Elegimos la vuelta más larga para no terminar la conversación.',
      image: {
        src: '/images/demo-forest.webp',
        alt: 'Un camino que atraviesa un bosque de otoño',
        width: 640,
        height: 440,
        credit: {
          author: 'Tony Webster',
          sourceUrl:
            'https://commons.wikimedia.org/wiki/File:Autumn_on_Ottawa_National_Forest_Road_Trip_-_Michigan_Upper_Peninsula_Fall_Colors_(29423477943).jpg',
          license: 'CC BY 2.0',
          licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
        },
      },
    },
    {
      id: 'aprender-el-silencio',
      date: '2025-01-12',
      title: 'Aprender el silencio',
      message:
        'Aquella mañana caminamos sin decir mucho. También así nos entendíamos.',
      image: {
        src: '/images/demo-winter.webp',
        alt: 'Un sendero silencioso entre árboles nevados',
        width: 640,
        height: 424,
        credit: {
          author: 'Ali Inay',
          sourceUrl: 'https://unsplash.com/photos/yNaGxHqjOuw',
          license: 'Unsplash License',
          licenseUrl: 'https://unsplash.com/license',
        },
      },
    },
  ],
});
