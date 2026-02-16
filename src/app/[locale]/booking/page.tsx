"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Stepper } from "@/components/booking/Stepper";
import { AddOnSelector } from "@/components/addons/AddOnSelector";
import { VoucherInput } from "@/components/vouchers/VoucherInput";
import { Trip, AddOn, BookingFormData } from "@/types";
import { bookingSchema } from "@/lib/validations";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { getTrips } from "@/actions/trips";
import { getAddOns, createBooking, validateVoucher } from "@/actions/bookings";
import { toast } from "sonner";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const steps = ["step1", "step2", "step3", "step4"];

export default function BookingPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const selectedTripId = searchParams.get("trip");

  const [currentStep, setCurrentStep] = useState(0);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedAddOns, setSelectedAddOns] = useState<{ addOnId: string; quantity: number }[]>([]);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      tripId: selectedTripId || "",
      participants: 1,
    },
  });

  const participants = watch("participants") || 1;

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [tripsData, addOnsData] = await Promise.all([
          getTrips(),
          getAddOns(),
        ]);
        setTrips(tripsData);
        setAddOns(addOnsData);

        if (selectedTripId) {
          const trip = tripsData.find((t) => t.id === selectedTripId);
          if (trip) {
            setSelectedTrip(trip);
            setValue("tripId", trip.id);
          }
        }
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [selectedTripId, setValue]);

  const handleTripSelect = (trip: Trip) => {
    setSelectedTrip(trip);
    setValue("tripId", trip.id);
  };

  const handleAddOnToggle = (addOnId: string, quantity: number) => {
    setSelectedAddOns((prev) => {
      const existing = prev.find((a) => a.addOnId === addOnId);
      if (existing) {
        if (quantity === 0) {
          return prev.filter((a) => a.addOnId !== addOnId);
        }
        return prev.map((a) => (a.addOnId === addOnId ? { ...a, quantity } : a));
      }
      return [...prev, { addOnId, quantity }];
    });
  };

  const calculateTotal = () => {
    if (!selectedTrip) return 0;
    let total = selectedTrip.basePrice * participants;
    selectedAddOns.forEach((item) => {
      const addOn = addOns.find((a) => a.id === item.addOnId);
      if (addOn) {
        total += addOn.price * item.quantity;
      }
    });
    return Math.max(0, total - voucherDiscount);
  };

  const handleVoucherApply = async (code: string) => {
    const result = await validateVoucher(code, calculateTotal() + voucherDiscount);
    if (result.valid) {
      setVoucherDiscount(result.discount);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      const booking = await createBooking({
        ...data,
        date: selectedDate!,
        addOns: selectedAddOns,
      });
      toast.success(t("booking.success"));
      // Redirect to payment or success page
      window.location.href = `/booking/success?id=${booking.id}`;
    } catch (error) {
      toast.error(t("booking.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedTrip && selectedDate;
      case 2:
        return true;
      case 3:
        return true;
      default:
        return true;
    }
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-20 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("booking.title")}
          </h1>
        </div>

        <Stepper steps={steps.map((s) => t(`booking.${s}`))} currentStep={currentStep} />

        <Card className="mt-8">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {/* Step 1: Select Trip & Date */}
                {currentStep === 0 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    {/* Trip Selection */}
                    <div>
                      <Label className="text-lg font-semibold mb-4 block">
                        {t("booking.trip")}
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {trips.map((trip) => (
                          <div
                            key={trip.id}
                            onClick={() => handleTripSelect(trip)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              selectedTrip?.id === trip.id
                                ? "border-blue-600 bg-blue-50"
                                : "border-slate-200 hover:border-blue-300"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold">{trip.name}</p>
                                <p className="text-sm text-slate-500">
                                  {trip.duration} {t("common.hours")}
                                </p>
                              </div>
                              <p className="font-bold text-blue-600">
                                {formatPrice(trip.basePrice)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {errors.tripId && (
                        <p className="text-red-500 text-sm mt-2">{errors.tripId.message}</p>
                      )}
                    </div>

                    {/* Date Selection */}
                    <div>
                      <Label className="text-lg font-semibold mb-4 block">
                        {t("booking.date")}
                      </Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border mx-auto"
                      />
                    </div>

                    {/* Participants */}
                    <div>
                      <Label htmlFor="participants" className="text-lg font-semibold mb-4 block">
                        {t("booking.participants")}
                      </Label>
                      <Input
                        id="participants"
                        type="number"
                        min={1}
                        max={selectedTrip?.maxParticipants || 10}
                        {...register("participants", { valueAsNumber: true })}
                        className="w-32"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Add-ons */}
                {currentStep === 1 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <AddOnSelector
                      addOns={addOns}
                      selectedAddOns={selectedAddOns}
                      onToggle={handleAddOnToggle}
                    />
                  </motion.div>
                )}

                {/* Step 3: Contact Info */}
                {currentStep === 2 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <Label htmlFor="contactName">{t("booking.contactName")}</Label>
                      <Input id="contactName" {...register("contactName")} />
                      {errors.contactName && (
                        <p className="text-red-500 text-sm mt-1">{errors.contactName.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="contactEmail">{t("booking.contactEmail")}</Label>
                      <Input id="contactEmail" type="email" {...register("contactEmail")} />
                      {errors.contactEmail && (
                        <p className="text-red-500 text-sm mt-1">{errors.contactEmail.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="contactPhone">{t("booking.contactPhone")}</Label>
                      <Input id="contactPhone" {...register("contactPhone")} />
                      {errors.contactPhone && (
                        <p className="text-red-500 text-sm mt-1">{errors.contactPhone.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="notes">{t("booking.notes")}</Label>
                      <Input id="notes" {...register("notes")} />
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Review & Pay */}
                {currentStep === 3 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Booking Summary */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h3 className="font-semibold text-lg mb-4">{t("booking.step4")}</h3>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-slate-600">{selectedTrip?.name}</span>
                          <span>{formatPrice((selectedTrip?.basePrice || 0) * participants)}</span>
                        </div>
                        
                        {selectedAddOns.map((item) => {
                          const addOn = addOns.find((a) => a.id === item.addOnId);
                          return addOn ? (
                            <div key={item.addOnId} className="flex justify-between">
                              <span className="text-slate-600">{addOn.name} x{item.quantity}</span>
                              <span>{formatPrice(addOn.price * item.quantity)}</span>
                            </div>
                          ) : null;
                        })}
                      </div>

                      <Separator className="my-4" />

                      <VoucherInput onApply={handleVoucherApply} />

                      {voucherDiscount > 0 && (
                        <div className="flex justify-between text-green-600 mb-2">
                          <span>{t("booking.discount")}</span>
                          <span>-{formatPrice(voucherDiscount)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-xl font-bold">
                        <span>{t("booking.total")}</span>
                        <span className="text-blue-600">{formatPrice(calculateTotal())}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {t("booking.back")}
                </Button>

                <Button
                  type="submit"
                  disabled={!canProceed() || isSubmitting}
                  className="bg-blue-900 hover:bg-blue-800"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : currentStep === steps.length - 1 ? (
                    <>
                      {t("booking.payNow")}
                    </>
                  ) : (
                    <>
                      {t("booking.next")}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
