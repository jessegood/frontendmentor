import { Component, Switch, Match, Show, createSignal } from "solid-js";
import { CommentsEntity, RepliesEntity } from "./CommentData";
import { PlusMinusButton } from "./PlusMinusButton";
import { ReplyButton } from "./ReplyButton";
import { CommentAvatar } from "./CommentAvatar";
import styles from "./Comment.module.css";
import { DeleteEditButtons } from "./DeleteEditButtons";
import { useCurrentUser } from "./Store/CurrentUserProvider";

type CommentProps = (CommentsEntity | RepliesEntity) & {
  onClick: (content: string | undefined) => void;
};

export const Comment: Component<CommentProps> = (props) => {
  const [store] = useCurrentUser();
  let text: HTMLTextAreaElement | undefined;

  const user = () => props.user;
  const [isEditMode, setEditMode] = createSignal(false);

  const handleUpdate = () => {
    props.onClick(text?.value);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const isCurrentUser = () =>
    props.user?.username === store.currentUser?.username;

  return (
    <div class={styles.wrapper}>
      <div class={styles.avatar}>
        <CommentAvatar
          username={user()?.username || ""}
          image={user()?.image.png || ""}
          createdAt={props.createdAt}
          isCurrentUser={isCurrentUser()}
        />
      </div>
      <div class={styles.content}>
        <Switch>
          <Match when={"replies" in props}>
            <p class={styles.comment}>{props.content}</p>
          </Match>
          <Match when={"replyingTo" in props}>
            <Switch>
              <Match when={isEditMode()}>
                <textarea ref={text} class={styles.editText} rows="4">
                  <Show when={(props as RepliesEntity).replyingTo !== ""}>
                    @{(props as RepliesEntity).replyingTo}
                  </Show>
                  {props.content}
                </textarea>
              </Match>
              <Match when={!isEditMode()}>
                <p class={styles.comment}>
                  <Show when={(props as RepliesEntity).replyingTo !== ""}>
                    <span class={styles.replyingTo}>
                      @{(props as RepliesEntity).replyingTo}
                    </span>
                  </Show>
                  {props.content}
                </p>
              </Match>
            </Switch>
          </Match>
        </Switch>
      </div>
      <div class={styles.score}>
        <PlusMinusButton
          score={props.score}
          id={props.id}
          isCurrentUser={isCurrentUser()}
          scoreState={props.scoreState}
        />
      </div>
      <div class={styles.reply}>
        <Switch>
          <Match when={isEditMode()}>
            <div class={styles.editGroup}>
              <button class={styles.cancelBtn} onClick={handleCancelEdit}>
                Cancel
              </button>
              <button class={styles.updateBtn} onClick={handleUpdate}>
                Update
              </button>
            </div>
          </Match>
          <Match when={!isEditMode()}>
            <Switch>
              <Match when={!isCurrentUser()}>
                <ReplyButton
                  onClick={() => (props as RepliesEntity).onReply(props.id)}
                />
              </Match>
              <Match when={isCurrentUser()}>
                <DeleteEditButtons
                  onDelete={() => (props as RepliesEntity).onCancel(props.id)}
                  onEdit={handleEdit}
                />
              </Match>
            </Switch>
          </Match>
        </Switch>
      </div>
    </div>
  );
};
