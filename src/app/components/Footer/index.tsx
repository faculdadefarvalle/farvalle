import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { PrismicRichText } from "@prismicio/react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { CookiePreferencesLink } from "../CookieConsent";
import { LuChevronRight, LuMail, LuMapPin, LuPhone, LuUserRound } from "react-icons/lu";
import logo from "../../../../public/farvalle-logo-white.png";
import eMec from "../../../../public/e-mec.webp";
import qrCode from "../../../../public/qr-code-farvalle.svg";
import { getSiteSettings, SocialLink } from "../../lib/prismic-content";
import { buildNavigation, linkRel } from "../../lib/site-nav";
import styles from "./style.module.scss";

const socialIcons = {
  whatsapp: IoLogoWhatsapp,
  instagram: FaInstagram,
  facebook: FaFacebook,
  youtube: FaYoutube,
  linkedin: FaLinkedin,
};

const renderSocialIcon = (social: SocialLink) => {
  const Icon = socialIcons[social.platform as keyof typeof socialIcons] || FaInstagram;
  return <Icon size={18} aria-hidden="true" />;
};

export async function Footer() {
  const settings = await getSiteSettings();
  const footer = settings.footer;
  const navigation = buildNavigation(settings.header.navigation);
  const courses = navigation.menu.find((item) => item.id === "cursos")?.children || [];
  const logoSource: string | StaticImageData = footer.logo?.url || logo;
  const emecLogoSource: string | StaticImageData = footer.emecLogo?.url || eMec;
  const emecQrSource: string | StaticImageData = footer.emecQrCode?.url || qrCode;
  const socialLinks = footer.socialLinks.filter((social) => social.href && social.href !== "/");
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`fv-container ${styles.grid}`}>
        <div className={styles.brand}>
          <Link href="/" aria-label="Farvalle — página inicial">
            <Image
              src={logoSource}
              alt={footer.logo?.alt || "Farvalle — Faculdade Regional do Valle"}
              width={footer.logo?.width || 1601}
              height={footer.logo?.height || 252}
              className={styles.logo}
            />
          </Link>
          <p className={styles.tagline}>Educação de hoje para um amanhã com mais oportunidades.</p>
          {socialLinks.length > 0 && (
            <div className={styles.social}>
              {socialLinks.map((social) => (
                <Link
                  key={social.platform}
                  href={social.href}
                  target={social.target || "_blank"}
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={social.platform}
                >
                  {renderSocialIcon(social)}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className={styles.column}>
          <strong className={styles.columnTitle}>Navegação</strong>
          <ul>
            {navigation.menu.map((item) => (
              <li key={item.id}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.column}>
          <strong className={styles.columnTitle}>Cursos</strong>
          <ul>
            {courses.map((course) => (
              <li key={course.href}>
                <Link href={course.href}>{course.label}</Link>
              </li>
            ))}
          </ul>
          <Link href="/cursos" className={styles.columnMore}>
            Ver todos os cursos <LuChevronRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <div className={`${styles.column} ${styles.contact}`}>
          <strong className={styles.columnTitle}>Contato</strong>
          <ul>
            <li>
              <LuMapPin size={16} aria-hidden="true" />
              <span>{footer.address}</span>
            </li>
            {footer.phone && (
              <li>
                <LuPhone size={16} aria-hidden="true" />
                <a href={`tel:${footer.phone.replace(/\D/g, "")}`}>{footer.phone}</a>
              </li>
            )}
            {footer.email && (
              <li>
                <LuMail size={16} aria-hidden="true" />
                <a href={`mailto:${footer.email}`}>{footer.email}</a>
              </li>
            )}
          </ul>
        </div>

        <div className={styles.cta}>
          <Link href={navigation.portal.href} target={navigation.portal.target} rel={linkRel(navigation.portal.target)} className="fv-btn fv-btn--ghost-light">
            <LuUserRound size={16} aria-hidden="true" />
            {navigation.portal.label}
          </Link>
          <Link href={navigation.primary.href} className="fv-btn fv-btn--primary">
            {navigation.primary.label}
            <LuChevronRight size={16} aria-hidden="true" />
          </Link>
          <Link href={footer.emecLink} target="_blank" rel="noopener noreferrer" className={styles.emec}>
            <Image src={emecQrSource} width={56} height={56} alt={footer.emecQrCode?.alt || "QR Code e-MEC"} className={styles.emecQr} unoptimized />
            <span>
              <Image src={emecLogoSource} width={90} height={32} alt={footer.emecLogo?.alt || "e-MEC"} className={styles.emecLogo} />
              <small>{footer.emecText}</small>
            </span>
          </Link>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={`fv-container ${styles.bottomInner}`}>
          <span>© {year} Farvalle – Faculdade Regional do Valle. Todos os direitos reservados.</span>
          <CookiePreferencesLink className={styles.cookies} />
          <span className={styles.description}>
            <PrismicRichText
              field={footer.description}
              components={{ paragraph: ({ children }) => <span>{children}</span> }}
            />
          </span>
        </div>
      </div>
    </footer>
  );
}
