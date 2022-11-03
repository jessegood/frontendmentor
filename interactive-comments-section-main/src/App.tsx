import { Component, For, Suspense } from "solid-js";
import { CommentAdd } from "./CommentAdd";
import { CommentThread } from "./CommentThread";
import { useCurrentUser } from "./Store/CurrentUserProvider";
import styles from "./App.module.css";

const App: Component = () => {
  const [store, actions] = useCurrentUser();

  const addComment = (content: string | undefined) => {
    if (content) {
      actions.addComment({
        id: store.newId,
        content,
        createdAt: "today",
        score: 0,
        user: store.currentUser,
        replies: null,
      });
    }
  };

  const deleteComment = (id: number) => {
    actions.deleteComment(id);
  };

  const resetComments = () => {
    actions.resetComments();
  };

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <button class={styles.resetBtn} onClick={resetComments}>
          Reset
        </button>
        <For each={store.comments}>
          {(comment, i) => (
            <CommentThread comment={comment} onDelete={deleteComment} />
          )}
        </For>
        <CommentAdd user={store.currentUser} onAdd={addComment} />
      </Suspense>
    </>
  );
};

export default App;
