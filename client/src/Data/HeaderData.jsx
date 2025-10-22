const HeaderData = {
  topHeader: {
    appName: "MoveNMuse",
    navItems: [
      { name: "Courses", slug: "/courses", active: true },
      { name: "Rooms", slug: "/rooms", active: true },
    ],
  },
  userHeader: {
    navItems: [
      { name: "Account", slug: "/account", active: true },
      { name: "Cart", slug: "/cart", active: true },
      {
        name: "Payment History",
        slug: "paymentHistory",
        active: true,
      },
    ],
  },
};

export default HeaderData;
