import { Component, Show } from "solid-js";
import styles from "./CommentAvatar.module.css";

interface CommentAvatar {
  username: string;
  image: string;
  createdAt: string;
  isCurrentUser: boolean;
}

export const CommentAvatar: Component<CommentAvatar> = (props) => {
  return (
    <div class={styles.avatar}>
      <img src={props.image} width="35px" height="35px" />
      <p class={styles.username}>{props.username}</p>
      <Show when={props.isCurrentUser}>
        <span class={styles.youMark}>you</span>
      </Show>
      <p class={styles.createdAt}>{props.createdAt}</p>
    </div>
  );
};
