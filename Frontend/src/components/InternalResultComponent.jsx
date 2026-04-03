import React from "react";

const InternalResultComponent = ({ resultData, darkMode }) => {
  if (!resultData || resultData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          No internal result data available
        </p>
      </div>
    );
  }

  const getMarkColor = (mark) => {
    if (mark === "N/A" || mark === undefined) return darkMode ? "text-gray-500" : "text-gray-400";
    const num = parseFloat(mark);
    if (isNaN(num)) return darkMode ? "text-gray-400" : "text-gray-500";
    if (num >= 8) return "text-emerald-500";
    if (num >= 5) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-4">
      {resultData.map((semester, idx) => (
        <div
          key={idx}
          className={`rounded-2xl border overflow-hidden ${
            darkMode ? "bg-gray-900 border-white/5" : "bg-white border-gray-100"
          }`}
        >
          {/* Header */}
          <div className={`px-4 py-3 border-b ${darkMode ? "bg-gray-800/50 border-white/5" : "bg-gray-50 border-gray-100"}`}>
            <h3 className={`text-xs font-bold tracking-wide ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
              Year {semester.year} &middot; Semester {semester.semester} &middot; Internal Assessment {semester.internalType}
            </h3>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className={darkMode ? "bg-gray-800/30" : "bg-gray-50/80"}>
                  {semester.columns.map((col, i) => (
                    <th key={i} className={`px-3 py-2.5 text-left text-[10px] font-semibold tracking-wider uppercase ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {semester.data.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={`border-t transition-colors ${
                      darkMode ? "border-white/5 hover:bg-white/3" : "border-gray-50 hover:bg-gray-50/80"
                    }`}
                  >
                    {semester.columns.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className={`px-3 py-2.5 text-xs ${
                          col === "Sno"
                            ? darkMode ? "text-gray-500" : "text-gray-400"
                            : col === "Total Marks"
                            ? `font-bold ${getMarkColor(row[col])}`
                            : col === "Subject Name"
                            ? `font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`
                            : darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InternalResultComponent;
