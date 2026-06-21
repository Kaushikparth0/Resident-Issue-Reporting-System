import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Building2, MessageSquare, ShieldCheck, UserCheck } from "lucide-react";

export default async function Home() {
  const session = await getSession();

  if (session) {
    if (session.user.role === "admin") {
      redirect("/admin");
    } else {
      redirect("/resident");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Resident Issue</span>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/login" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Better Communities Through <br />
              <span className="text-blue-600">Transparent Communication</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Report issues, track resolutions, and keep your community safe and well-maintained. 
              A streamlined platform for residents and administrators.
            </p>
            <div className="mt-10 flex justify-center gap-6">
              <Link 
                href="/register" 
                className="px-8 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 md:text-lg"
              >
                Get Started
              </Link>
              <Link 
                href="/login" 
                className="px-8 py-3 text-base font-medium text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 md:text-lg"
              >
                View Dashboard
              </Link>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 text-blue-600 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Reporting</h3>
              <p className="text-gray-500">Quickly report maintenance, security, or amenity issues with just a few clicks.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 text-blue-600 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-gray-500">Stay informed about the progress of your reported issues from start to finish.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 text-blue-600 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Admin Dashboard</h3>
              <p className="text-gray-500">Powerful tools for community managers to categorize, assign, and resolve issues efficiently.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>&copy; 2026 CommunityIssue Reporting System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
