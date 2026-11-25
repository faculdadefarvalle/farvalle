import { getSiteSettings } from "../../lib/prismic-content";
import { buildNavigation } from "../../lib/site-nav";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const settings = await getSiteSettings();
  const navigation = buildNavigation(settings.header.navigation);

  return (
    <HeaderClient
      menu={navigation.menu}
      portal={navigation.portal}
      primary={navigation.primary}
      logo={settings.header.logo}
    />
  );
}
