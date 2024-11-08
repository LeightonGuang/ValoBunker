export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Valo Bunker",
  description: "Anything useful about Valorant is here!",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    { label: "Agents", href: "/agents" },
    { label: "Weapons", href: "/weapons" },
    {
      label: "Smokes",
      href: "/smokes",
    },
    { label: "Blinds", href: "/blinds" },
    { label: "Mollies", href: "/mollies" },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    { label: "Agents", href: "/agents" },
    { label: "Weapons", href: "/weapons" },
    {
      label: "Smokes",
      href: "/smokes",
    },
    { label: "Blinds", href: "/blinds" },
    { label: "Mollies", href: "/mollies" },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
