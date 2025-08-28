import React from "react";

const ExternalResultComponent = ({ resultData, totalBacklogs, darkMode }) => {
  if (!resultData || resultData.length === 0) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          No result data available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3 md:space-y-4">
      {/* Total Backlogs - Highlighted at the top */}
      {totalBacklogs !== null && (
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-4 shadow-md`}>
          <div className={`flex items-center justify-between ${darkMode ? "bg-red-900" : "bg-red-100"} p-3 rounded-lg`}>
            <div className="flex items-center">
              <span className={`text-lg font-semibold ${darkMode ? "text-red-100" : "text-red-800"}`}>
                Backlog Status:
              </span>
            </div>
            <div className={`text-xl font-bold ${darkMode ? "text-red-100" : "text-red-800"} bg-red-600 px-3 py-1 rounded-full`}>
              {totalBacklogs} {totalBacklogs === 1 ? "Backlog" : "Backlogs"}
            </div>
          </div>
          {totalBacklogs > 0 && (
            <p className={`mt-2 text-sm ${darkMode ? "text-red-200" : "text-red-600"}`}>
              You have {totalBacklogs} subject(s) that need to be cleared.
            </p>
          )}
          {totalBacklogs === 0 && (
            <p className={`mt-2 text-sm ${darkMode ? "text-green-200" : "text-green-600"}`}>
              Congratulations! You have no backlogs.
            </p>
          )}
        </div>
      )}

      {/* Semester Results */}
      {resultData.map((semester, idx) => (
        <div
          key={idx}
          className={`${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } rounded-lg border overflow-hidden`}
        >
          {/* Header */}
          <div
            className={`${
              darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
            } px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 border-b`}
          >
            <h3
              className={`text-[10px] sm:text-xs md:text-sm font-semibold ${
                darkMode ? "text-gray-200" : "text-gray-900"
              }`}
            >
              Year {semester.year}, Semester {semester.semester}
            </h3>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                <tr>
                  {semester.columns.map((column, colIdx) => (
                    <th
                      key={colIdx}
                      className={`px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-left text-[10px] sm:text-xs font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      } uppercase`}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody
                className={`${
                  darkMode ? "bg-gray-800 divide-gray-700" : "bg-white divide-gray-200"
                } divide-y`}
              >
                {semester.data.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={`${
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }`}
                  >
                    {semester.columns.map((column, colIdx) => (
                      <td
                        key={colIdx}
                        className={`px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 text-[10px] sm:text-xs ${
                          darkMode ? "text-gray-200" : "text-gray-900"
                        }`}
                      >
                        {row[column]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer (SGPA and Credits Acquired) */}
          <div
            className={`${
              darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
            } px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 border-t flex justify-between items-center`}
          >
            <div>
              <span className={`text-[10px] sm:text-xs ${
                darkMode ? "text-gray-300" : "text-gray-500"
              }`}>
                SGPA:
              </span>
              <span
                className={`ml-1 text-[10px] sm:text-xs font-medium ${
                  darkMode ? "text-green-300 bg-green-900" : "text-green-700 bg-green-100"
                } px-1 py-1 rounded`}
              >
                {semester.sgpa}
              </span>
            </div>
            <div>
              <span className={`text-[10px] sm:text-xs ${
                darkMode ? "text-gray-300" : "text-gray-500"
              }`}>
                Credits Acquired:
              </span>
              <span
                className={`ml-1 text-[10px] sm:text-xs font-medium ${
                  darkMode ? "text-gray-200" : "text-gray-900"
                }`}
              >
                {semester.creditsAcquired}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExternalResultComponent;