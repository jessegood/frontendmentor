/* @refresh reload */
import {
  createContext,
  createEffect,
  createResource,
  createSignal,
  ParentComponent,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { CommentsEntity, RepliesEntity, ScoreState } from "../CommentData";
import { createAgent } from "./CreateAgent";

const createCurrentUserStore = () => {
  const agent = createAgent();
  const [getId, setId] = createSignal(0);
  const [commentData, { mutate }] = createResource(async () => {
    return await agent.getComments();
  });

  const [commentStore, setCommentStore] = createStore<CommentsEntity[]>([]);

  createEffect(() => {
    if (commentData.state === "ready") {
      const comments = commentData().comments;
      if (comments) {
        setCommentStore(comments);
        if (comments) {
          const lastCmt = comments[comments.length - 1];
          const replies = lastCmt.replies;
          if (replies) {
            setId(replies[replies.length - 1].id);
          } else {
            setId(lastCmt.id);
          }
        }
      }
    }
  });

  const store = {
    get currentUser() {
      return commentData()?.currentUser;
    },
    get comments() {
      return commentStore;
    },
    get newId() {
      setId(getId() + 1);
      return getId();
    },
  };

  const getCommentId = (id: number) => {
    const comment = commentStore.find((c) =>
      c.replies?.some((r) => r.id === id)
    );
    if (comment) return comment.id;
    return 0;
  };

  const actions = {
    resetComments: async () => {
      mutate(await agent.resetComments());
    },
    addComment(comment: CommentsEntity) {
      setCommentStore([...commentStore, comment]);
      agent.addComment(comment);
    },
    deleteComment(id: number) {
      setCommentStore(commentStore.filter((c) => c.id !== id));
      agent.deleteComment(id);
    },
    updateReplies(id: number, replies: RepliesEntity[]) {
      setCommentStore((c) => c.id === id, "replies", replies);
      agent.updateReplies(id, replies);
    },
    updateComment(id: number, comment: CommentsEntity) {
      setCommentStore((c) => c.id === id, comment);
      agent.updateComment(id, comment);
    },
    updateReply(reply: RepliesEntity) {
      const id = getCommentId(reply.id);
      setCommentStore((c) => c.id === id, "replies", [
        ...(commentStore
          .find((c) => c.id === id)
          ?.replies?.filter((r) => r.id !== reply.id) || []),
        reply,
      ]);

      const replies = commentStore.find((c) => c.id === id)?.replies || [];
      agent.updateReplies(id, [...replies]);
    },
    updateScore(id: number, score: number, state: ScoreState) {
      const comId = getCommentId(id);
      if (comId === 0) {
        setCommentStore((c) => c.id === id, {
          score: score,
          scoreState: state,
        });
        const comment = commentStore.find((c) => c.id === id);
        if (comment) agent.updateComment(id, comment);
      } else {
        setCommentStore(
          (c) => c.id === comId,
          "replies",
          (r) => r.id === id,
          { score: score, scoreState: state }
        );

        const comment = commentStore.find((c) => c.id === comId);
        if (comment) agent.updateComment(comId, comment);
      }
    },
  };

  return [store, actions] as const;
};

const CurrentUserContext =
  createContext<ReturnType<typeof createCurrentUserStore>>();

export const CurrentUserProvider: ParentComponent = (props) => {
  return (
    <CurrentUserContext.Provider value={createCurrentUserStore()}>
      {props.children}
    </CurrentUserContext.Provider>
  );
};

export function useCurrentUser() {
  const ctx = useContext(CurrentUserContext);
  if (ctx) return ctx;
  else throw new Error("Context undefined");
}
