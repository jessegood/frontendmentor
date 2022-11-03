import { Component } from "solid-js";
import { RepliesEntity } from "./CommentData";
import styles from "./CommentReply.module.css";

interface CommentReplyProps extends RepliesEntity {
  onClick: (content: string | undefined) => void;
}

export const CommentReply: Component<CommentReplyProps> = (props) => {
  let text: HTMLTextAreaElement | undefined;

  return (
    <div class={styles.reply}>
      <img
        class={styles.image}
        src={props.user?.image.png}
        width="35px"
        height="35px"
      />
      <textarea ref={text} class={styles.replyText} rows="4"></textarea>
      <div class={styles.btnGroup}>
        <button
          class={styles.replyBtn}
          onClick={() => props.onClick(text?.value)}
        >
          Reply
        </button>
        <button
          class={styles.cancelBtn}
          onClick={() => props.onCancel(props.id)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
