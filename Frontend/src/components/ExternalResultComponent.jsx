import React from "react";
import Loader from "./Loader";

const ExternalResultComponent = ({ resultData, totalBacklogs, darkMode }) => {
  if (!resultData || resultData.length === 0) {
    return  <div className="flex justify-center items-center h-32">
    <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${
      darkMode ? "border-indigo-400" : "border-indigo-600"
    }`}></div>
  </div>;
  }

  return (
    <div className="space-y-2 sm:space-y-3 md:space-y-4">
      {/* Total Backlogs */}
      {totalBacklogs !== null && (
        <div
          className={`${
            darkMode ? "bg-red-900 border-red-700" : "bg-red-50 border-red-500"
          } border-l-4 p-1 sm:p-2 md:p-3 rounded-md mb-1 sm:mb-2 md:mb-3`}
        >
          <p className={`text-[10px] sm:text-xs ${
            darkMode ? "text-red-200" : "text-red-700"
          } font-medium`}>
            Total Backlogs: {totalBacklogs}
          </p>
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