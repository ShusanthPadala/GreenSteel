import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaLeaf,
    FaEnvelope,
    FaLock,
    FaArrowRight,
} from "react-icons/fa";
import api from "../../services/api";
import "./Login.css";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");

        if (!email || !password) {
            setError("Enter email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data));

            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to login."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="background-grid"></div>

            <div className="login-card">

                <div className="logo-circle">
                    <FaLeaf />
                </div>

                <h1>GreenSteel</h1>

                <p className="subtitle">
                    AI Powered Environmental Monitoring System
                </p>

                <div className="input-box">

                    <FaEnvelope />

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                </div>

                <div className="input-box">

                    <FaLock />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                </div>

                {error && (
                    <p className="error">{error}</p>
                )}

                <button
                    className="login-btn"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        "Signing In..."
                    ) : (
                        <>
                            Sign In
                            <FaArrowRight />
                        </>
                    )}
                </button>

                <div className="status">

                    <div className="status-card">
                        <span className="dot green"></span>
                        Blast Furnace
                        <strong>Healthy</strong>
                    </div>

                    <div className="status-card">
                        <span className="dot blue"></span>
                        ESG Score
                        <strong>89</strong>
                    </div>

                    <div className="status-card">
                        <span className="dot orange"></span>
                        CO₂ Emission
                        <strong>71%</strong>
                    </div>

                </div>
            </div>
        </div>
    );
}