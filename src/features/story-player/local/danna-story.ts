import { storySchema } from '../schemas/story';

// Local development entry only: never export through the public player APIs.
export const dannaStory = storySchema.parse({
  schemaVersion: 2,
  id: 'danna-que-bonito-que-existas',
  title: 'Danna, qué bonito que existas',
  theme: 'celestial-nostalgia',
  memories: [],
  scenes: {
    intro: {
      paragraphs: [
        'Entre tantas personas en este mundo, hay alguien que se ha vuelto muy especial para mí.',
        'Y esa persona eres tú.',
      ],
    },
    connection: {
      title: 'Qué bonito coincidir contigo',
      paragraphs: [
        'No sé qué nos espera más adelante, pero me alegra muchísimo haberte conocido.',
      ],
    },
    memories: {
      title: 'Las pequeñas cosas',
      introduction:
        'No hacen falta grandes momentos para que alguien sea importante.\n\nA veces basta con una conversación, una sonrisa o simplemente pensar en esa persona.',
    },
    discovery: {
      title: 'Lo que me haces sentir',
      paragraphs: [
        'Me gusta cómo consigues sacarme una sonrisa y cómo, sin darte cuenta, haces que mis días tengan algo bonito.',
      ],
    },
    letter: {
      title: 'Hay algo que quiero decirte',
      paragraphs: [
        'Para ti, Danna ❤️',
        'Quería hacerte algo diferente, algo que pudieras abrir cuando quisieras y que te recordara lo especial que eres para mí.',
        'A veces siento que las palabras se quedan cortas para decirte lo mucho que te quiero. Quizás no siempre encuentre la mejor manera de expresarlo, pero quiero que sepas que me importas muchísimo.',
        'Me gusta pensar en todas esas cosas bonitas que todavía nos quedan por vivir. En las conversaciones que tendremos, las sonrisas que compartiremos y esos pequeños momentos que algún día podremos recordar con cariño.',
        'No sé cómo será el futuro, pero sí sé que me hace mucha ilusión imaginarte formando parte de él.',
        'Gracias por llegar a mi vida y por ser alguien tan especial para mí.',
        'Y si algún día te preguntas cuánto te quiero, espero que recuerdes este pequeño universo que hice pensando en ti.',
        'Te quiero muchísimo, Danna. ❤️',
      ],
      signature: 'Con mucho cariño, Josue',
    },
    epilogue: {
      title: 'Lo bonito está por venir',
      paragraphs: [
        'Todavía nos quedan muchas cosas por vivir y me gustaría que algunas de ellas fueran contigo.',
        'Te quiero muchísimo, Danna.',
      ],
    },
  },
});
