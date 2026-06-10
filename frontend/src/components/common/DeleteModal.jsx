const DeleteModal = ({
  show,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this item?",
}) => {

  if (!show) return null;

  return (
    <div className="delete-modal-overlay">

      <div className="delete-modal-box">

        <h4 className="fw-bold mb-3">
          {title}
        </h4>

        <p>
          {message}
        </p>

        <div className="d-flex justify-content-end gap-2 mt-4">

          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="btn btn-danger"
            onClick={onConfirm}
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
};

export default DeleteModal;