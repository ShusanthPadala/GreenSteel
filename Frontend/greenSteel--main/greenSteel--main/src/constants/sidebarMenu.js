import {
    MdDashboard,
    MdFactory,
    MdCo2,
    MdEco,
    MdDescription,
    MdWarningAmber,
    MdSettings,
    MdApartment,
    MdCategory,
    MdPeople,
} from "react-icons/md";

export const sidebarMenu = [
    {
        section: "Overview",
        items: [
            {
                title: "Dashboard",
                path: "/dashboard",
                icon: MdDashboard,
            },
        ],
    },
    {
        section: "Operations",
        items: [
            {
                title: "Departments",
                path: "/departments",
                icon: MdApartment,
            },
            {
                title: "Units",
                path: "/units",
                icon: MdFactory,
            },
        ],
    },
    {
        section: "Environmental",
        items: [
            {
                title: "Emission Records",
                path: "/emission-records",
                icon: MdCo2,
            },
            {
                title: "Emission Types",
                path: "/emission-types",
                icon: MdCategory,
            },
            {
                title: "ESG",
                path: "/esg",
                icon: MdEco,
            },
        ],
    },
    {
        section: "Management",
        items: [
            {
                title: "Users",
                path: "/users",
                icon: MdPeople,
                roles: ["SUPER_ADMIN"],
            },
            {
                title: "Reports",
                path: "/reports",
                icon: MdDescription,
            },
            {
                title: "Alerts",
                path: "/alerts",
                icon: MdWarningAmber,
            },
            {
                title: "Settings",
                path: "/settings",
                icon: MdSettings,
            },
        ],
    },
];