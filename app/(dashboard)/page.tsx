import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const today = new Date().toISOString().split("T")[0];

  const [todayAppointments, totalPatients, monthTreatments, recentAppointments] =
    await Promise.all([
      prisma.appointment.count({ where: { date: today } }),
      prisma.patient.count(),
      prisma.treatment.findMany({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        select: { cost: true },
      }),
      prisma.appointment.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { patient: true, doctor: true },
      }),
    ]);

  const monthlyRevenue = monthTreatments.reduce((sum, t) => sum + t.cost, 0);

  const stats = [
    { label: "Өнөөдрийн цаг", value: todayAppointments, color: "bg-blue-500" },
    { label: "Нийт өвчтөн", value: totalPatients, color: "bg-green-500" },
    { label: "Сарын орлого", value: `${monthlyRevenue.toLocaleString()}₮`, color: "bg-purple-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Хяналтын самбар</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <span className="text-white text-xl font-bold">
                  {typeof stat.value === "number" ? stat.value : "₮"}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Сүүлийн цаг захиалгууд</h2>
        </div>
        {recentAppointments.length === 0 ? (
          <div className="p-6 text-center text-gray-400">Цаг захиалга байхгүй байна</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentAppointments.map((apt) => (
              <div key={apt.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">
                    {apt.patient.lastName} {apt.patient.firstName}
                  </p>
                  <p className="text-sm text-gray-500">Эмч: {apt.doctor.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{apt.date}</p>
                  <p className="text-sm text-gray-500">{apt.time}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    apt.status === "SCHEDULED"
                      ? "bg-blue-100 text-blue-700"
                      : apt.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {apt.status === "SCHEDULED"
                    ? "Товлосон"
                    : apt.status === "COMPLETED"
                    ? "Дууссан"
                    : "Цуцалсан"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
