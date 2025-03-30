export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  userItems: [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Movements",
      href: "/dashboard/movements",
    },
    {
      label: "Products",
      href: "/dashboard/products",
    },
  ],

  adminItems: [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Movements",
      href: "/dashboard/movements",
    },
    {
      label: "Products",
      href: "/dashboard/products",
    },
    {
      label: "Users",
      href: "/dashboard/users",
    },
  ],
  
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
