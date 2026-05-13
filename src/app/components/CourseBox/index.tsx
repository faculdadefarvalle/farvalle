import Image from 'next/image'
import styles from './styles.module.scss'
import Link from 'next/link'

interface CouseBoxProps{
    course: string,
    modality: string,
    total_semestre: string,
    image_url: string,
    image_alt?: string,
    url: string
}

export function CourseBox({course, modality, total_semestre, image_url, image_alt, url}: CouseBoxProps){
    return (
        <div className={styles.courseBox}>
                        <div className={styles.flexBoxContainer}>
                            <div className={styles.textDiv}>
                                <div className={styles.courseAndModel}>
                                    <h3>{course}</h3>
                                    <div className={styles.presencial}>
                                        <span>{modality}</span>
                                    </div>
                                </div>
                                <span>{total_semestre} semestres</span>
                            </div>
                            <Image className={styles.courseImage} src={image_url} alt={image_alt || course} width={120} height={120}/>
                        </div>
                        <Link href={url} className={styles.buttonMore}>SAIBA MAIS</Link>
                    </div>
    )
}
