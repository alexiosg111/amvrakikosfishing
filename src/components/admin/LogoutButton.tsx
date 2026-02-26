import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton({ locale }: { locale: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await logout(locale);
      }}
    >
      <Button
        type="submit"
        variant="ghost"
        className="w-full justify-start text-blue-100 hover:text-white hover:bg-white/10"
      >
        <LogOut className="w-4 h-4 mr-3" />
        Sign Out
      </Button>
    </form>
  );
}
