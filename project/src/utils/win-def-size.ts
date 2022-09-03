const screens = {
  mobile: 320,
  beetween: 500,
  tablet: 768,
  desktop: 1280,
};

export function getCurrentScreen(flag: boolean) {
  flag = !flag;
  const width = window.innerWidth;
  switch (true) {
    case width < screens.beetween:
      return screens.mobile;

    case width < screens.tablet && width > screens.beetween:
      return screens.beetween;

    case width < screens.desktop && width > screens.tablet:
      return screens.tablet;

    case width >= screens.desktop:
      return screens.desktop;

    default:
      return screens.desktop;
  }
}
