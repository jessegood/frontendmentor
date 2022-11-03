import { Component } from "solid-js";
import { UserOrCurrentUser } from "./CommentData";
import styles from "./CommentAdd.module.css";

interface CommentAddProps {
  onAdd: (content: string | undefined) => void;
  user: UserOrCurrentUser | undefined;
}

export const CommentAdd: Component<CommentAddProps> = (props) => {
  let text: HTMLTextAreaElement | undefined;

  const handleSend = (content: string | undefined) => {
    if (text && content) {
      props.onAdd(content);
      text.value = "";
    }
  };

  return (
    <div class="card">
      <div class={styles.addComment}>
        <textarea
          placeholder="Add a comment..."
          ref={text}
          class={styles.commentText}
          rows="4"
        ></textarea>
        <img
          class={styles.image}
          src={props.user?.image.png}
          width="35px"
          height="35px"
        />
        <button class={styles.sendBtn} onClick={() => handleSend(text?.value)}>
          Send
        </button>
      </div>
    </div>
  );
};
