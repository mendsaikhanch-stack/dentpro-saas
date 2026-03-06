"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Treatment {
  id: string;
  type: string;
  toothNumber?: string;
  description?: string;
  cost: number;
  createdAt: string;
  patient: { id: string; firstName: string; lastName: string };
  doctor: { name: string };
}

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/treatments")
      .then((r) => r.json())
      .then((data) => {
        setTreatments(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Энэ эмчилгээг устгах уу?")) return;
    await fetch(`/api/treatments/${id}`, { method: "DELETE" });
    setTreatments((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Эмчилгээний бүртгэл</h1>
        <Link
          href="/treatments/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          + Шинэ эмчилгээ
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Ачааллаж байна...</div>
        ) : treatments.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Эмчилгээ байхгүй</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Өвчтөн</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Эмчилгээ</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Шүд</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Эмч</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Үнэ</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Огноо</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {treatments.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    <Link href={`/patients/${t.patient.id}`} className="hover:text-blue-600">
                      {t.patient.lastName} {t.patient.firstName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{t.type}</td>
                  <td className="px-6 py-4 text-gray-600">{t.toothNumber || "-"}</td>
                  <td className="px-6 py-4 text-gray-600">{t.doctor.name}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{t.cost.toLocaleString()}₮</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(t.createdAt).toLocaleDateString("mn-MN")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Устгах
                    </button>
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
