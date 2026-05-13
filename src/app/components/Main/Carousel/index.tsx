import Image, { StaticImageData } from "next/image";
import styles from "./style.module.scss";
import banner from "../../../../../public/farvalle-banner.jpg";

type CarouselProps = {
  image?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
};

export function Carousel({ image }: CarouselProps) {
  const source: string | StaticImageData = image?.url || banner;

  return (
    <div className={styles.carouselItem}>
      <Image
        src={source}
        className={`d-block w-100 ${styles.carouselImage}`}
        alt={image?.alt || "Banner Farvalle"}
        quality={100}
        width={image?.width || 1920}
        height={image?.height || 500}
        priority
      />
    </div>
  );
}
