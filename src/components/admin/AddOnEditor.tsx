"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAddOn, updateAddOn, AddOnFormData } from "@/actions/admin/addons";
import { toast } from "sonner";
import { AddOn, AddOnCategory } from "@/types";

const addOnSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(5, "Description is required"),
  price: z.coerce.number().min(0, "Price is required"),
  category: z.enum(["GENERAL", "FOOD", "TRANSPORT", "EQUIPMENT", "PHOTO", "PREMIUM"]),
  isActive: z.boolean(),
  imageUrl: z.string().optional(),
});

type AddOnFormValues = z.infer<typeof addOnSchema>;

interface AddOnEditorProps {
  addOn?: AddOn;
  onSave: () => void;
  onCancel: () => void;
}

export function AddOnEditor({ addOn, onSave, onCancel }: AddOnEditorProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddOnFormValues>({
    resolver: zodResolver(addOnSchema),
    defaultValues: {
      name: addOn?.name || "",
      description: addOn?.description || "",
      price: addOn?.price || 0,
      category: addOn?.category || "GENERAL",
      isActive: addOn?.isActive ?? true,
      imageUrl: addOn?.imageUrl || "",
    },
  });

  const isActive = watch("isActive");
  const category = watch("category");

  const onSubmit = async (values: AddOnFormValues) => {
    try {
      const data: AddOnFormData = {
        ...values,
        imageUrl: values.imageUrl || undefined,
      };
      if (addOn) {
        await updateAddOn(addOn.id, data);
        toast.success("Add-on updated");
      } else {
        await createAddOn(data);
        toast.success("Add-on created");
      }
      onSave();
    } catch {
      toast.error("Failed to save add-on");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Name *</Label>
        <Input {...register("name")} placeholder="Add-on name" />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Description *</Label>
        <Input {...register("description")} placeholder="Brief description" />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Price (€) *</Label>
          <Input type="number" min={0} {...register("price")} />
          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Category *</Label>
          <Select
            value={category}
            onValueChange={(v) => setValue("category", v as AddOnCategory)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GENERAL">General</SelectItem>
              <SelectItem value="FOOD">Food</SelectItem>
              <SelectItem value="TRANSPORT">Transport</SelectItem>
              <SelectItem value="EQUIPMENT">Equipment</SelectItem>
              <SelectItem value="PHOTO">Photo</SelectItem>
              <SelectItem value="PREMIUM">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Image URL</Label>
        <Input {...register("imageUrl")} placeholder="https://..." />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="isActive"
          checked={isActive}
          onCheckedChange={(checked) => setValue("isActive", !!checked)}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
          {isSubmitting ? "Saving..." : addOn ? "Save Changes" : "Create Add-On"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
