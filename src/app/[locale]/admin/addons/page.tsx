'use client';

import { useState, useEffect } from 'react';
import { getAddOns } from '@/actions/bookings';
import { AddOn } from '@/types';
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
import { Plus, Edit, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminAddOnsPage() {
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAddOns();
  }, []);

  async function loadAddOns() {
    setIsLoading(true);
    try {
      const data = await getAddOns();
      setAddOns(data);
    } catch (error) {
      toast.error('Failed to load add-ons');
    } finally {
      setIsLoading(false);
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      FOOD: 'bg-orange-100 text-orange-800',
      TRANSPORT: 'bg-blue-100 text-blue-800',
      EQUIPMENT: 'bg-green-100 text-green-800',
      PHOTO: 'bg-purple-100 text-purple-800',
      PREMIUM: 'bg-amber-100 text-amber-800',
      GENERAL: 'bg-slate-100 text-slate-800',
    };
    return colors[category] || colors.GENERAL;
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
          <h1 className="text-3xl font-bold text-slate-900">Add-ons</h1>
          <p className="text-slate-600 mt-1">Manage trip add-ons and extras</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Add-on
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addOns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                    No add-ons yet
                  </TableCell>
                </TableRow>
              ) : (
                addOns.map((addon) => (
                  <TableRow key={addon.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{addon.name}</p>
                        <p className="text-sm text-slate-500 truncate max-w-xs">
                          {addon.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(addon.category)}>
                        {addon.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatPrice(addon.price)}</TableCell>
                    <TableCell>
                      <Badge variant={addon.isActive ? 'default' : 'secondary'}>
                        {addon.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
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
