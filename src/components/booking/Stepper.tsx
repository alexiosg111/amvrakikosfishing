"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              initial={false}
              animate={{
                backgroundColor: index <= currentStep ? "#1e3a8a" : "#e2e8f0",
                scale: index === currentStep ? 1.1 : 1,
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                index <= currentStep ? "text-white" : "text-slate-500"
              }`}
            >
              {index < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </motion.div>
            <span className="text-xs mt-2 text-slate-600 hidden sm:block">
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 sm:w-24 h-1 mx-2 transition-colors ${
                index < currentStep ? "bg-blue-900" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
