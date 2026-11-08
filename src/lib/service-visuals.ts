type ServiceVisual = {
  icon: string;
  accent: string;
  tint: string;
  light: string;
  label: string;
  scopeIcons: string[];
  processIcons: string[];
  deliverableIcons: string[];
};

const visuals: Record<string, ServiceVisual> = {
  '01': {
    icon: 'browser', accent: '#315bc4', tint: '#eaf0ff', light: '#a9c3ff',
    label: 'DISEÑO + PRESENCIA DIGITAL',
    scopeIcons: [],
    processIcons: ['target', 'palette', 'code', 'rocket'],
    deliverableIcons: ['browser', 'palette', 'devices'],
  },
  '02': {
    icon: 'workflow', accent: '#7547ad', tint: '#f1eafa', light: '#d4b5ff',
    label: 'LÓGICA + SOLUCIONES A MEDIDA',
    scopeIcons: ['code', 'panels', 'scan', 'gauge', 'database', 'settings'],
    processIcons: ['workflow', 'panels', 'code', 'rocket'],
    deliverableIcons: ['panels', 'workflow', 'settings'],
  },
  '03': {
    icon: 'smartphone', accent: '#b44b3b', tint: '#fff0eb', light: '#ffb7a6',
    label: 'EXPERIENCIA + CONEXIÓN MÓVIL',
    scopeIcons: ['smartphone', 'palette', 'plug', 'gauge', 'scan', 'rocket'],
    processIcons: ['target', 'palette', 'code', 'rocket'],
    deliverableIcons: ['palette', 'smartphone', 'rocket'],
  },
  '04': {
    icon: 'chart', accent: '#197365', tint: '#e5f5ee', light: '#90ddc6',
    label: 'ESTRATEGIA + CRECIMIENTO ORGÁNICO',
    scopeIcons: ['scan', 'search', 'link', 'map-pin', 'award', 'chart'],
    processIcons: ['scan', 'search', 'workflow', 'chart'],
    deliverableIcons: ['search', 'map-pin', 'chart'],
  },
  '05': {
    icon: 'shopping-bag', accent: '#92611e', tint: '#fff4dc', light: '#f2ce83',
    label: 'CATÁLOGO + COMERCIO DIGITAL',
    scopeIcons: ['store', 'shopping-bag', 'plug', 'gauge', 'database', 'headset'],
    processIcons: ['package', 'cart', 'plug', 'rocket'],
    deliverableIcons: ['cart', 'plug', 'database'],
  },
};

export const serviceVisual = (step: string) => visuals[step] ?? visuals['01'];

export function serviceColors(step: string) {
  const { accent, tint, light } = serviceVisual(step);
  return `--service-accent:${accent};--service-tint-base:${tint};--service-light:${light};`;
}

export const webPlanIcons = [
  ['browser', 'devices', 'message', 'search', 'palette', 'rocket'],
  ['layers', 'devices', 'edit', 'message', 'chart', 'search'],
  ['layers', 'workflow', 'devices', 'edit', 'chart', 'graduation'],
];
