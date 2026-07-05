import { useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";

export default function Login() {

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/dashboard");
    };

    return (

        <div className="login-container">

            {/* LEFT PANEL */}

            <div className="login-left">

                <div className="brand">

                    <FaLeaf className="brand-icon" />

                    <h1>
                        GreenSteel
                    </h1>

                </div>

                <h2>
                    AI-Powered Steel Plant
                    Environmental Monitoring
                </h2>

                <p>
                    Integrated platform for
                    CO₂, SOx, NOx, PM,
                    ESG and sustainability
                    monitoring.
                </p>

                <div className="features">

                    <div>
                        ✓ Carbon Analytics
                    </div>

                    <div>
                        ✓ ESG Dashboard
                    </div>

                    <div>
                        ✓ AI Prediction
                    </div>

                    <div>
                        ✓ Voice Assistant
                    </div>

                </div>

            </div>

            {/* RIGHT PANEL */}

            <div className="login-right">

                <div className="login-card">

                    <h2>
                        Welcome Back
                    </h2>

                    <p>
                        Sign in to continue
                    </p>

                    <input
                        type="email"
                        placeholder="Email"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                    />

                    <button
                        onClick={handleLogin}
                    >
                        Sign In
                    </button>

                </div>

            </div>

        </div>

    );

}