"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LuChevronDown, LuChevronRight, LuMenu, LuX, LuUserRound } from "react-icons/lu";
import logo from "../../../../public/farvalle-logo.png";
import type { NavigationItem, SiteLink } from "../../lib/prismic-content";
import { linkRel } from "../../lib/site-nav";
import styles from "./style.module.scss";

type HeaderClientProps = {
  menu: NavigationItem[];
  portal: SiteLink;
  primary: SiteLink;
  logo?: { url: string; alt: string; width: number; height: number };
};

export function HeaderClient({ menu, portal, primary, logo: prismicLogo }: HeaderClientProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const logoSource: string | StaticImageData = prismicLogo?.url || logo;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha menus ao navegar
  useEffect(() => {
    setOpen(false);
    setDropdown("");
  }, [pathname]);

  // Fecha o dropdown ao clicar fora do header (o painel do menu mobile fica fora do <nav>,
  // por isso a referência é o <header> inteiro — senão o submenu "Cursos" fechava ao abrir)
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setDropdown("");
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Trava o scroll com o menu mobile aberto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    const base = href.split("#")[0] || "/";
    if (base === "/") return pathname === "/";
    return pathname.startsWith(base);
  };

  return (
    <header ref={headerRef} className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <nav className={`fv-container ${styles.nav}`} ref={navRef} aria-label="Navegação principal">
        <Link href="/" className={styles.logoLink} aria-label="Farvalle — página inicial">
          <Image
            src={logoSource}
            alt={prismicLogo?.alt || "Farvalle — Faculdade Regional do Valle"}
            width={prismicLogo?.width || 1601}
            height={prismicLogo?.height || 252}
            className={styles.logo}
            priority
          />
        </Link>

        <ul className={styles.menu}>
          {menu.map((item) =>
            item.children.length ? (
              <li
                key={item.id}
                className={`${styles.menuItem} ${styles.hasChildren}`}
                onMouseEnter={() => setDropdown(item.id)}
                onMouseLeave={() => setDropdown("")}
              >
                <button
                  type="button"
                  className={`${styles.menuLink} ${isActive(item.href) ? styles.active : ""}`}
                  aria-expanded={dropdown === item.id}
                  aria-haspopup="true"
                  onClick={() => setDropdown((current) => (current === item.id ? "" : item.id))}
                >
                  {item.label}
                  <LuChevronDown size={14} aria-hidden="true" />
                </button>
                <ul className={`${styles.dropdown} ${dropdown === item.id ? styles.dropdownOpen : ""}`}>
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link href={child.href} target={child.target} rel={linkRel(child.target)} className={styles.dropdownLink}>
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={item.id} className={styles.menuItem}>
                <Link
                  href={item.href}
                  target={item.target} rel={linkRel(item.target)}
                  className={`${styles.menuLink} ${isActive(item.href) ? styles.active : ""}`}
                >
                  {item.label}
                </Link>
              </li>
            )
          )}
        </ul>

        <div className={styles.actions}>
          <Link href={portal.href} target={portal.target} rel={linkRel(portal.target)} className={`fv-btn fv-btn--outline-green ${styles.portal}`}>
            <LuUserRound size={16} aria-hidden="true" />
            {portal.label}
          </Link>
          <Link href={primary.href} target={primary.target} rel={linkRel(primary.target)} className={`fv-btn fv-btn--primary ${styles.primary}`}>
            {primary.label}
            <LuChevronRight size={16} aria-hidden="true" />
          </Link>
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            {open ? <LuX size={26} aria-hidden="true" /> : <LuMenu size={26} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      <div className={`${styles.mobile} ${open ? styles.mobileOpen : ""}`} aria-hidden={!open}>
        <ul className={styles.mobileList}>
          {menu.map((item) => (
            <li key={item.id}>
              {item.children.length ? (
                <>
                  <button
                    type="button"
                    className={styles.mobileLink}
                    onClick={() => setDropdown((current) => (current === item.id ? "" : item.id))}
                    aria-expanded={dropdown === item.id}
                  >
                    {item.label}
                    <LuChevronDown size={18} className={dropdown === item.id ? styles.rotate : ""} aria-hidden="true" />
                  </button>
                  <ul className={`${styles.mobileSub} ${dropdown === item.id ? styles.mobileSubOpen : ""}`}>
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} target={child.target} rel={linkRel(child.target)} className={styles.mobileSubLink}>
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link href={item.href} target={item.target} rel={linkRel(item.target)} className={styles.mobileLink}>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className={styles.mobileActions}>
          <Link href={portal.href} target={portal.target} rel={linkRel(portal.target)} className="fv-btn fv-btn--outline-green">
            <LuUserRound size={16} aria-hidden="true" />
            {portal.label}
          </Link>
          <Link href={primary.href} target={primary.target} rel={linkRel(primary.target)} className="fv-btn fv-btn--primary">
            {primary.label}
            <LuChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}
