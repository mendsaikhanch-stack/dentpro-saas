"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Patient { id: string; firstName: string; lastName: string; }
interface Doctor { id: string; name: string; }

export default function NewAppointmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
    duration: 30,
    notes: "",
  });

  useEffect(() => {
    fetch("/api/patients").then((r) => r.json()).then(setPatients);
    fetch("/api/users?role=DOCTOR").then((r) => r.json()).then(setDoctors).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/appointments");
    } else {
      alert("Алдаа гарлаа");
      setLoading(false);
    }
  };

  const update = (field: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/appointments" className="text-gray-400 hover:text-gray-600">
          &larr;
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Шинэ цаг захиалга</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Өвчтөн *</label>
            <select
              value={form.patientId}
              onChange={(e) => update("patientId", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            >
              <option value="">Сонгох</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.lastName} {p.firstName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Эмч *</label>
            <select
              value={form.doctorId}
              onChange={(e) => update("doctorId", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            >
              <option value="">Сонгох</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Огноо *</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Цаг *</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => update("time", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Хугацаа (минут)</label>
            <input
              type="number"
              value={form.duration}
              onChange={(e) => update("duration", parseInt(e.target.value) || 30)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Тэмдэглэл</label>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            {loading ? "Хадгалж байна..." : "Хадгалах"}
          </button>
          <Link
            href="/appointments"
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium"
          >
            Цуцлах
          </Link>
        </div>
      </form>
    </div>
  );
}
