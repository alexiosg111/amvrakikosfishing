import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut } from "next-auth/react";
import { User, Calendar, Settings, LogOut, Fish } from "lucide-react";

interface DashboardPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: DashboardPageProps): Promise<Metadata> {
  const t = await import(`../../../../messages/${locale}.json`);
  return {
    title: `${t.default.navigation.home} - ${t.default.auth.login.title}`,
    description: "Your personal dashboard",
  };
}

function DashboardContent() {
  const { data: session } = useSession();
  const t = useTranslations("auth");
  const tNav = useTranslations("navigation");
  const tBooking = useTranslations("booking");
  const locale = useLocale();

  const handleLogout = async () => {
    await signOut({ callbackUrl: `/${locale}` });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {session?.user?.name || session?.user?.email}!
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your bookings and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Account Details
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{session?.user?.name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{session?.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium capitalize">{session?.user?.role?.toLowerCase()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookings Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                My Bookings
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View and manage your fishing trip bookings
              </p>
              <Button variant="outline" className="w-full">
                View Bookings
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Quick Actions
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Change Password
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Book New Trip CTA */}
        <Card className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Fish className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-white">Book Your Next Adventure</CardTitle>
                <CardDescription className="text-blue-100">
                  Ready for another unforgettable fishing trip?
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              onClick={() => window.location.href = `/${locale}/booking`}
            >
              {tNav.bookNow}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage({ params: { locale } }: DashboardPageProps) {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
