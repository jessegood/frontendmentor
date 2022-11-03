import { Accessor, Component, createSignal } from "solid-js";
import styles from "./Modal.module.css";

interface ModalProps {
  show: Accessor<boolean>;
  onClick: (result: boolean) => void;
}

export const Modal: Component<ModalProps> = (props) => {
  return (
    <>
      <div class={styles.modal} classList={{ [styles.show]: props.show() }}>
        <div class={styles.modalContent}>
          <h3>Delete comment</h3>
          <p>
            Are you sure your want to delete this comment? This will remove the
            comment and can't be undone.
          </p>
          <button class={styles.cancelBtn} onClick={() => props.onClick(false)}>
            No, cancel
          </button>
          <button class={styles.deleteBtn} onClick={() => props.onClick(true)}>
            Yes, delete
          </button>
        </div>
      </div>
    </>
  );
};
