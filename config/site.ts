export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Valo Bunker",

  description: "Anything useful about Valorant is here!",

  navItems: [
    { label: "Agents", href: "/agents" },
    { label: "Maps", href: "/maps" },
    { label: "Weapons", href: "/weapons" },
  ],

  navAbilitiesComparison: [
    {
      label: "Blinds",
      href: "/blinds",
      description: "Disorient or obstruct the enemy's vision.",
    },
    {
      label: "Mollies",
      href: "/mollies",
      description: "Deals damage and slows enemies within its area of effect.",
    },
    {
      label: "Smokes",
      href: "/smokes",
      description: "Blocks vision and provides cover for players.",
    },
  ],

  navMenuItems: [
    { label: "Agents", href: "/agents" },
    { label: "Maps", href: "/maps" },
    { label: "Weapons", href: "/weapons" },
  ],

  dropdownEsports: [
    {
      label: "Events",
      href: "/esports/events",
      description: "Valorant esports events",
    },
    {
      label: "Players",
      href: "/esports/players",
      description: "All Valorant pro players",
    },
    {
      label: "Teams",
      href: "/esports/teams",
      description: "Teams playing in the VCTs",
    },
  ],
};
