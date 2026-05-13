import Image, { StaticImageData } from "next/image";
import { PrismicRichText } from "@prismicio/react";
import { Carousel } from "./Carousel";
import styles from "./style.module.scss";
import predioFarvalle from "../../../../public/predio.webp";
import { CourseBox } from "../CourseBox";
import { BlogMain } from "../BlogMain";
import { getHomeContent } from "../../lib/prismic-content";

export async function Main() {
  const content = await getHomeContent();
  const buildingImage: string | StaticImageData =
    content.buildingImage?.url || predioFarvalle;

  return (
    <>
      <Carousel image={content.banner} />
      <div className={styles.container}>
        <div className={styles.textContainer}>
          {content.introSections.map((section) => (
            <div className={styles.paragraphContainer} key={section.title}>
              <h3>{section.title}</h3>
              <PrismicRichText
                field={section.content}
                components={{
                  paragraph: ({ children }) => <p>{children}</p>,
                }}
              />
            </div>
          ))}
          <Image
            className={styles.imgPredio}
            src={buildingImage}
            alt={content.buildingImage?.alt || "Prédio da Farvalle"}
            width={content.buildingImage?.width || 1080}
            height={content.buildingImage?.height || 1920}
          />
        </div>
        <div className={styles.coursesContainer}>
          <div className={styles.courseBoxContainer}>
            {content.courses.map((course) => (
              <CourseBox
                key={course.id}
                course={course.title}
                image_url={course.imageUrl}
                image_alt={course.imageAlt}
                modality={course.modality}
                total_semestre={course.semesters}
                url={course.url}
              />
            ))}
          </div>
        </div>
        <BlogMain title={content.latestPostsTitle} />
      </div>
    </>
  );
}
