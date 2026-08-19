import styles from "./style.module.scss";
import { PostContainer } from "./PostContainer";
import { getClient } from "../../services/prismic";

type BlogMainProps = {
  title?: string;
};

export async function BlogMain({ title = "Últimas Novidades" }: BlogMainProps) {
  const client = getClient();
  const response = await client.getAllByType("posts", {
    pageSize: 5,
    limit: 5,
    orderings: {
      field: "document.first_publication_date",
      direction: "desc",
    },
  });
  const posts = response;

  return (
    <div className={styles.container}>
      <h1>{title}</h1>
      <div className={styles.postsContainer}>
        {posts &&
          posts?.map((index) => {
            return (
              <PostContainer
                key={index.id}
                postTitle={`${index.data.title}`}
                postText={`${index.data.content[0]?.type === "paragraph" ? index.data.content[0]?.text : ""} ${index.data.content[1]?.type === "paragraph" ? index.data.content[1]?.text : ""} ${index.data.content[2]?.type === "paragraph" ? index.data.content[2]?.text : ""}`}
                image_url={`${index.data.image.url}`}
                uid={index.uid}
              />
            );
          })}
      </div>
    </div>
  );
}
