"use client";

import React, { useState } from "react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import GradientText from "@/components/ui/GradientText";
import { z } from "zod";
import { Send, Loader2, Sparkles, AlertCircle, CheckCircle2, Mail, MapPin, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SOCIAL_LINKS } from "@/lib/constants";

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

import { useSearchParams } from "react-router-dom";

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const packageParam = searchParams.get("package");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    type: packageParam ? "Enterprise Automation" : "General",
    message: packageParam
      ? `Hi BrandMint AI, I would like to inquire about the ${packageParam} package.`
      : "",
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
      const { error } = await supabase
        .from("leads")
        .insert([
          {
            name: formData.name,
            email: formData.email,
            company: formData.company,
            message: formData.message
          }
        ]);

      if (error) {
        throw new Error(error.message || "Failed to submit inquiry.");
      }

      setSubmitStatus({ success: true, message: "Thank you! Your message has been sent successfully." });
      setFormData({
        name: "",
        email: "",
        company: "",
        type: "General",
        message: "",
      });
    } catch (err: any) {
      setSubmitStatus({ success: false, message: err.message || "Something went wrong. Please reach out via WhatsApp or email directly." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 relative bg-[#F8F9FA] text-[#2E384D]">
        <div className="absolute inset-0 grid-bg opacity-35 pointer-events-none z-0" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center flex flex-col gap-4 mb-16">
            <span className="text-xs uppercase font-semibold text-[#FF5C35] tracking-widest inline-flex items-center gap-1.5 self-center">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Contact Us</span>
            </span>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-[#2E384D]">
              Let's build <GradientText>something meaningful</GradientText>
            </h1>
            <p className="text-[#516F90] text-sm md:text-base max-w-2xl mx-auto font-normal leading-relaxed">
              Whether you're building a business, an automated workflow, or scaling operations, let's explore what can be improved, automated, or built.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Info Panel: Span 2 */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold font-display text-[#2E384D] uppercase tracking-wider">
                  Our Office
                </h2>
                <p className="text-[#516F90] text-sm leading-relaxed">
                  Connect with our team to explore business growth diagnostics, practical AI systems, and automated operations.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 bg-white border border-[#CBD6E2] shadow-xs p-4 rounded-xl">
                  <Mail className="w-5 h-5 text-[#FF5C35]" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#516F90] uppercase font-bold">Email Us</span>
                    <span className="text-xs font-mono text-[#2E384D] font-medium">connect@brandmintai.io</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white border border-[#CBD6E2] shadow-xs p-4 rounded-xl">
                  <MessageCircle className="w-5 h-5 text-emerald-600" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#516F90] uppercase font-bold">WhatsApp Direct</span>
                    <a href="https://wa.me/919972965677" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-[#2E384D] hover:text-[#FF5C35] transition-colors font-medium">
                      +91 99729 65677
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white border border-[#CBD6E2] shadow-xs p-4 rounded-xl">
                  <MapPin className="w-5 h-5 text-[#FF5C35] shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#516F90] uppercase font-bold">Office Address</span>
                    <span className="text-xs text-[#2E384D] leading-relaxed">
                      No. 3, Lingappa Layout, 1st Cross, Sri Sri Sri Shivakumara Swamiji Road, Bengaluru – 560090
                    </span>
                  </div>
                </div>
              </div>

              {/* Official Social Media Integration */}
              <div className="flex flex-col gap-3 p-5 rounded-2xl bg-[#FFF2EE] border border-[#FFDCD3]">
                <span className="text-xs font-mono uppercase tracking-wider text-[#DF441F] font-bold">
                  Official Channels
                </span>
                <p className="text-xs text-[#516F90] leading-relaxed">
                  Follow BrandMint AI across verified channels for automation breakdowns and venture updates:
                </p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {SOCIAL_LINKS.filter((s) => s.id !== "mail").map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#FFDCD3] hover:border-[#FF5C35] hover:text-[#FF5C35] text-xs font-semibold text-[#2E384D] transition-all shadow-2xs group"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#FF5C35] group-hover:scale-125 transition-transform" />
                      <span className="truncate">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Panel: Span 3 */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-[#CBD6E2] shadow-sm rounded-2xl p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-xs font-bold text-[#2E384D] uppercase tracking-wider">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`bg-[#F8F9FA] border rounded-xl px-4 py-3 text-sm text-[#2E384D] placeholder:text-[#516F90]/60 focus:outline-none focus:ring-2 focus:ring-[#FF5C35]/20 transition-all ${
                          errors.name
                            ? "border-red-500/50 focus:border-red-500"
                            : "border-[#CBD6E2] focus:border-[#FF5C35]"
                        }`}
                      />
                      {errors.name && (
                        <span className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.name}</span>
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-[#2E384D] uppercase tracking-wider">
                        Work Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@company.com"
                        className={`bg-[#F8F9FA] border rounded-xl px-4 py-3 text-sm text-[#2E384D] placeholder:text-[#516F90]/60 focus:outline-none focus:ring-2 focus:ring-[#FF5C35]/20 transition-all ${
                          errors.email
                            ? "border-red-500/50 focus:border-red-500"
                            : "border-[#CBD6E2] focus:border-[#FF5C35]"
                        }`}
                      />
                      {errors.email && (
                        <span className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Company */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="company" className="text-xs font-bold text-[#2E384D] uppercase tracking-wider">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        name="company"
                        id="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your Company Name"
                        className="bg-[#F8F9FA] border border-[#CBD6E2] rounded-xl px-4 py-3 text-sm text-[#2E384D] placeholder:text-[#516F90]/60 focus:outline-none focus:border-[#FF5C35] focus:ring-2 focus:ring-[#FF5C35]/20 transition-all"
                      />
                    </div>

                    {/* Inquiry Type */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="type" className="text-xs font-bold text-[#2E384D] uppercase tracking-wider">
                        Inquiry Type
                      </label>
                      <select
                        name="type"
                        id="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="bg-[#F8F9FA] border border-[#CBD6E2] rounded-xl px-4 py-3 text-sm text-[#2E384D] focus:outline-none focus:border-[#FF5C35] focus:ring-2 focus:ring-[#FF5C35]/20 transition-all"
                      >
                        <option value="General">General Inquiry</option>
                        <option value="Venture Incubation">Venture Incubation</option>
                        <option value="Enterprise Automation">Enterprise Automation</option>
                        <option value="Custom IP Forge">Custom Systems & IP</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-xs font-bold text-[#2E384D] uppercase tracking-wider">
                      Your Message
                      <span className="text-[10px] text-[#516F90] normal-case font-normal ml-1">
                        (min 10 characters)
                      </span>
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project, goals, or questions..."
                      className={`bg-[#F8F9FA] border rounded-xl px-4 py-3 text-sm text-[#2E384D] placeholder:text-[#516F90]/60 focus:outline-none focus:ring-2 focus:ring-[#FF5C35]/20 transition-all resize-none ${
                        errors.message
                          ? "border-red-500/50 focus:border-red-500"
                          : "border-[#CBD6E2] focus:border-[#FF5C35]"
                      }`}
                    />
                    {errors.message && (
                      <span className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.message}</span>
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative flex items-center justify-center gap-2 w-full py-4 rounded-xl overflow-hidden text-sm font-semibold transition-all duration-300 bg-[#FF5C35] hover:bg-[#DF441F] text-white hover:scale-[1.01] hover:shadow-[0_4px_16px_rgba(255,92,53,0.35)] disabled:opacity-75 disabled:hover:scale-100 disabled:shadow-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                  {/* Submission Toast Status */}
                  {submitStatus && (
                    <div
                      className={`flex items-start gap-3 p-4 rounded-xl border ${
                        submitStatus.success
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : "bg-red-50 border-red-200 text-red-800"
                      }`}
                    >
                      {submitStatus.success ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                      )}
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="font-bold uppercase">
                          {submitStatus.success ? "Success" : "Error"}
                        </span>
                        <span>{submitStatus.message}</span>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
