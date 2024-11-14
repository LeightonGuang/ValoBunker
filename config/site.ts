export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Valo Bunker",
  description: "Anything useful about Valorant is here!",
  navItems: [
    { label: "Agents", href: "/agents" },
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
    { label: "Weapons", href: "/weapons" },
  ],
  dropdownEsports: [
    {
      label: "Teams",
      href: "/esports/teams",
      description: "Teams playing in the VCTs",
    },
    {
      label: "Players",
      href: "/esports/players",
      description: "All Valorant pro players",
    },
    {
      label: "Events",
      href: "/esports/events",
      description: "Valorant esports events",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
