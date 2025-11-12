import { useEffect } from "react";

const Confirmation = ({
  isOpen,
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
      <style>{`
        .confirm-footer { display: block; gap: 0.5rem; }
        .confirm-footer > div { margin-bottom: 0.5rem; }
        @media (min-width: 768px) {
          .confirm-footer { display: flex; flex-direction: row; justify-content: flex-end; align-items: center; gap: 0.5rem; }
          .confirm-footer > div { margin-bottom: 0; }
          .confirm-footer .w-100 { width: auto !important; }
        }
      `}</style>

      <div
        className="modal d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={onClose}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-fullscreen-md-down"
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

            {onConfirm !== undefined ? (
              <div className="modal-footer confirm-footer">
                <div>
                  <button
                    type="button"
                    className="btn btn-secondary w-100 mb-0 "
                    onClick={onClose}
                    disabled={loading}
                  >
                    {cancelLabel}
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    className={`${
                      destructive ? "btn btn-danger" : "btn btn-primary"
                    } w-100 ms-sm-2 ms-lg-0`}
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
            ) : (
              <div className="modal-footer">
                {" "}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onClose}
                >
                  Ok
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="modal-backdrop show" onClick={onClose} />
    </>
  );
};

export default Confirmation;
