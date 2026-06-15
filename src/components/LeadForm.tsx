"use client";

import { useState } from "react";
import type { ProposalData } from "@/types/solar";
import { generateProposalPdf } from "@/utils/generatePdf";
import { btnPrimary, inputClass, labelClass } from "@/lib/ui";

type Props = {
  proposal: Omit<ProposalData, "lead">;
  companyName: string;
};

export default function LeadForm({ proposal, companyName }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim()) {
      setError("Name and phone are required");
      return;
    }

    generateProposalPdf({
      ...proposal,
      lead: {
        name: name.trim(),
        phone: phone.trim(),
        location: location.trim() || "Not specified",
      },
    });

    setSubmitted(true);
  }

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <h3 className="font-semibold text-slate-800">Get your proposal</h3>
      <p className="text-sm text-slate-500">
        Enter your details to download a personalised PDF proposal from {companyName}.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}
        {submitted && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            Proposal downloaded. Our team will contact you soon.
          </p>
        )}

        <div>
          <label htmlFor="leadName" className={labelClass}>Name</label>
          <input
            id="leadName"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`mt-1.5 ${inputClass}`}
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="leadPhone" className={labelClass}>Phone</label>
          <input
            id="leadPhone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`mt-1.5 ${inputClass}`}
            placeholder="10-digit mobile"
          />
        </div>

        <div>
          <label htmlFor="leadLocation" className={labelClass}>Location</label>
          <input
            id="leadLocation"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`mt-1.5 ${inputClass}`}
            placeholder="City / area"
          />
        </div>

        <button type="submit" className={btnPrimary}>
          Download proposal PDF
        </button>
      </form>
    </div>
  );
}
