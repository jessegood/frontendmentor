export interface CommentData {
  currentUser: UserOrCurrentUser;
  comments?: CommentsEntity[] | null;
}

export interface UserOrCurrentUser {
  image: Image;
  username: string;
}

export interface Image {
  png: string;
  webp: string;
}

export type ScoreState = "none" | "upvote" | "downvote";

export interface CommentsBase {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: UserOrCurrentUser | undefined;
  scoreState: ScoreState;
}

export interface CommentsEntity extends CommentsBase {
  replies?: RepliesEntity[] | null;
}

export interface RepliesEntity extends CommentsBase {
  replyingTo: string;
  onReply: (id: number) => void;
  onCancel: (id: number) => void;
}
