"use client";

import { useCallback, useEffect, useState } from "react";

type SalesData = {
  regularAmount: string;
  regularUnit: string;
  targetAmount: string;
  targetUnit: string;
  achieve: string;
};

type WhatsappStatus = "connected" | "disconnected" | "checking";

function PpdSales() {
  const [data, setData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [whatsappStatus, setWhatsappStatus] =
    useState<WhatsappStatus>("checking");

  const [whatsappQr, setWhatsappQr] = useState<string | null>(null);

  const [sending, setSending] = useState(false);

  const getData = useCallback(async () => {
    try {
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ppdsales`,
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data");
      }

      const result = await response.json();

      console.log(result);

      const row = result.data[0];

      setData({
        regularAmount: row[1],
        regularUnit: row[2],
        targetAmount: row[4],
        targetUnit: row[5],
        achieve: row[7],
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error(error);
      setError("Gagal mengambil data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Get current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Initial load
  useEffect(() => {
    getData();
  }, [getData]);

  // Automatic refresh setiap 5 menit
  useEffect(() => {
    const interval = setInterval(
      () => {
        getData();
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [getData]);

  // Check status WhatsApp
  const checkWhatsappStatus = useCallback(async () => {
    try {
      setWhatsappStatus("checking");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/whatsapp/status`,
      );

      if (!response.ok) {
        throw new Error("WhatsApp tidak terhubung");
      }

      const result = await response.json();

      console.log("WhatsApp status:", result);

      setWhatsappStatus(result.connected ? "connected" : "disconnected");
      setWhatsappQr(result.qr ?? null);
    } catch (error) {
      console.error(error);
      setWhatsappStatus("disconnected");
      setWhatsappQr(null);
    }
  }, []);

  // Check WhatsApp saat halaman dibuka
  useEffect(() => {
    checkWhatsappStatus();

    const interval = setInterval(
      () => {
        checkWhatsappStatus();
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [checkWhatsappStatus]);

  // Manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await getData();
  };

  // Manual WhatsApp blast
  const handleSendWhatsapp = async () => {
    try {
      setSending(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/whatsapp/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "ppdsales",
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Gagal mengirim WhatsApp");
      }

      const result = await response.json();

      console.log(result);

      alert("Pesan WhatsApp berhasil dikirim");
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim pesan WhatsApp");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen rounded-2xl bg-slate-100 p-4 md:p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Booking Sales
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">
              Data booking sales hingga saat ini
            </p>

            <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-400">
              {currentTime.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
              {" • "}
              {currentTime.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
              {" WIB"}
            </p>

            {/* Last Updated */}
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
              Last Updated:{" "}
              {lastUpdated
                ? lastUpdated.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  }) + " WIB"
                : "Belum tersedia"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* WhatsApp Status */}
            <div className="flex items-center gap-2 rounded-lg bg-white dark:bg-slate-50 px-4 py-2.5 shadow-sm ring-1 ring-gray-200">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  whatsappStatus === "connected"
                    ? "bg-green-500"
                    : whatsappStatus === "checking"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              />

              <span className="text-sm font-medium text-gray-700">
                {whatsappStatus === "connected"
                  ? "WhatsApp Connected"
                  : whatsappStatus === "checking"
                    ? "Checking WhatsApp..."
                    : "WhatsApp Disconnected"}
              </span>

              {whatsappStatus !== "connected" && whatsappQr && (
                <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Connect WhatsApp
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Scan QR Code menggunakan WhatsApp di HP Anda
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <img
                      src={whatsappQr}
                      alt="WhatsApp QR Code"
                      className="h-64 w-64"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="rounded-lg cursor-pointer bg-white dark:bg-slate-100 dark:hover:bg-slate-300 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            {/* Send WhatsApp */}
            <button
              type="button"
              onClick={handleSendWhatsapp}
              disabled={sending || whatsappStatus !== "connected"}
              className="rounded-lg cursor-pointer bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send WhatsApp"}
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* REGULER */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-slate-50">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500 md:text-base">
                Reguler
              </h2>

              <div className="rounded-lg bg-blue-50 px-3 py-2 text-blue-600 dark:bg-blue-100">
                REG
              </div>
            </div>

            <p className="text-xl font-bold text-gray-900">
              {data?.regularAmount}
            </p>

            <p className="mt-2 text-sm font-medium text-gray-500 md:text-base">
              {data?.regularUnit}
            </p>
          </div>

          {/* TARGET */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-slate-50">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500 md:text-base">
                Target
              </h2>

              <div className="rounded-lg bg-purple-50 px-3 py-2 text-purple-600 dark:bg-purple-200">
                TGT
              </div>
            </div>

            <p className="text-xl font-bold text-gray-900">
              {data?.targetAmount}
            </p>

            <p className="mt-2 text-sm font-medium text-gray-500 md:text-base">
              {data?.targetUnit}
            </p>
          </div>

          {/* ACHIEVE */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-slate-50 md:col-span-2 lg:col-span-1">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500 md:text-base">
                Achieve
              </h2>

              <div className="rounded-lg bg-green-50 px-3 py-2 text-green-600 dark:bg-green-200">
                %
              </div>
            </div>

            <p className="text-xl font-bold text-gray-900">{data?.achieve}</p>

            <p className="mt-2 text-sm font-medium text-gray-500 md:text-base">
              Achievement terhadap target
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PpdSales;
