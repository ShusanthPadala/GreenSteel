import "../../styles/DashboardKPICard.css";

const DashboardKPICard = ({
                              icon,
                              title,
                              value,
                              unit,
                              trend,
                              trendType,
                          }) => {

    return (

        <div className="dashboard-kpi-card">

            <div className="dashboard-kpi-card-header">

                <div className="dashboard-kpi-card-icon">

                    {icon}

                </div>

                <span
                    className={
                        trendType === "positive"
                            ? "dashboard-kpi-card-trend dashboard-kpi-card-trend-positive"
                            : "dashboard-kpi-card-trend dashboard-kpi-card-trend-negative"
                    }
                >

                    {trend}

                </span>

            </div>

            <p className="dashboard-kpi-card-title">

                {title}

            </p>

            <h2 className="dashboard-kpi-card-value">

                {value}

                <span>

                    {unit}

                </span>

            </h2>

        </div>

    );

};

export default DashboardKPICard;