import { GeneralSettings } from "@/components/admin/GeneralSettings";
import { BookingSettings } from "@/components/admin/BookingSettings";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Configure your site settings</p>
      </div>

      <GeneralSettings />
      <BookingSettings />
    </div>
  );
}
