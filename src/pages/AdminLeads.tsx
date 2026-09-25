"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { sectionRevealVariant, cardHoverVariant, buttonTapVariant, useReducedMotionVariant } from "@/lib/motion";
import GradientText from "@/components/ui/GradientText";
import GlowCard from "@/components/ui/GlowCard";
import { Lead } from "@/types/lead";
import { Activity, Mail, Building, Clock, ChevronDown, CheckCircle, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "inquiry" | "exit" | "newsletter">("all");
  const hoverVariant = useReducedMotionVariant(cardHoverVariant.hover, {});

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      let combinedLeads: Lead[] = [];

      if (!error && data) {
        combinedLeads = [...data];
      }

      // Also merge any local backup leads and newsletter subscribers if not already present
      try {
        const exitLeads = JSON.parse(localStorage.getItem("brandmint_exit_leads") || "[]");
        exitLeads.forEach((el: any, idx: number) => {
          if (!combinedLeads.some((l) => l.email === el.contact)) {
            combinedLeads.push({
              id: `local-exit-${idx}`,
              name: el.name,
              email: el.contact,
              company: el.company || "Exit Pop-up - Free Growth Scan",
              message: "Requested Free Quantum Growth Scan™ via Exit Intent Pop-up.",
              status: "new",
              created_at: el.capturedAt || new Date().toISOString(),
            });
          }
        });

        const newsLeads = JSON.parse(localStorage.getItem("brandmint_newsletter_subscribers") || "[]");
        newsLeads.forEach((nl: any, idx: number) => {
          if (!combinedLeads.some((l) => l.email === nl.email)) {
            combinedLeads.push({
              id: `local-news-${idx}`,
              name: "Newsletter Subscriber",
              email: nl.email,
              company: "Newsletter Subscription",
              message: "Subscribed to BrandMint AI newsletter & system updates.",
              status: "new",
              created_at: nl.subscribed_at || new Date().toISOString(),
            });
          }
        });
      } catch (e) {
        console.warn("Could not read local backup leads", e);
      }

      setLeads(combinedLeads);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    if (id.startsWith("local-")) {
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: newStatus as any } : l))
      );
      return;
    }
    try {
      await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", id);
      fetchLeads();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    if (id.startsWith("local-")) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      return;
    }
    try {
      await supabase
        .from("leads")
        .delete()
        .eq("id", id);
      fetchLeads();
    } catch (err) {
      console.error("Failed to delete lead", err);
    }
  };

  // Filter leads based on active tab
  const filteredLeads = leads.filter((lead) => {
    const isExit =
      lead.company?.toLowerCase().includes("exit") ||
      lead.message?.toLowerCase().includes("exit");
    const isNewsletter =
      lead.company?.toLowerCase().includes("newsletter") ||
      lead.name?.toLowerCase().includes("newsletter") ||
      lead.message?.toLowerCase().includes("newsletter");

    if (activeTab === "exit") return isExit;
    if (activeTab === "newsletter") return isNewsletter;
    if (activeTab === "inquiry") return !isExit && !isNewsletter;
    return true;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 px-6 max-w-7xl mx-auto bg-[#F8F9FA] text-[#2E384D]">
        <motion.div
          variants={sectionRevealVariant}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <GradientText as="h1" className="text-4xl md:text-5xl font-display mb-2">
                Lead & Subscriber Intelligence
              </GradientText>
              <p className="text-[#516F90]">
                Review and manage incoming inquiries, exit pop-up growth scans, and newsletter subscribers.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#CBD6E2] text-sm font-semibold text-[#2E384D] shadow-xs w-fit">
              <Activity className="w-4 h-4 text-[#FF5C35]" />
              <span>{leads.length} Total Submissions</span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#CBD6E2]/70 pb-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-[#FF5C35] text-white shadow-xs"
                  : "bg-white text-[#516F90] border border-[#CBD6E2] hover:text-[#2E384D]"
              }`}
            >
              All Records ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab("inquiry")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "inquiry"
                  ? "bg-[#FF5C35] text-white shadow-xs"
                  : "bg-white text-[#516F90] border border-[#CBD6E2] hover:text-[#2E384D]"
              }`}
            >
              Contact Inquiries ({leads.filter((l) => !l.company?.toLowerCase().includes("exit") && !l.company?.toLowerCase().includes("newsletter") && !l.name?.toLowerCase().includes("newsletter")).length})
            </button>
            <button
              onClick={() => setActiveTab("exit")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "exit"
                  ? "bg-[#FF5C35] text-white shadow-xs"
                  : "bg-white text-[#516F90] border border-[#CBD6E2] hover:text-[#2E384D]"
              }`}
            >
              Exit Pop-up Scans ({leads.filter((l) => l.company?.toLowerCase().includes("exit") || l.message?.toLowerCase().includes("exit")).length})
            </button>
            <button
              onClick={() => setActiveTab("newsletter")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "newsletter"
                  ? "bg-[#FF5C35] text-white shadow-xs"
                  : "bg-white text-[#516F90] border border-[#CBD6E2] hover:text-[#2E384D]"
              }`}
            >
              Newsletter ({leads.filter((l) => l.company?.toLowerCase().includes("newsletter") || l.name?.toLowerCase().includes("newsletter") || l.message?.toLowerCase().includes("newsletter")).length})
            </button>
          </div>

          {loading ? (
            <div className="text-center text-[#516F90] py-20 font-medium">Loading records...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLeads.length === 0 ? (
                <div className="col-span-full text-center text-[#516F90] py-20 bg-white rounded-2xl border border-[#CBD6E2] shadow-xs">
                  No records found in this category. Submissions from the contact form, exit pop-up, or newsletter will appear here.
                </div>
              ) : (
                filteredLeads.map((lead, i) => (
                  <motion.div
                    key={lead.id}
                    custom={i}
                    variants={sectionRevealVariant}
                    whileHover={hoverVariant}
                  >
                    <GlowCard className="h-full flex flex-col justify-between bg-white border-[#CBD6E2] shadow-xs">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${
                            lead.status === 'new' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            lead.status === 'contacted' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            lead.status === 'qualified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {lead.status}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-[#516F90]">
                            <Clock className="w-3 h-3" />
                            {new Date(lead.created_at).toLocaleDateString()}
                          </div>
                        </div>

                        <h3 className="text-xl font-bold font-display text-[#2E384D] mb-1">{lead.name}</h3>
                        
                        <div className="flex items-center gap-2 text-sm text-[#516F90] mb-1">
                          <Mail className="w-4 h-4 text-[#FF5C35]" />
                          <a href={`mailto:${lead.email}`} className="hover:text-[#DF441F] transition-colors">
                            {lead.email}
                          </a>
                        </div>
                        
                        {lead.company && (
                          <div className="flex items-center gap-2 text-sm text-[#516F90] mb-4">
                            <Building className="w-4 h-4 text-[#FF5C35]" />
                            <span>{lead.company}</span>
                          </div>
                        )}

                        <div className="mt-4 p-4 rounded-xl bg-[#F8F9FA] border border-[#CBD6E2] text-sm text-[#2E384D] h-32 overflow-y-auto leading-relaxed">
                          {lead.message}
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-[#CBD6E2] flex items-center justify-between">
                        <select
                          value={lead.status}
                          onChange={(e) => updateStatus(lead.id, e.target.value)}
                          className="bg-white border border-[#CBD6E2] rounded-lg px-3 py-1.5 text-sm text-[#2E384D] focus:outline-none focus:border-[#FF5C35]"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="lost">Lost</option>
                        </select>

                        <motion.button
                          whileTap={useReducedMotionVariant(buttonTapVariant.tap, {})}
                          onClick={() => deleteLead(lead.id)}
                          className="p-2 text-[#516F90] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </GlowCard>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </>
  );
}

