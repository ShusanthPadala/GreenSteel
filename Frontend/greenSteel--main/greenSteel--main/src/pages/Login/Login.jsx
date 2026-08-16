import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import authService from "../../services/authService";
import { useState } from "react";
import {
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiArrowRight,
    FiShield,
    FiActivity,
    FiTrendingUp,
    FiCheckCircle,
} from "react-icons/fi";
import { MdFactory } from "react-icons/md";

import "../../styles/login.css";

export default function Login() {
    const navigate = useNavigate();

    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await authService.login(email, password);

            if (response.success) {

                login(response.data);

                navigate("/dashboard");

            } else {

                alert(response.message);

            }

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Invalid email or password"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <main className="login-page">

            <div className="bg-grid"></div>

            <div className="bg-orb orb-left"></div>

            <div className="bg-orb orb-right"></div>

            <img
                src="/industry.png"
                alt=""
                className="industry-bg"
            />

            <div className="login-layout">

                {/* LEFT */}

                <section className="hero">

                    <div className="brand">

                        <div className="brand-icon">

                            <MdFactory/>

                        </div>

                        <div>

                            <h1>

                                <span>Green</span>Steel

                            </h1>

                            <p>

                                Environmental Monitoring System

                            </p>

                        </div>

                    </div>

                    <div className="hero-chip">

                        AI Powered Sustainability Platform

                    </div>

                    <h2>

    <span className="line1">
        Sustainable Steel.
    </span>

                        <br/>

                        <span className="line2">
        Intelligent Decisions.
    </span>

                    </h2>
                    <p className="hero-text">

                        GreenSteel enables industries to monitor emissions,
                        analyze ESG performance, and improve operational
                        efficiency through one intelligent platform.

                    </p>

                    <div className="hero-features">

                        <div className="hero-feature">

                            <FiActivity/>

                            <div>

                                <h4>

                                    Real-Time Monitoring

                                </h4>

                                <p>

                                    Live emission tracking

                                </p>

                            </div>

                        </div>

                        <div className="hero-feature">

                            <FiTrendingUp/>

                            <div>

                                <h4>

                                    ESG Intelligence

                                </h4>

                                <p>

                                    Smart sustainability insights

                                </p>

                            </div>

                        </div>

                        <div className="hero-feature">

                            <FiCheckCircle/>

                            <div>

                                <h4>

                                    AI Recommendations

                                </h4>

                                <p>

                                    Predictive decision support

                                </p>

                            </div>

                        </div>

                    </div>

                </section>

                {/* RIGHT */}

                <section className="login-side">

                    <div className="login-card">

                        <div className="card-light"></div>

                        <div className="login-header">

                            <h2>

                                Welcome Back 

                            </h2>

                            <p>

                                Sign in to access your GreenSteel dashboard.

                            </p>

                        </div>

                        <form
                            className="login-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="input-group">

                                <FiMail className="input-icon"/>

                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                    required
                                />

                            </div>

                            <div className="input-group">

                                <FiLock className="input-icon"/>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e)=>setPassword(e.target.value)}
                                    required
                                />

                                <button
                                    type="button"
                                    className="eye-btn"
                                    onClick={()=>
                                        setShowPassword(!showPassword)
                                    }
                                >

                                    {

                                        showPassword
                                            ? <FiEyeOff/>
                                            : <FiEye/>

                                    }

                                </button>

                            </div>

                            <div className="options">

                                <label>

                                    <input type="checkbox"/>

                                    Remember me

                                </label>

                                <button
                                    type="button"
                                    className="forgot-btn"
                                >

                                    Forgot Password?

                                </button>

                            </div>

                            <button
                                className="login-btn"
                                type="submit"
                                disabled={loading}
                            >

                                {

                                    loading

                                        ?

                                        "Signing In..."

                                        :

                                        <>

                                            Sign In

                                            <FiArrowRight/>

                                        </>

                                }

                            </button>

                            <div className="divider">

                                <span>

                                    Secure Enterprise Login

                                </span>

                            </div>

                            <div className="login-footer">

                                <FiShield/>

                                Protected by JWT Authentication

                            </div>

                        </form>

                    </div>

                </section>

            </div>

        </main>

    );

}