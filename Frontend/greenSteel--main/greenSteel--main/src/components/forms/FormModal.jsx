import { useEffect, useState } from "react";

import "../../styles/common/forms.css";

const FormModal = ({
                       open,
                       title,
                       fields,
                       initialData,
                       onClose,
                       onSubmit,
                   }) => {

    const [formData, setFormData] = useState({});

    useEffect(() => {
        const timer = setTimeout(() => {
            if (initialData) {
                setFormData(initialData);
            } else {
                const emptyForm = {};
                fields.forEach((field) => {
                    emptyForm[field.name] = field.defaultValue ?? "";
                });
                setFormData(emptyForm);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [initialData, fields]);

    if (!open) {

        return null;

    }

    const handleChange = (event) => {

        const { name, value, type, checked } = event.target;

        setFormData((previous) => ({

            ...previous,

            [name]: type === "checkbox" ? checked : value,

        }));

    };

    const handleSubmit = (event) => {

        event.preventDefault();

        onSubmit(formData);

    };

    return (

        <div className="modal-overlay">

            <div className="modal-container">

                <div className="modal-header">

                    <h2>{title}</h2>

                    <button
                        className="modal-close"
                        onClick={onClose}
                    >

                        ×

                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    {

                        fields.map((field) => (

                            <div
                                key={field.name}
                                className="form-group"
                            >

                                <label>

                                    {field.label}

                                </label>

                                {

                                    field.type === "checkbox"

                                        ?

                                        <input
                                            type="checkbox"
                                            name={field.name}
                                            checked={
                                                formData[field.name] || false
                                            }
                                            onChange={handleChange}
                                        />

                                        :

                                        <input
                                            type={field.type || "text"}
                                            name={field.name}
                                            value={
                                                formData[field.name] || ""
                                            }
                                            onChange={handleChange}
                                            required={field.required}
                                        />

                                }

                            </div>

                        ))

                    }

                    <div className="modal-footer">

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={onClose}
                        >

                            Cancel

                        </button>

                        <button
                            type="submit"
                            className="primary-btn"
                        >

                            Save

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default FormModal;