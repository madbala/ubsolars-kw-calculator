"use client";

import { useState } from "react";
import type { ProposalData } from "@/types/solar";
import { generateProposalPdf } from "@/utils/generatePdf";
import { useCalculator } from "@/context/CalculatorContext";
import {
  validatePhone,
  validateRequiredText,
} from "@/utils/validation";
import {
  btnPrimary,
  errorText,
  inputClass,
  inputErrorClass,
  labelClass,
  mutedText,
  sectionCard,
  sectionTitle,
} from "@/lib/ui";

type Props = {
  proposal: Omit<ProposalData, "lead">;
  companyName: string;
};

export default function LeadForm({ proposal, companyName }: Props) {
  const { settings } = useCalculator();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    const nameCheck = validateRequiredText(name, "Name", 2);
    if (!nameCheck.ok) nextErrors.name = nameCheck.message;

    const phoneCheck = validatePhone(phone);
    if (!phoneCheck.ok) nextErrors.phone = phoneCheck.message;

    if (location.trim() && location.trim().length < 2) {
      nextErrors.location = "Location must be at least 2 characters";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    generateProposalPdf(
      {
        ...proposal,
        lead: {
          name: name.trim(),
          phone: phone.trim(),
          location: location.trim() || "Not specified",
        },
      },
      settings,
    );

    setSubmitted(true);
  }

  return (
    <div className={sectionCard}>
      <h3 className={sectionTitle}>Get your proposal</h3>
      <p className={`text-sm ${mutedText}`}>
        Enter your details to download a personalised PDF proposal from {companyName}.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {submitted && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            Proposal downloaded. Our team will contact you soon.
          </p>
        )}

        <div>
          <label htmlFor="leadName" className={labelClass}>
            Name
          </label>
          <input
            id="leadName"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((p) => ({ ...p, name: "" }));
            }}
            className={`mt-1.5 ${errors.name ? inputErrorClass : inputClass}`}
            placeholder="Your name"
          />
          {errors.name && <p className={errorText}>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="leadPhone" className={labelClass}>
            Phone
          </label>
          <input
            id="leadPhone"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
              if (errors.phone) setErrors((p) => ({ ...p, phone: "" }));
            }}
            className={`mt-1.5 ${errors.phone ? inputErrorClass : inputClass}`}
            placeholder="10-digit mobile"
          />
          {errors.phone && <p className={errorText}>{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="leadLocation" className={labelClass}>
            Location
          </label>
          <input
            id="leadLocation"
            type="text"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              if (errors.location) setErrors((p) => ({ ...p, location: "" }));
            }}
            className={`mt-1.5 ${errors.location ? inputErrorClass : inputClass}`}
            placeholder="City / area"
          />
          {errors.location && <p className={errorText}>{errors.location}</p>}
        </div>

        <button type="submit" className={btnPrimary}>
          Download proposal PDF
        </button>
      </form>
    </div>
  );
}
