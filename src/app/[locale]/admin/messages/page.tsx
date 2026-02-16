'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getContactMessages, updateContactMessageStatus } from '@/actions/admin';
import { ContactMessage } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Mail, Eye, CheckCircle, Loader2, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminMessagesPage() {
  const { locale } = useParams();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setIsLoading(true);
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMarkAsRead(id: string) {
    try {
      await updateContactMessageStatus(id, 'read');
      toast.success('Message marked as read');
      await loadMessages();
      setSelectedMessage(null);
    } catch (error) {
      toast.error('Failed to update message');
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === 'unread') {
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          <Clock className="w-3 h-3 mr-1" />
          Unread
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700">
        <CheckCircle className="w-3 h-3 mr-1" />
        Read
      </Badge>
    );
  };

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

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
          <h1 className="text-3xl font-bold text-slate-900">Contact Messages</h1>
          <p className="text-slate-600 mt-1">
            {unreadCount > 0 ? (
              <span className="text-amber-600 font-medium">{unreadCount} unread messages</span>
            ) : (
              'No new messages'
            )}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message Preview</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                    No messages yet
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((message) => (
                  <TableRow
                    key={message.id}
                    className={message.status === 'unread' ? 'bg-amber-50/50' : ''}
                  >
                    <TableCell>{getStatusBadge(message.status)}</TableCell>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell className="max-w-xs truncate">{message.message}</TableCell>
                    <TableCell>{formatDate(new Date(message.createdAt))}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMessage(message)}
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

      {/* Message Details Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Message
            </DialogTitle>
            <DialogDescription>
              Received on {selectedMessage && formatDate(new Date(selectedMessage.createdAt))}
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">From</label>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedMessage.status)}</div>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-500">Email</label>
                <p className="text-slate-700">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </p>
              </div>

              {selectedMessage.phone && (
                <div>
                  <label className="text-sm text-slate-500">Phone</label>
                  <p className="text-slate-700">{selectedMessage.phone}</p>
                </div>
              )}

              <div>
                <label className="text-sm text-slate-500">Message</label>
                <div className="bg-slate-50 p-4 rounded-lg mt-1">
                  <p className="text-slate-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedMessage(null)}
                  className="flex-1"
                >
                  Close
                </Button>
                {selectedMessage.status === 'unread' && (
                  <Button
                    onClick={() => handleMarkAsRead(selectedMessage.id)}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Read
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={() => window.open(`mailto:${selectedMessage.email}`)}
                  className="flex-1"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Reply
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
