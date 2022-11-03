import { Component, Show } from "solid-js";
import { Comment } from "./Comment";
import { CommentsEntity, RepliesEntity } from "./CommentData";
import { CommentReply } from "./CommentReply";
import { useCurrentUser } from "./Store/CurrentUserProvider";

type CommentCardProps = CommentsEntity | RepliesEntity;

export const CommentCard: Component<CommentCardProps> = (props) => {
  const [store, actions] = useCurrentUser();
  const comment = () => props;

  const processContent = (content: string) => {
    const reply = content.match(/@[a-z0-9_-]+/i);
    const replyingTo = reply ? reply[0] : "";
    const commentContent = content.replace(replyingTo, "");

    return [replyingTo.slice(1), commentContent];
  };

  const handleCommentUpdate = (content: string | undefined) => {
    if (content) {
      const [replyingTo, commentContent] = processContent(content);

      if ("replyingTo" in comment()) {
        actions.updateReply({
          ...(comment() as RepliesEntity),
          content: commentContent,
          createdAt: "today",
          replyingTo: replyingTo,
        });
      } else {
        actions.updateComment(props.id, {
          ...(comment() as RepliesEntity),
          content: commentContent,
          createdAt: "today",
        });
      }
    }
  };

  return (
    <div class="card">
      <Show
        when={comment().createdAt !== ""}
        fallback={
          <CommentReply
            {...(comment() as RepliesEntity)}
            onClick={handleCommentUpdate}
          />
        }
      >
        <Comment {...comment()} onClick={handleCommentUpdate} />
      </Show>
    </div>
  );
};
