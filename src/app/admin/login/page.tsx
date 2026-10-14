import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Sign in · Womentor CMS" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getCurrentUser()) redirect("/admin");
  const { next } = await searchParams;
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <Image src="/images/logos/womentorIcon.svg" alt="" width={44} height={44} />
          <div>
            <p className="text-xl font-extrabold text-[#D54407] leading-tight">WOMENTOR</p>
            <p className="text-xs text-gray-500">Content Management</p>
          </div>
        </div>
        <h1 className="text-lg font-semibold text-gray-900 mb-4">Sign in</h1>
        <LoginForm next={next} />
      </div>
    </main>
  );
}
