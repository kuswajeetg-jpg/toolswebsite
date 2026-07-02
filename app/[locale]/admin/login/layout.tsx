import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login - Smart Document Tools",
  description: "Admin login page",
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}