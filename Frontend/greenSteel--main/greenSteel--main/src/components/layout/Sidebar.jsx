import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MdFactory, MdLogout } from "react-icons/md";

import { sidebarMenu } from "../../constants/sidebarMenu";
import { useAuth } from "../../contexts/AuthContext";

import "../../styles/sidebar.css";

const Sidebar = () => {

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {

        logout();

        navigate("/");

    };

    const getInitials = () => {

        if (!user) return "GS";

        const first = user.firstName?.charAt(0) || "";

        const last = user.lastName?.charAt(0) || "";

        return `${first}${last}`.toUpperCase();

    };

    return (

        <aside className="sidebar">

            <div className="sidebar-top">

                <motion.div
                    className="sidebar-brand"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >

                    <div className="sidebar-brand-icon">
                        <MdFactory />
                    </div>

                    <div className="sidebar-brand-text">

                        <h2>GreenSteel</h2>

                        <span>Environmental Monitoring</span>

                    </div>

                </motion.div>

            </div>

            <div className="sidebar-menu">

                {

                    sidebarMenu.map((section) => (

                        <div
                            key={section.section}
                            className="menu-section"
                        >

                            <p className="menu-title">

                                {section.section}

                            </p>

                            {

                                section.items.map((item) => {

                                    const Icon = item.icon;

                                    return (

                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            className={({ isActive }) =>
                                                isActive
                                                    ? "menu-item active"
                                                    : "menu-item"
                                            }
                                        >

                                            <Icon />

                                            <span>

                                                {item.title}

                                            </span>

                                        </NavLink>

                                    );

                                })

                            }

                        </div>

                    ))

                }

            </div>

            <div className="sidebar-footer">

                <div className="sidebar-user">

                    <div className="sidebar-avatar">

                        {getInitials()}

                    </div>

                    <div>

                        <h4>

                            {

                                user

                                    ? `${user.firstName} ${user.lastName}`

                                    : "Guest"

                            }

                        </h4>

                        <span>

                            {

                                user?.department || "No Department"

                            }

                        </span>

                    </div>

                </div>

                <button
                    className="sidebar-logout"
                    onClick={handleLogout}
                >

                    <MdLogout />

                    Logout

                </button>

            </div>

        </aside>

    );

};

export default Sidebar;