import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { PrismicRichText } from "@prismicio/react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import logo from "../../../../public/farvalle-logo-white.png";
import eMec from "../../../../public/e-mec.webp";
import qrCode from "../../../../public/qr-code-farvalle.svg";
import { getSiteSettings, SocialLink } from "../../lib/prismic-content";
import styles from "./style.module.scss";

const socialIcons = {
  whatsapp: IoLogoWhatsapp,
  instagram: FaInstagram,
  facebook: FaFacebook,
  youtube: FaYoutube,
};

const renderSocialIcon = (social: SocialLink) => {
  const Icon = socialIcons[social.platform];
  return <Icon size={24} color="#a15f40" />;
};

export async function FooterTwo() {
  const settings = await getSiteSettings();
  const footer = settings.footer;
  const logoSource: string | StaticImageData = footer.logo?.url || logo;
  const emecLogoSource: string | StaticImageData = footer.emecLogo?.url || eMec;
  const emecQrSource: string | StaticImageData = footer.emecQrCode?.url || qrCode;

  return (
    <>
      <div className={styles.container}>
        {/* <div className={styles.farvalleContainer}>
          <Link href="/">
            <Image
              src={logoSource}
              className={styles.logo}
              alt={footer.logo?.alt || "Logo Farvalle"}
              width={ 150}
              height={80}
            />
          </Link>
          <PrismicRichText
            field={footer.description}
            components={{
              paragraph: ({ children }) => <span>{children}</span>,
            }}
          />
        </div> */}
        <div className={styles.addressContainer}>
          <Image
              src={logoSource}
              className={styles.logo}
              alt={footer.logo?.alt || "Logo Farvalle"}
              width={ 150}
              height={24}
            />
          <strong>Endereço</strong>
          <span>{footer.address}</span>
          <div>
            <span className={styles.email}>{footer.email}</span>
          </div>
          <strong>{footer.phone}</strong>
        </div>
        <div className={styles.linksContainer}>
          <strong>Links</strong>
          <div className={styles.links}>
            {footer.links.map((link) => (
              <Link href={link.href} target={link.target} key={link.label}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className={styles.socialContainer}>
          <strong>Redes Sociais</strong>
          <div className={styles.iconsContainer}>
            {footer.socialLinks.map((social) => (
              <Link
                href={social.href}
                target={social.target}
                className={styles.iconCircle}
                key={social.platform}
                aria-label={social.platform}
              >
                {renderSocialIcon(social)}
              </Link>
            ))}
          </div>
          <div className={styles.cadastroInstitucional}>
            <div className={styles.eMec}>
              <strong>{footer.emecText}</strong>
              <Image
                src={emecLogoSource}
                width={150}
                height={50}
                alt={footer.emecLogo?.alt || "e-MEC logo"}
              />
            </div>
            <Link className={styles.qrContainer} href={footer.emecLink} target="_blank">
              <Image
                src={emecQrSource}
                width={100}
                height={100}
                alt={footer.emecQrCode?.alt || "QR Code e-MEC"}
              />
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.bottomContainer}>
        <span>{footer.copyright}</span>
        <div className={styles.developer}>
          <span>{footer.developerText}</span>
        </div>
      </div>
    </>
  );
}
