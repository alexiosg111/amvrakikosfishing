'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Save, Mail, CreditCard, Bell } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your application settings</p>
      </div>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Settings
          </CardTitle>
          <CardDescription>
            Configure email notifications and templates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromEmail">From Email</Label>
              <Input
                id="fromEmail"
                placeholder="bookings@amvrakikosfishing.com"
                defaultValue="bookings@amvrakikosfishing.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input
                id="adminEmail"
                placeholder="admin@amvrakikosfishing.com"
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-base">Booking Confirmations</Label>
              <p className="text-sm text-slate-500">Send email when a new booking is created</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-base">Payment Receipts</Label>
              <p className="text-sm text-slate-500">Send receipt after successful payment</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-base">Trip Reminders</Label>
              <p className="text-sm text-slate-500">Send reminder email 24 hours before trip</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Settings
          </CardTitle>
          <CardDescription>
            Configure Stripe payment integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input id="currency" value="EUR" disabled />
            <p className="text-sm text-slate-500">Currency is set to Euro (EUR)</p>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-base">Test Mode</Label>
              <p className="text-sm text-slate-500">Use Stripe test environment</p>
            </div>
            <Switch />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              value={`${process.env.NEXT_PUBLIC_APP_URL}/api/webhook`}
              readOnly
            />
            <p className="text-sm text-slate-500">
              Use this URL in your Stripe dashboard to receive payment events
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure admin notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-base">New Booking Alerts</Label>
              <p className="text-sm text-slate-500">Get notified when a new booking is made</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-base">New Contact Messages</Label>
              <p className="text-sm text-slate-500">Get notified for new contact form submissions</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-base">Daily Summary</Label>
              <p className="text-sm text-slate-500">Receive daily summary of activities</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
