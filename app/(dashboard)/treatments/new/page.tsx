"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Patient { id: string; firstName: string; lastName: string; }
interface Doctor { id: string; name: string; }

const treatmentTypes = [
  "Үзлэг",
  "Ломбо тавих",
  "Шүд авах",
  "Шүдний цэвэрлэгээ",
  "Суурь эмчилгээ",
  "Титэм",
  "Гүүр",
  "Implant",
  "Ортодонт",
  "Бусад",
];

export default function NewTreatmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    type: "",
    toothNumber: "",
    description: "",
    cost: "",
  });

  useEffect(() => {
    fetch("/api/patients").then((r) => r.json()).then(setPatients);
    fetch("/api/users?role=DOCTOR").then((r) => r.json()).then(setDoctors).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/treatments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/treatments");
    } else {
      alert("Алдаа гарлаа");
      setLoading(false);
    }
  };

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/treatments" className="text-gray-400 hover:text-gray-600">
          &larr;
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Шинэ эмчилгээ бүртгэх</h1>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Эмчилгээний төрөл *</label>
            <select
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            >
              <option value="">Сонгох</option>
              {treatmentTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Шүдний дугаар</label>
            <input
              type="text"
              value={form.toothNumber}
              onChange={(e) => update("toothNumber", e.target.value)}
              placeholder="жнь: 11, 21, 36"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Үнэ (₮) *</label>
            <input
              type="number"
              value={form.cost}
              onChange={(e) => update("cost", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Тайлбар</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
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
            href="/treatments"
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium"
          >
            Цуцлах
          </Link>
        </div>
      </form>
    </div>
  );
}
