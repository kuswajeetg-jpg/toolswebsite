import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Smart Document Tools",
  description: "Privacy Policy - We respect your privacy. All tools process files locally in your browser.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}