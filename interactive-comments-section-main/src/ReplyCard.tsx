import { Component } from "solid-js";
import { UserOrCurrentUser } from "./CommentData";

export const ReplyCard: Component<UserOrCurrentUser> = (props) => {
  return (
    <div class="card">
      <img src={props.image.webp} width="35px" height="35px" />
      <textarea></textarea>
      <button>Reply</button>
    </div>
  );
};
