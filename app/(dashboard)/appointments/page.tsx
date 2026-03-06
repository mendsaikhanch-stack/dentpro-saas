"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Appointment {
  id: string;
  date: string;
  time: string;
  duration: number;
  status: string;
  notes?: string;
  patient: { id: string; firstName: string; lastName: string };
  doctor: { name: string };
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async (date = "") => {
    setLoading(true);
    const url = date ? `/api/appointments?date=${date}` : "/api/appointments";
    const res = await fetch(url);
    const data = await res.json();
    setAppointments(data);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchAppointments(dateFilter);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Цаг захиалга</h1>
        <Link
          href="/appointments/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          + Шинэ цаг
        </Link>
      </div>

      <div className="mb-6 flex gap-2">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        <button
          onClick={() => fetchAppointments(dateFilter)}
          className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          Шүүх
        </button>
        {dateFilter && (
          <button
            onClick={() => { setDateFilter(""); fetchAppointments(); }}
            className="text-gray-500 px-4 py-2.5 hover:text-gray-700"
          >
            Цэвэрлэх
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Ачааллаж байна...</div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Цаг захиалга байхгүй</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Өвчтөн</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Эмч</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Огноо</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Цаг</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Төлөв</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    <Link href={`/patients/${apt.patient.id}`} className="hover:text-blue-600">
                      {apt.patient.lastName} {apt.patient.firstName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{apt.doctor.name}</td>
                  <td className="px-6 py-4 text-gray-600">{apt.date}</td>
                  <td className="px-6 py-4 text-gray-600">{apt.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      apt.status === "SCHEDULED" ? "bg-blue-100 text-blue-700" :
                      apt.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {apt.status === "SCHEDULED" ? "Товлосон" : apt.status === "COMPLETED" ? "Дууссан" : "Цуцалсан"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      {apt.status === "SCHEDULED" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(apt.id, "COMPLETED")}
                            className="text-xs text-green-600 hover:underline"
                          >
                            Дуусгах
                          </button>
                          <button
                            onClick={() => handleStatusChange(apt.id, "CANCELLED")}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Цуцлах
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
