import "../../styles/common/dialog.css";

const ConfirmDialog = ({
                           open,
                           title,
                           message,
                           onCancel,
                           onConfirm,
                       }) => {

    if (!open) return null;

    return (

        <div className="dialog-overlay">

            <div className="dialog-box">

                <h2>{title}</h2>

                <p>{message}</p>

                <div className="dialog-buttons">

                    <button
                        className="secondary-btn"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        className="danger-btn"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>

    );

};

export default ConfirmDialog;