import "../../styles/common/table.css";

const DataTable = ({
                       columns = [],
                       data = [],
                       actions,
                   }) => {

    return (

        <div className="data-table-container">

            <table className="data-table">

                <thead>

                <tr>

                    {

                        columns.map((column) => (

                            <th key={column.key}>

                                {column.label}

                            </th>

                        ))

                    }

                    {

                        actions &&

                        <th>

                            Actions

                        </th>

                    }

                </tr>

                </thead>

                <tbody>

                {

                    data.length === 0 ?

                        (

                            <tr>

                                <td
                                    colSpan={
                                        columns.length +
                                        (actions ? 1 : 0)
                                    }
                                    className="table-empty"
                                >

                                    No data available.

                                </td>

                            </tr>

                        )

                        :

                        (

                            data.map((row) => (

                                <tr key={row.id}>

                                    {

                                        columns.map((column) => (

                                            <td key={column.key}>

                                                {

                                                    column.render ?

                                                        column.render(row)

                                                        :

                                                        row[column.key]

                                                }

                                            </td>

                                        ))

                                    }

                                    {

                                        actions &&

                                        <td>

                                            {

                                                actions(row)

                                            }

                                        </td>

                                    }

                                </tr>

                            ))

                        )

                }

                </tbody>

            </table>

        </div>

    );

};

export default DataTable;