import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Admin Dashboard - Smart Document Tools",
  description: "Admin panel to manage tools.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}