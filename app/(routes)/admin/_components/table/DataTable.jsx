import React from "react";

const DataTable = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.accessorKey} className="px-4 py-2 text-left">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.accessorKey} className="px-4 py-2">
                  {row[column.accessorKey]}{" "}
                  {/* Akses nilai berdasarkan accessorKey */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
