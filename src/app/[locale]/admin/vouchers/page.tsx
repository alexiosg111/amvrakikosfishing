'use client';

import { useState } from 'react';
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
import { Plus, Edit, Trash2 } from 'lucide-react';

// Mock data - replace with actual data fetching
const mockVouchers = [
  {
    id: '1',
    code: 'SUMMER2024',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minPurchase: 100,
    maxUses: 100,
    usedCount: 45,
    expiresAt: new Date('2024-08-31'),
    isActive: true,
  },
  {
    id: '2',
    code: 'WELCOME10',
    discountType: 'FIXED',
    discountValue: 10,
    minPurchase: 50,
    maxUses: -1,
    usedCount: 23,
    expiresAt: null,
    isActive: true,
  },
];

export default function AdminVouchersPage() {
  const [vouchers] = useState(mockVouchers);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Vouchers</h1>
          <p className="text-slate-600 mt-1">Manage discount vouchers and promotions</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Voucher
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Min. Purchase</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vouchers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                    No vouchers yet
                  </TableCell>
                </TableRow>
              ) : (
                vouchers.map((voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell className="font-mono font-medium">
                      {voucher.code}
                    </TableCell>
                    <TableCell>
                      {voucher.discountType === 'PERCENTAGE'
                        ? `${voucher.discountValue}%`
                        : `€${voucher.discountValue}`}
                    </TableCell>
                    <TableCell>€{voucher.minPurchase}</TableCell>
                    <TableCell>
                      {voucher.maxUses === -1 ? (
                        `${voucher.usedCount} / ∞`
                      ) : (
                        `${voucher.usedCount} / ${voucher.maxUses}`
                      )}
                    </TableCell>
                    <TableCell>
                      {voucher.expiresAt
                        ? voucher.expiresAt.toLocaleDateString()
                        : 'Never'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={voucher.isActive ? 'default' : 'secondary'}>
                        {voucher.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
