import { FiBell, FiSearch, FiMenu } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

import "../../styles/navbar.css";

const Navbar = () => {

    const { user } = useAuth();

    const greeting = () => {

        const hour = new Date().getHours();

        if (hour < 12) return "Good Morning";

        if (hour < 17) return "Good Afternoon";

        return "Good Evening";

    };

    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (

        <header className="navbar">

            <div className="navbar-left">

                <button className="menu-btn">

                    <FiMenu />

                </button>

                <div className="greeting">

                    <h2>

                        {greeting()}, {user?.firstName} 👋

                    </h2>

                    <p>{today}</p>

                </div>

            </div>

            <div className="navbar-right">

                <button className="nav-icon">

                    <FiSearch />

                </button>

                <button className="nav-icon">

                    <FiBell />

                </button>

                <div className="profile-box">

                    <div className="profile-avatar">

                        {user?.firstName?.charAt(0)}

                        {user?.lastName?.charAt(0)}

                    </div>

                    <div className="profile-info">

                        <h4>

                            {user?.firstName} {user?.lastName}

                        </h4>

                        <span>

        {user?.department}

    </span>

                    </div>

                </div>

            </div>

        </header>

    );

};

export default Navbar;