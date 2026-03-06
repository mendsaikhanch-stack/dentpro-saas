"use client";

import { useEffect, useState, useRef } from "react";
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

interface UploadedPhoto {
  url: string;
  preview: string;
  name: string;
}

export default function NewTreatmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleUploadPhotos = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        alert("Зөвхөн JPG, PNG, WebP формат зөвшөөрнө");
        continue;
      }
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) continue;
      const { url } = await res.json();
      setPhotos((prev) => [...prev, { url, preview: URL.createObjectURL(file), name: file.name }]);
    }
    setUploading(false);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/treatments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const treatment = await res.json();

      // Зургуудыг эмчилгээтэй холбох
      if (photos.length > 0 && form.patientId) {
        await Promise.all(
          photos.map((photo) =>
            fetch("/api/photos", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                url: photo.url,
                patientId: form.patientId,
                treatmentId: treatment.id,
              }),
            })
          )
        );
      }

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

        {/* Зураг хавсаргах */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Зураг хавсаргах</label>
          <div className="flex items-center gap-3 mb-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-sm border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              {uploading ? "Оруулж байна..." : "Зураг сонгох"}
            </button>
            <span className="text-xs text-gray-400">JPG, PNG, WebP</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => e.target.files && handleUploadPhotos(e.target.files)}
            className="hidden"
          />
          {photos.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {photos.map((photo, i) => (
                <div key={i} className="relative group">
                  <img
                    src={photo.preview}
                    alt={photo.name}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
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
