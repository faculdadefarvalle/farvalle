"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiUser } from "react-icons/bi";
import { HiOutlineMenu } from "react-icons/hi";
import logo from "../../../../public/farvalle-logo.png";
import logoIcon from "../../../../public/farvalle-icon.png";
import { NavigationItem } from "../../lib/prismic-content";
import { HeaderMobile } from "../HeaderMobile";
import styles from "./style.module.scss";

type HeaderClientProps = {
  navigation: NavigationItem[];
  logo?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  logoIcon?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
};

export function HeaderClient({ navigation, logo: prismicLogo, logoIcon: prismicLogoIcon }: HeaderClientProps) {
  const [toggle, setToggle] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  function handleDropDownMenuClick(id: string) {
    setToggle((current) => (current === id ? "" : id));
  }

  function handleDropDownItemClick(route: string) {
    router.push(route);
    setToggle("");
  }

  const portalItems = navigation.filter((item) => item.variant === "portal");
  const primaryItems = navigation.filter((item) => item.variant === "primary");
  const regularItems = navigation.filter((item) => item.variant === "link");
  const logoSource: string | StaticImageData = prismicLogo?.url || logo;
  const logoIconSource: string | StaticImageData =
    prismicLogoIcon?.url || logoIcon;

  return showMenu === false ? (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <button
          className={styles.toggleMenu}
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Abrir menu"
        >
          <HiOutlineMenu size={32} />
        </button>
        <Link href="/" className={styles.logoContainer}>
          <Image
            className={styles.logo}
            src={logoSource}
            alt={prismicLogo?.alt || "Farvalle Logo"}
            width={prismicLogo?.width || 200}
            height={prismicLogo?.height || 80}
            priority
          />
          <Image
            className={styles.logoIcon}
            src={logoIconSource}
            alt={prismicLogoIcon?.alt || "Farvalle Logo"}
            width={prismicLogoIcon?.width || 80}
            height={prismicLogoIcon?.height || 80}
            priority
          />
        </Link>
        <ul className={`${styles.ul} dropdown-menu`} id="navbarNavDropdown">
          {regularItems.map((item) => (
            <li className={`${styles.menuLink} nav-item`} key={item.id}>
              {item.children.length ? (
                <button
                  className={styles.dropDownButton}
                  onClick={() => handleDropDownMenuClick(item.id)}
                >
                  {item.label}
                  <ul
                    className={
                      toggle === item.id ? styles.dropDownMenu : styles.dropDownMenuOff
                    }
                  >
                    {item.children.map((child) => (
                      <li
                        className={styles.dropDownItem}
                        onClick={() => handleDropDownItemClick(child.href)}
                        key={`${item.id}-${child.label}`}
                      >
                        {child.label}
                      </li>
                    ))}
                  </ul>
                </button>
              ) : (
                <Link className={styles.link} href={item.href} target={item.target}>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
          {(portalItems.length > 0 || primaryItems.length > 0) && (
            <li className={`${styles.menuLinkHr} nav-item`}>
              <hr />
            </li>
          )}
          {portalItems.map((item) => (
            <li className={`${styles.menuLink} nav-item`} key={item.id}>
              <Link
                className={styles.linkSystem}
                target={item.target}
                href={item.href}
              >
                <BiUser className={styles.icon} size={24} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
          {primaryItems.map((item) => (
            <li className={`${styles.menuLink} nav-item`} key={item.id}>
              <Link
                className={styles.linkSignUp}
                href={item.href}
                target={item.target}
              >
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  ) : (
    <HeaderMobile
      showMenu={showMenu}
      setShowMenu={setShowMenu}
      navigation={navigation}
      logo={prismicLogo}
      logoIcon={prismicLogoIcon}
    />
  );
}
