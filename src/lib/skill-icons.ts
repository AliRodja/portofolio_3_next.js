import {
  faBrain,
  faChartLine,
  faCloud,
  faCode,
  faDatabase,
  faGamepad,
  faMobileScreen,
  faPenRuler,
  faScrewdriverWrench,
  faServer,
  faShieldHalved,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

export const skillIcons = {
  web: { label: "Web", icon: faCode },
  backend: { label: "Backend", icon: faServer },
  ai: { label: "AI", icon: faBrain },
  mobile: { label: "Mobile", icon: faMobileScreen },
  database: { label: "Database", icon: faDatabase },
  cloud: { label: "Cloud", icon: faCloud },
  data: { label: "Data", icon: faChartLine },
  design: { label: "Design", icon: faPenRuler },
  security: { label: "Security", icon: faShieldHalved },
  game: { label: "Games", icon: faGamepad },
  tools: { label: "Tools", icon: faScrewdriverWrench },
} satisfies Record<string, { label: string; icon: IconDefinition }>;

export type SkillIcon = keyof typeof skillIcons;

export const skillIconKeys = Object.keys(skillIcons) as [
  SkillIcon,
  ...SkillIcon[],
];

export type SkillItem = { name: string; highlight: boolean };
