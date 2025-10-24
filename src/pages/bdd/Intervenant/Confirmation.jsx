import { useEffect } from "react";

const Confirmation = ({
  isOpen = false,
  title = "Confirmer la suppression",
  message = "Voulez-vous vraiment supprimer cet élément ?",
  onConfirm,
  onClose,
  confirmLabel = "Supprimer",
  cancelLabel = "Annuler",
  loading = false,
  destructive = true,
}) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="modal d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={onClose}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="confirm-title">
                {title}
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
                disabled={loading}
              />
            </div>

            <div className="modal-body">
              <p className="mb-0">{message}</p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                {cancelLabel}
              </button>

              <button
                type="button"
                className={destructive ? "btn btn-danger" : "btn btn-primary"}
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    {confirmLabel}
                  </>
                ) : (
                  confirmLabel
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop show" onClick={onClose} />
    </>
  );
};

export default Confirmation;
