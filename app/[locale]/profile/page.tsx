import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/profile/ProfileForm";
import ShareProfile from "@/components/profile/ShareProfile";
import Link from "next/link";
import { Bookmark, MessageSquare } from "lucide-react";

export const metadata = {
  title: "My Profile",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-4xl p-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-600">Manage your personal information and preferences.</p>
        </div>
        <ShareProfile username={user.name} />
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col items-center">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <h2 className="text-xl font-semibold text-slate-800">{user.name || "User"}</h2>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
            
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <Link
                href="/profile/bookmarks"
                className="flex items-center gap-3 rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-600"
              >
                <Bookmark className="h-5 w-5" />
                My Bookmarks
              </Link>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">Profile Details</h3>
            <ProfileForm user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
