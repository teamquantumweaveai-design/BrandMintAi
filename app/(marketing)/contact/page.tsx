"use client";

import React, { useState } from "react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import GlowCard from "@/components/ui/GlowCard";
import GradientText from "@/components/ui/GradientText";
import { z } from "zod";
import { Send, Terminal, Loader2, Sparkles, AlertCircle, CheckCircle2, Mail, Globe, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motion";

// Zod validation schema
const inquiryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  company: z.string().optional(),
  type: z.enum(["Venture Incubation", "Enterprise Automation", "Custom IP Forge", "General"]),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type FormData = {
  name: string;
  email: string;
  company: string;
  type: "Venture Incubation" | "Enterprise Automation" | "Custom IP Forge" | "General";
  message: string;
};

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    type: "General",
    message: "",
  });

  const [errors, setErrors] = useState<{ [key in keyof FormData]?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrors({});

    // Client-side Validation using Zod
    const result = inquiryFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: { [key in keyof FormData]?: string } = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof FormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Telemetry connection failed.");
      }

      setSubmitStatus({ success: true, message: "Lead submitted successfully." });
      setFormData({
        name: "",
        email: "",
        company: "",
        type: "General",
        message: "",
      });
    } catch (err: any) {
      setSubmitStatus({ success: false, message: err.message || "Connection failure. Verify target node status." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-20 relative">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none z-0" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center flex flex-col gap-4 mb-16">
            <span className="text-xs uppercase font-semibold text-accent-to tracking-widest inline-flex items-center gap-1.5 self-center">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Synthesis Handshake</span>
            </span>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white">
              Connect with <GradientText>BrandMint AI</GradientText>
            </h1>
            <p className="text-muted text-sm md:text-base max-w-lg mx-auto font-light leading-relaxed">
              Open an active communications buffer. Submit your parameters below to establish a design contract.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-stretch">
            {/* Info Panel: Span 2 */}
            <div className="lg:col-span-2 flex flex-col justify-between gap-10">
              <div className="flex flex-col gap-6">
                <h2 className="text-xl font-bold font-display text-white uppercase tracking-wider">
                  Operational Nodes
                </h2>
                <p className="text-muted text-sm font-light leading-relaxed">
                  Our system architects maintain global telemetry coordinates. Engage our core nodes to prototype SaaS systems, run workflow logic checks, or build autonomous IP.
                </p>

                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-xl">
                    <Mail className="w-5 h-5 text-accent-to" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted uppercase font-bold">Node Mailbox</span>
                      <span className="text-xs font-mono text-white">ops@brandmint.ai</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-xl">
                    <Globe className="w-5 h-5 text-accent-to" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted uppercase font-bold">Autonomic Logs</span>
                      <span className="text-xs font-mono text-white">status.brandmint.ai</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-xl">
                    <MapPin className="w-5 h-5 text-accent-to" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted uppercase font-bold">HQ Telemetry</span>
                      <span className="text-xs font-mono text-white">San Francisco Node 01</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Console Mock */}
              <div className="p-4 bg-surface border border-white/5 rounded-xl font-mono text-[10px] text-muted/80 flex flex-col gap-2">
                <div>&gt; _ connection status: listening</div>
                <div>&gt; _ encryption protocol: x25519</div>
                <div>&gt; _ pending tasks in pool: 0</div>
              </div>
            </div>

            {/* Form Panel: Span 3 */}
            <div className="lg:col-span-3">
              <GlowCard innerClassName="p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-xs font-bold text-white uppercase tracking-wider">
                        Operator Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`bg-bg border rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted focus:outline-none focus:ring-1 transition-all ${
                          errors.name
                            ? "border-red-500/50 focus:border-red-500 focus:ring-red-500"
                            : "border-white/10 focus:border-accent-from focus:ring-accent-from"
                        }`}
                      />
                      {errors.name && (
                        <span className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.name}</span>
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-white uppercase tracking-wider">
                        Node Address (Email)
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="operator@domain.com"
                        className={`bg-bg border rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted focus:outline-none focus:ring-1 transition-all ${
                          errors.email
                            ? "border-red-500/50 focus:border-red-500 focus:ring-red-500"
                            : "border-white/10 focus:border-accent-from focus:ring-accent-from"
                        }`}
                      />
                      {errors.email && (
                        <span className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Company */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="company" className="text-xs font-bold text-white uppercase tracking-wider">
                        Ecosystem Entity (Company)
                      </label>
                      <input
                        type="text"
                        name="company"
                        id="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Optional"
                        className="bg-bg border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent-from focus:ring-1 focus:ring-accent-from transition-all"
                      />
                    </div>

                    {/* Inquiry Type */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="type" className="text-xs font-bold text-white uppercase tracking-wider">
                        Contract Type
                      </label>
                      <select
                        name="type"
                        id="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="bg-bg border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-from focus:ring-1 focus:ring-accent-from transition-all"
                      >
                        <option value="General">General Inquiries</option>
                        <option value="Venture Incubation">Venture Incubation</option>
                        <option value="Enterprise Automation">Enterprise Automation</option>
                        <option value="Custom IP Forge">Custom IP Forge</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-xs font-bold text-white uppercase tracking-wider">
                      Payload Description (Message)
                      <span className="text-[10px] text-muted normal-case font-normal ml-1">
                        (min 10 chars)
                      </span>
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe system parameters..."
                      className={`bg-bg border rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted focus:outline-none focus:ring-1 transition-all resize-none ${
                        errors.message
                          ? "border-red-500/50 focus:border-red-500 focus:ring-red-500"
                          : "border-white/10 focus:border-accent-from focus:ring-accent-from"
                      }`}
                    />
                    {errors.message && (
                      <span className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.message}</span>
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative flex items-center justify-center gap-2 w-full py-4 rounded-xl overflow-hidden text-sm font-semibold transition-all duration-300 bg-gradient-to-r from-accent-from to-accent-to text-white hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-75 disabled:hover:scale-100 disabled:shadow-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transmitting Packet...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Initiate Node Connection</span>
                      </>
                    )}
                  </button>

                  {/* Submission Toast Status */}
                  {submitStatus && (
                    <div
                      className={`flex items-start gap-3 p-4 rounded-xl border ${
                        submitStatus.success
                          ? "bg-green-500/10 border-green-500/20 text-green-400"
                          : "bg-red-500/10 border-red-500/20 text-red-400"
                      }`}
                    >
                      {submitStatus.success ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 shrink-0" />
                      )}
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="font-bold uppercase">
                          {submitStatus.success ? "Success" : "Network Error"}
                        </span>
                        <span>{submitStatus.message}</span>
                      </div>
                    </div>
                  )}
                </form>
              </GlowCard>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
