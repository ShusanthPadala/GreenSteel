import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { canAccessPage } from "../utils/permissions";
import { sidebarMenu } from "../constants/sidebarMenu";

const titleFor = (page) => sidebarMenu.flatMap((s) => s.items).find((i) => i.path === `/${page}`)?.title || "that page";

// Sends users to the dashboard when their role cannot open this page
// (e.g. an engineer typing /users into the address bar).
const RoleRoute = ({ page, children }) => {
    const { user } = useAuth();

    if (!canAccessPage(user, page)) {
        return <Navigate to="/dashboard" replace state={{ denied: titleFor(page) }} />;
    }

    return children;
};

export default RoleRoute;
