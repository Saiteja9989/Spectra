import React from "react";
import { Trophy, AlertTriangle } from "lucide-react";

const gradeColor = (grade, darkMode) => {
  if (!grade || grade === "N/A") return darkMode ? "text-gray-500" : "text-gray-400";
  const g = grade.toUpperCase();
  if (g === "O" || g === "A+") return "text-emerald-500";
  if (g === "A" || g === "B+") return "text-blue-500";
  if (g === "B" || g === "C") return "text-amber-500";
  if (g === "F" || g === "AB") return "text-red-500";
  return darkMode ? "text-gray-300" : "text-gray-700";
};

const ExternalResultComponent = ({ resultData, totalBacklogs, darkMode }) => {
  if (!resultData || resultData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          No result data available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Backlog status */}
      {totalBacklogs !== null && (
        <div className={`rounded-2xl border p-4 flex items-center justify-between ${
          totalBacklogs > 0
            ? darkMode ? "bg-red-500/10 border-red-500/20" : "bg-red-50 border-red-100"
            : darkMode ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-100"
        }`}>
          <div className="flex items-center gap-3">
            {totalBacklogs > 0
              ? <AlertTriangle className="w-5 h-5 text-red-500" />
              : <Trophy className="w-5 h-5 text-emerald-500" />
            }
            <div>
              <p className={`text-xs font-semibold ${totalBacklogs > 0 ? "text-red-600" : "text-emerald-600"}`}>
                Backlog Status
              </p>
              <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {totalBacklogs > 0
                  ? `${totalBacklogs} subject(s) need to be cleared`
                  : "No backlogs — great job!"}
              </p>
            </div>
          </div>
          <span className={`text-2xl font-bold ${totalBacklogs > 0 ? "text-red-500" : "text-emerald-500"}`}>
            {totalBacklogs}
          </span>
        </div>
      )}

      {/* Semester results */}
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
              Year {semester.year} &middot; Semester {semester.semester}
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
                            : col === "Subject Name"
                            ? `font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`
                            : col === "Grade"
                            ? `font-bold ${gradeColor(row[col], darkMode)}`
                            : col === "Grade Points"
                            ? `font-semibold ${darkMode ? "text-indigo-400" : "text-indigo-600"}`
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

          {/* Footer */}
          <div className={`px-4 py-3 border-t flex items-center justify-between gap-4 ${darkMode ? "bg-gray-800/50 border-white/5" : "bg-gray-50 border-gray-100"}`}>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>SGPA</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${darkMode ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`}>
                {semester.sgpa}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Credits</span>
              <span className={`text-xs font-bold ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{semester.creditsAcquired}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExternalResultComponent;
