import "../../styles/common/statusBadge.css";

const StatusBadge = ({
                         status,
                     }) => {

    const value = String(status).toLowerCase();

    return (

        <span
            className={`status-badge ${value}`}
        >

            {status}

        </span>

    );

};

export default StatusBadge;