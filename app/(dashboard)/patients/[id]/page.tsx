"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Treatment {
  id: string;
  type: string;
  toothNumber?: string;
  description?: string;
  cost: number;
  createdAt: string;
  doctor: { name: string };
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  doctor: { name: string };
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  treatments: Treatment[];
  appointments: Appointment[];
}

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/patients/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setPatient(data);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Энэ өвчтөнийг устгах уу?")) return;
    await fetch(`/api/patients/${id}`, { method: "DELETE" });
    router.push("/patients");
  };

  if (loading) return <div className="text-gray-400 p-8">Ачааллаж байна...</div>;
  if (!patient) return <div className="text-gray-400 p-8">Өвчтөн олдсонгүй</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/patients" className="text-gray-400 hover:text-gray-600">
            &larr;
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {patient.lastName} {patient.firstName}
          </h1>
        </div>
        <button
          onClick={handleDelete}
          className="text-sm text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50"
        >
          Устгах
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Хувийн мэдээлэл</h2>
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-500">Утас:</span> <span className="text-gray-800 ml-2">{patient.phone}</span></div>
            <div><span className="text-gray-500">Имэйл:</span> <span className="text-gray-800 ml-2">{patient.email || "-"}</span></div>
            <div><span className="text-gray-500">Төрсөн:</span> <span className="text-gray-800 ml-2">{patient.birthDate || "-"}</span></div>
            <div><span className="text-gray-500">Хүйс:</span> <span className="text-gray-800 ml-2">{patient.gender === "male" ? "Эрэгтэй" : patient.gender === "female" ? "Эмэгтэй" : "-"}</span></div>
            <div><span className="text-gray-500">Хаяг:</span> <span className="text-gray-800 ml-2">{patient.address || "-"}</span></div>
            {patient.notes && <div><span className="text-gray-500">Тэмдэглэл:</span> <span className="text-gray-800 ml-2">{patient.notes}</span></div>}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Цаг захиалгууд</h2>
            </div>
            {patient.appointments.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">Цаг захиалга байхгүй</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {patient.appointments.map((apt) => (
                  <div key={apt.id} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{apt.date} {apt.time}</p>
                      <p className="text-xs text-gray-500">Эмч: {apt.doctor.name}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      apt.status === "SCHEDULED" ? "bg-blue-100 text-blue-700" :
                      apt.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {apt.status === "SCHEDULED" ? "Товлосон" : apt.status === "COMPLETED" ? "Дууссан" : "Цуцалсан"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Эмчилгээний түүх</h2>
            </div>
            {patient.treatments.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">Эмчилгээ байхгүй</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {patient.treatments.map((t) => (
                  <div key={t.id} className="px-6 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{t.type}</p>
                        <p className="text-xs text-gray-500">
                          {t.toothNumber && `Шүд: ${t.toothNumber} | `}
                          Эмч: {t.doctor.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800">{t.cost.toLocaleString()}₮</p>
                        <p className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleDateString("mn-MN")}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
