export const sceneNavigation = [
  { id: 'intro', label: 'Inicio' },
  { id: 'connection', label: 'Encuentro' },
  { id: 'memories', label: 'Recuerdos' },
  { id: 'discovery', label: 'Significado' },
  { id: 'letter', label: 'Carta' },
  { id: 'epilogue', label: 'Cierre' },
] as const;

export type SceneId = (typeof sceneNavigation)[number]['id'];
