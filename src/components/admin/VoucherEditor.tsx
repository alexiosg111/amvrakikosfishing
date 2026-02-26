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
import { createVoucher, updateVoucher, VoucherFormData } from "@/actions/admin/vouchers";
import { toast } from "sonner";
import { Voucher } from "@/types";

const voucherSchema = z.object({
  code: z.string().min(3, "Code is required"),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.coerce.number().min(1, "Value is required"),
  minPurchase: z.coerce.number().min(0),
  maxUses: z.coerce.number().min(-1),
  expiresAt: z.string().optional(),
  isActive: z.boolean(),
});

type VoucherFormValues = z.infer<typeof voucherSchema>;

interface VoucherEditorProps {
  voucher?: Voucher;
  onSave: () => void;
  onCancel: () => void;
}

export function VoucherEditor({ voucher, onSave, onCancel }: VoucherEditorProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      code: voucher?.code || "",
      discountType: (voucher?.discountType as "PERCENTAGE" | "FIXED") || "PERCENTAGE",
      discountValue: voucher?.discountValue || 10,
      minPurchase: voucher?.minPurchase || 0,
      maxUses: voucher?.maxUses ?? -1,
      expiresAt: voucher?.expiresAt
        ? new Date(voucher.expiresAt).toISOString().split("T")[0]
        : "",
      isActive: voucher?.isActive ?? true,
    },
  });

  const discountType = watch("discountType");
  const isActive = watch("isActive");

  const onSubmit = async (values: VoucherFormValues) => {
    try {
      const data: VoucherFormData = {
        code: values.code,
        discountType: values.discountType,
        discountValue: values.discountValue,
        minPurchase: values.minPurchase,
        maxUses: values.maxUses,
        expiresAt: values.expiresAt ? new Date(values.expiresAt) : null,
        isActive: values.isActive,
      };

      if (voucher) {
        await updateVoucher(voucher.id, data);
        toast.success("Voucher updated");
      } else {
        await createVoucher(data);
        toast.success("Voucher created");
      }
      onSave();
    } catch {
      toast.error("Failed to save voucher");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Code *</Label>
        <Input {...register("code")} placeholder="e.g. SUMMER20" className="uppercase" />
        {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Discount Type *</Label>
          <Select
            value={discountType}
            onValueChange={(v) => setValue("discountType", v as "PERCENTAGE" | "FIXED")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
              <SelectItem value="FIXED">Fixed (€)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Value *</Label>
          <Input type="number" min={1} {...register("discountValue")} />
          {errors.discountValue && (
            <p className="text-sm text-destructive">{errors.discountValue.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Min Purchase (€)</Label>
          <Input type="number" min={0} {...register("minPurchase")} />
        </div>

        <div className="space-y-2">
          <Label>Max Uses (-1 = unlimited)</Label>
          <Input type="number" min={-1} {...register("maxUses")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Expires At</Label>
        <Input type="date" {...register("expiresAt")} />
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
          {isSubmitting ? "Saving..." : voucher ? "Save Changes" : "Create Voucher"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
