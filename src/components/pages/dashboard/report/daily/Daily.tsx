"use client";

import { useState } from "react";
import { dailyReports } from "./reports";

type PeriodType = "single" | "multiple";

function Daily() {
  const [selectedReport, setSelectedReport] = useState("");
  const [periodType, setPeriodType] = useState<PeriodType>("single");
  const [generating, setGenerating] = useState(false);

  const [singleDate, setSingleDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const selectedReportData = dailyReports.find(
    (report) => report.id === selectedReport,
  );

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);

      if (!selectedReport) {
        alert("Silakan pilih report terlebih dahulu");
        return;
      }

      if (periodType === "single" && !singleDate) {
        alert("Silakan pilih tanggal");
        return;
      }

      if (periodType === "multiple" && (!startDate || !endDate)) {
        alert("Silakan pilih periode tanggal");
        return;
      }

      if (periodType === "multiple" && startDate > endDate) {
        alert("Tanggal mulai tidak boleh lebih besar dari tanggal akhir");
        return;
      }

      let body;

      if (periodType === "single") {
        body = {
          periodType: "single",
          singleDate,
        };
      } else {
        body = {
          periodType: "multiple",
          startDate,
          endDate,
        };
      }

      console.log("Request:", body);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/rptdaily/${selectedReport}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal generate report");
      }

      const blob = await response.blob();

      const contentDisposition = response.headers.get("Content-Disposition");

      let fileName = "report.xlsx";

      if (contentDisposition) {
        const match = contentDisposition.match(
          /filename\*=UTF-8''([^;]+)|filename="([^"]+)"/,
        );

        if (match) {
          fileName = decodeURIComponent(match[1] || match[2]);
        }
      }

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Generate report error:", error);

      alert(error instanceof Error ? error.message : "Gagal generate report");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen rounded-2xl bg-slate-100 p-4 dark:bg-gray-950 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Daily Report
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Pilih report dan periode yang ingin ditampilkan
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LIST REPORT */}
          <div className="rounded-xl border bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-700 dark:text-gray-200">
              List Report
            </h3>

            <div className="space-y-2 max-h-100 overflow-y-auto pr-2">
              {dailyReports.map((report) => {
                const isSelected = selectedReport === report.id;

                return (
                  <label
                    key={report.id}
                    className={`
                      flex cursor-pointer items-center gap-3
                      rounded-lg border p-3
                      transition
                      ${
                        isSelected
                          ? "border-gray-400 bg-gray-100 dark:border-gray-600 dark:bg-gray-800"
                          : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="report"
                      value={report.id}
                      checked={isSelected}
                      onChange={() => setSelectedReport(report.id)}
                      className="h-4 w-4"
                    />

                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {report.name}
                      </p>

                      {report.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {report.description}
                        </p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* PARAMETER */}
          <div className="lg:col-span-2 max-h-100">
            <div className="rounded-xl border bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-5 text-sm font-semibold uppercase text-gray-700 dark:text-gray-200">
                Report Parameter
              </h3>

              {!selectedReportData ? (
                <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Silakan pilih report terlebih dahulu
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* SELECTED REPORT */}
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Report
                    </p>

                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedReportData.name}
                    </p>
                  </div>

                  {/* PERIOD TYPE */}
                  <div>
                    <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                      Periode
                    </p>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="periodType"
                          value="single"
                          checked={periodType === "single"}
                          onChange={() => setPeriodType("single")}
                        />

                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Satu tanggal
                        </span>
                      </label>

                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="periodType"
                          value="multiple"
                          checked={periodType === "multiple"}
                          onChange={() => setPeriodType("multiple")}
                        />

                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Lebih dari satu tanggal
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* SINGLE DATE */}
                  {periodType === "single" && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Tanggal
                      </label>

                      <input
                        type="date"
                        value={singleDate}
                        onChange={(e) => setSingleDate(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  )}

                  {/* MULTIPLE DATE */}
                  {periodType === "multiple" && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Dari tanggal
                        </label>

                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Sampai tanggal
                        </label>

                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* BUTTON */}
                  <div className="flex justify-end border-t pt-5 dark:border-gray-800">
                    <button
                      type="button"
                      onClick={handleGenerateReport}
                      disabled={generating}
                      className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 dark:disabled:opacity-50"
                    >
                      {generating ? "Generating..." : "Generate Report"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Daily;
