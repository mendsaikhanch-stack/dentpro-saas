"use client";

import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div />
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">{session?.user?.name}</p>
          <p className="text-xs text-gray-400">
            {(session?.user as { role?: string })?.role === "ADMIN"
              ? "Админ"
              : (session?.user as { role?: string })?.role === "DOCTOR"
              ? "Эмч"
              : "Ажилтан"}
          </p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-sm text-gray-500 hover:text-red-600 transition px-3 py-1.5 rounded-lg hover:bg-red-50"
        >
          Гарах
        </button>
      </div>
    </header>
  );
}
