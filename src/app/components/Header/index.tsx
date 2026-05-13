import { getSiteSettings } from "../../lib/prismic-content";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const settings = await getSiteSettings();

  return (
    <HeaderClient
      navigation={settings.header.navigation}
      logo={settings.header.logo}
      logoIcon={settings.header.logoIcon}
    />
  );
}
