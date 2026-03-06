"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  createdAt: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async (q = "") => {
    setLoading(true);
    const res = await fetch(`/api/patients?search=${encodeURIComponent(q)}`);
    const data = await res.json();
    setPatients(data);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPatients(search);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Өвчтөний жагсаалт</h1>
        <Link
          href="/patients/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          + Шинэ өвчтөн
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Нэр, утасны дугаараар хайх..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            type="submit"
            className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Хайх
          </button>
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Ачааллаж байна...</div>
        ) : patients.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Өвчтөн олдсонгүй</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Нэр</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Утас</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Имэйл</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Бүртгэсэн</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {p.lastName} {p.firstName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{p.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{p.email || "-"}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(p.createdAt).toLocaleDateString("mn-MN")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/patients/${p.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Дэлгэрэнгүй
                    </Link>
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
