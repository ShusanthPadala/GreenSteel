import { useEffect, useMemo, useState } from "react";

import {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from "../../services/departmentService";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import DataTable from "../../components/tables/DataTable";
import Pagination from "../../components/tables/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import FormModal from "../../components/forms/FormModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";

import { useAuth } from "../../contexts/AuthContext";
import { hasPermission } from "../../utils/permissions";

import "./department.css";

const Departments = () => {

    const { user } = useAuth();

    const [departments, setDepartments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);

    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);

    const [deleteId, setDeleteId] = useState(null);

    const rowsPerPage = 8;

    const departmentFields = [

        {
            name: "departmentName",
            label: "Department Name",
            required: true,
        },

        {
            name: "departmentCode",
            label: "Department Code",
            required: true,
        },

        {
            name: "description",
            label: "Description",
        },

        {
            name: "active",
            label: "Active",
            type: "checkbox",
            defaultValue: true,
        },

    ];

    const loadDepartments = async () => {

        try {

            setLoading(true);

            const data = await getDepartments();

            setDepartments(data);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadDepartments();

    }, []);

    const filteredDepartments = useMemo(() => {

        return departments.filter((department) =>

            department.departmentName
                .toLowerCase()
                .includes(search.toLowerCase())

            ||

            department.departmentCode
                .toLowerCase()
                .includes(search.toLowerCase())

        );

    }, [departments, search]);

    const totalPages = Math.ceil(

        filteredDepartments.length / rowsPerPage

    );

    const paginatedDepartments = filteredDepartments.slice(

        (currentPage - 1) * rowsPerPage,

        currentPage * rowsPerPage

    );

    const columns = [

        {

            key: "departmentName",

            label: "Department",

        },

        {

            key: "departmentCode",

            label: "Code",

        },

        {

            key: "description",

            label: "Description",

        },

        {

            key: "active",

            label: "Status",

            render: (row) => (

                <StatusBadge

                    status={

                        row.active

                            ? "Active"

                            : "Inactive"

                    }

                />

            ),

        },

    ];
    const handleDelete = (id) => {

        setDeleteId(id);

        setConfirmOpen(true);

    };

    const confirmDelete = async () => {

        try {

            await deleteDepartment(deleteId);

            await loadDepartments();

            setConfirmOpen(false);

            setDeleteId(null);

            setCurrentPage(1);

        }

        catch (error) {

            console.error(error);

        }

    };

    const handleAdd = () => {

        setSelectedDepartment(null);

        setModalOpen(true);

    };

    const handleEdit = (department) => {

        setSelectedDepartment(department);

        setModalOpen(true);

    };

    const handleSave = async (department) => {

        try {

            if (selectedDepartment) {

                await updateDepartment(

                    selectedDepartment.id,

                    department

                );

            }

            else {

                await createDepartment(department);

            }

            await loadDepartments();

            setSelectedDepartment(null);

            setModalOpen(false);

            setCurrentPage(1);

        }

        catch (error) {

            console.error(error);

        }

    };

    if (loading) {

        return <LoadingSpinner />;

    }
    return (

        <div className="departments-page">

            <PageHeader

                title="Departments"

                subtitle="Manage plant departments"

                action={

                    hasPermission(user, "canCreate") && (

                        <button

                            className="primary-btn"

                            onClick={handleAdd}

                        >

                            Add Department

                        </button>

                    )

                }

            />

            <div className="department-toolbar">

                <SearchBar

                    value={search}

                    placeholder="Search Departments..."

                    onChange={(e) => {

                        setSearch(e.target.value);

                        setCurrentPage(1);

                    }}

                />

            </div>

            {

                paginatedDepartments.length === 0 ?

                    <EmptyState />

                    :

                    <>

                        <DataTable

                            columns={columns}

                            data={paginatedDepartments}

                            actions={(row) => (

                                <>

                                    {

                                        hasPermission(user, "canEdit") && (

                                            <button

                                                className="table-btn edit"

                                                onClick={() =>

                                                    handleEdit(row)

                                                }

                                            >

                                                Edit

                                            </button>

                                        )

                                    }

                                    {

                                        hasPermission(user, "canDelete") && (

                                            <button

                                                className="table-btn delete"

                                                onClick={() =>

                                                    handleDelete(row.id)

                                                }

                                            >

                                                Delete

                                            </button>

                                        )

                                    }

                                </>

                            )}

                        />

                        <Pagination

                            currentPage={currentPage}

                            totalPages={totalPages}

                            onPageChange={setCurrentPage}

                        />

                    </>

            }

            <FormModal

                open={modalOpen}

                title={

                    selectedDepartment

                        ? "Edit Department"

                        : "Add Department"

                }

                fields={departmentFields}

                initialData={selectedDepartment}

                onClose={() => {

                    setModalOpen(false);

                    setSelectedDepartment(null);

                }}

                onSubmit={handleSave}

            />

            <ConfirmDialog

                open={confirmOpen}

                title="Delete Department"

                message="This action cannot be undone."

                onCancel={() => {

                    setConfirmOpen(false);

                    setDeleteId(null);

                }}

                onConfirm={confirmDelete}

            />

        </div>

    );

};

export default Departments;