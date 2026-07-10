import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import api from "../../services/api";

export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {

        setError("");

        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }

        try {

            setLoading(true);

            const response = await api.post("/auth/login", {

                email,
                password

            });

            const data = response.data;

            localStorage.setItem("token", data.token);

localStorage.setItem(
    "user",
    JSON.stringify(data)
);

            navigate("/dashboard");

        }

        catch (err) {

            console.error(err);

            if (err.response) {

                setError(
                    err.response.data.message ||
                    "Invalid email or password."
                );

            } else {

                setError(
                    "Unable to connect to the server."
                );

            }

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="login-container">

            {/* LEFT PANEL */}

            <div className="login-left">

                <div className="brand">

                    <FaLeaf className="brand-icon"/>

                    <h1>GreenSteel</h1>

                </div>

                <h2>
                    AI-Powered Steel Plant
                    Environmental Monitoring
                </h2>

                <p>

                    Integrated platform for
                    CO₂, SOx, NOx, PM,
                    ESG and Sustainability
                    Monitoring.

                </p>

                <div className="features">

                    <div>✓ Carbon Analytics</div>

                    <div>✓ ESG Dashboard</div>

                    <div>✓ Emission Monitoring</div>

                    <div>✓ Smart Alerts</div>

                </div>

            </div>

            {/* RIGHT PANEL */}

            <div className="login-right">

                <div className="login-card">

                    <h2>Welcome Back</h2>

                    <p>

                        Login using your
                        GreenSteel account

                    </p>

                    <input

                        type="email"

                        placeholder="Email"

                        value={email}

                        onChange={(e) =>
                            setEmail(e.target.value)
                        }

                    />

                    <input

                        type="password"

                        placeholder="Password"

                        value={password}

                        onChange={(e) =>
                            setPassword(e.target.value)
                        }

                    />

                    {

                        error &&

                        <p
                            style={{
                                color: "red",
                                marginTop: "10px",
                                marginBottom: "0px",
                                fontSize: "14px"
                            }}
                        >

                            {error}

                        </p>

                    }

                    <button

                        onClick={handleLogin}

                        disabled={loading}

                    >

                        {

                            loading

                                ? "Signing In..."

                                : "Sign In"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}