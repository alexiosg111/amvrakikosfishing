'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getAllBookings, confirmBooking, cancelBooking } from '@/actions/admin';
import { Booking } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, CheckCircle, XCircle, Eye, Loader2, CreditCard } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminBookingsPage() {
  const { locale } = useParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = bookings.filter(
        (booking) =>
          booking.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.trip?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookings);
    }
  }, [searchQuery, bookings]);

  async function loadBookings() {
    setIsLoading(true);
    try {
      const data = await getAllBookings();
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConfirm(id: string) {
    setIsUpdating(true);
    try {
      await confirmBooking(id);
      toast.success('Booking confirmed successfully');
      await loadBookings();
      setSelectedBooking(null);
    } catch (error) {
      toast.error('Failed to confirm booking');
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleCancel(id: string) {
    setIsUpdating(true);
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled successfully');
      await loadBookings();
      setSelectedBooking(null);
    } catch (error) {
      toast.error('Failed to cancel booking');
    } finally {
      setIsUpdating(false);
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
      PENDING: { variant: 'secondary' },
      CONFIRMED: { variant: 'default', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
      PAID: { variant: 'default', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
      CANCELLED: { variant: 'destructive' },
      COMPLETED: { variant: 'outline' },
    };
    const config = variants[status] || { variant: 'secondary' };
    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bookings</h1>
          <p className="text-slate-600 mt-1">Manage all your fishing trip bookings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name, email, trip, or booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Trip</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-slate-500 py-8">
                    {searchQuery ? 'No bookings found' : 'No bookings yet'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-sm">
                      #{booking.id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.contactName}</p>
                        <p className="text-sm text-slate-500">{booking.contactEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>{booking.trip?.name}</TableCell>
                    <TableCell>{formatDate(new Date(booking.date))}</TableCell>
                    <TableCell>{booking.participants}</TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(booking.totalPrice)}
                    </TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Booking #{selectedBooking?.id.slice(-8).toUpperCase()}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">Customer</label>
                  <p className="font-medium">{selectedBooking.contactName}</p>
                  <p className="text-sm text-slate-600">{selectedBooking.contactEmail}</p>
                  <p className="text-sm text-slate-600">{selectedBooking.contactPhone}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">Trip</label>
                  <p className="font-medium">{selectedBooking.trip?.name}</p>
                  <p className="text-sm text-slate-600">
                    {formatDate(new Date(selectedBooking.date))}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Participants</label>
                  <p className="font-medium">{selectedBooking.participants} people</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-500">Total Amount</label>
                <p className="text-2xl font-bold text-blue-600">
                  {formatPrice(selectedBooking.totalPrice)}
                </p>
              </div>

              {selectedBooking.notes && (
                <div>
                  <label className="text-sm text-slate-500">Notes</label>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-lg mt-1">
                    {selectedBooking.notes}
                  </p>
                </div>
              )}

              {selectedBooking.bookingAddOns && selectedBooking.bookingAddOns.length > 0 && (
                <div>
                  <label className="text-sm text-slate-500">Add-ons</label>
                  <ul className="mt-1 space-y-1">
                    {selectedBooking.bookingAddOns.map((addon) => (
                      <li key={addon.id} className="text-sm text-slate-600">
                        {addon.addOn?.name} x {addon.quantity} - {formatPrice(addon.price * addon.quantity)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <DialogFooter className="gap-2">
                {selectedBooking.status === 'PENDING' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleCancel(selectedBooking.id)}
                      disabled={isUpdating}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Booking
                    </Button>
                    <Button
                      onClick={() => handleConfirm(selectedBooking.id)}
                      disabled={isUpdating}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirm Booking
                    </Button>
                  </>
                )}
                {selectedBooking.status === 'CONFIRMED' && (
                  <Button
                    variant="outline"
                    onClick={() => handleCancel(selectedBooking.id)}
                    disabled={isUpdating}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Booking
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
