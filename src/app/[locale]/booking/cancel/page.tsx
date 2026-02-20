"use client";

import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BookingCancelPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <XCircle className="w-12 h-12 text-red-500" />
          </motion.div>

          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Payment Cancelled
          </h1>
          <p className="text-slate-600 mb-8 text-lg">
            Your booking payment was cancelled. No charges were made. You can try again or contact us for assistance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button className="bg-blue-900 hover:bg-blue-800 px-8">
                Try Again
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50 px-8">
                Contact Us
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
