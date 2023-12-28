import React, { useEffect } from "react";
import ReactDOM from "react-dom";

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  action?: string;
};

function Modal({ onClose, children, title, action }: ModalProps) {
  const handleCloseClick = () => {
    onClose();
  };

  useEffect(() => {
    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const modalContent = (
    <div className="modal-overlay">
      <div className="modal-wrapper">
        <div className="modal">
          <div className="modal-header">
            {title && <h1>{title}</h1>}
            <div
              role="button"
              onClick={handleCloseClick}
              className="flex h-8 w-8 items-center justify-center rounded-full border bg-blue-400 text-white hover:bg-blue-600"
            >
              {action ?? "✗"}
            </div>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("modal-root")!,
  );
}

export default Modal;
