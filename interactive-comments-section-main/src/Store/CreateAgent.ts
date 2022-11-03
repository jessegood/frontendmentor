import { CommentData, CommentsEntity, RepliesEntity } from "../CommentData";

const URL = import.meta.env.VITE_SERVER_URL;

export const createAgent = () => {
  const send = async <T>(
    method: string,
    slug: string,
    data?: T
  ): Promise<CommentData> => {
    console.log(`${URL}/${slug}`);

    const options: RequestInit = {
      method: method,
      mode: "cors",
    };

    if (data !== undefined) {
      options.body = JSON.stringify(data);
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    return (await fetch(`${URL}/${slug}`, options)).json();
  };

  return {
    getComments: async () => await send("get", "comments"),
    resetComments: async () => await send("get", "reset"),
    addComment: async (comment: CommentsEntity) =>
      await send("post", "comments", comment),
    deleteComment: async (id: number) => {
      await send("delete", `comments/${id}`);
    },
    updateReplies: async (id: number, replies: RepliesEntity[]) => {
      await send("post", "replies", { id, replies });
    },
    updateComment: async (id: number, comment: CommentsEntity) => {
      await send("post", `comments/${id}`, { id, comment });
    },
  };
};
