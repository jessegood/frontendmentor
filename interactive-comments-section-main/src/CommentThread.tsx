import { Component, createSignal, For, Show } from "solid-js";
import { CommentCard } from "./CommentCard";
import { CommentsEntity, RepliesEntity, ScoreState } from "./CommentData";
import styles from "./CommentThread.module.css";
import { useCurrentUser } from "./Store/CurrentUserProvider";

interface CommentThreadProps {
  comment: CommentsEntity;
  onDelete: (id: number) => void;
}

export const CommentThread: Component<CommentThreadProps> = (props) => {
  const [store, actions] = useCurrentUser();
  const replies = () => props.comment.replies;

  const handleCancel = (id: number) => {
    if (props.comment.id === id) {
      props.onDelete(id);
    } else {
      const filter = replies()?.filter((r) => r.id !== id) || [];
      actions.updateReplies(props.comment.id, filter);
    }
  };

  const handleReply = (id: number) => {
    const repliesArray = replies();
    let rep = [] as RepliesEntity[];
    if (!repliesArray || repliesArray.length == 0 || repliesArray[0].id > id) {
      rep = [
        {
          id: store.newId,
          content: "",
          createdAt: "",
          user: store.currentUser,
          onReply: handleReply,
          onCancel: handleCancel,
          score: 0,
          replyingTo: "",
          scoreState: "none" as ScoreState,
        },
        ...(replies() || []),
      ];
    } else {
      const index = repliesArray.findIndex((r) => r.id === id) + 1;
      const before = repliesArray.slice(0, index);
      const after = repliesArray.slice(index);
      rep = [
        ...before,
        {
          id: store.newId,
          content: "",
          createdAt: "",
          user: store.currentUser,
          onReply: handleReply,
          onCancel: handleCancel,
          score: 0,
          replyingTo: "",
          scoreState: "none" as ScoreState,
        },
        ...after,
      ];
    }

    actions.updateReplies(props.comment.id, rep);
  };

  return (
    <>
      <CommentCard
        {...props.comment}
        onReply={handleReply}
        onCancel={handleCancel}
      />
      <div class={styles.replies}>
        <Show when={replies()}>
          <For each={replies()}>
            {(reply, i) => (
              <CommentCard
                {...reply}
                onReply={handleReply}
                onCancel={handleCancel}
              />
            )}
          </For>
        </Show>
      </div>
    </>
  );
};
