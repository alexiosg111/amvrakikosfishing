'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ImageIcon } from 'lucide-react';

// Mock data - replace with actual data fetching
const mockImages = [
  {
    id: '1',
    title: 'Big Catch',
    category: 'catches',
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Sunset Fishing',
    category: 'scenery',
    isActive: true,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    title: 'Our Boat',
    category: 'boat',
    isActive: true,
    createdAt: new Date('2024-01-05'),
  },
];

const categoryColors: Record<string, string> = {
  catches: 'bg-green-100 text-green-800',
  boat: 'bg-blue-100 text-blue-800',
  scenery: 'bg-purple-100 text-purple-800',
  guests: 'bg-orange-100 text-orange-800',
};

export default function AdminGalleryPage() {
  const [images] = useState(mockImages);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gallery</h1>
          <p className="text-slate-600 mt-1">Manage gallery images and photos</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Upload Image
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">Image</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">Title</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">Category</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {images.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-slate-500 py-8">
                    No images yet
                  </td>
                </tr>
              ) : (
                images.map((image) => (
                  <tr key={image.id}>
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-slate-400" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{image.title}</td>
                    <td className="px-6 py-4">
                      <Badge className={categoryColors[image.category] || 'bg-slate-100'}>
                        {image.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={image.isActive ? 'default' : 'secondary'}>
                        {image.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
