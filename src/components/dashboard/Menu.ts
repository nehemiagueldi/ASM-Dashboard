export const menuItems = [
  {
    label: "Home",
    href: "/dashboard",
  },
  {
    label: "PPD SALES",
    href: "/dashboard/ppdsales",
  },
  {
    label: "Report",
    children: [
      { label: "Report Daily", href: "/dashboard/report/daily" },
      { label: "Report JF", href: "/dashboard/report/jf" },
      // { label: "Report Achievement", href: "/dashboard/report/achievement" },
    ],
  },
  // {
  //   label: "Menu 2",
  //   href: "/menu-2",
  // },
];
