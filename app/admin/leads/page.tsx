"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { sectionRevealVariant, cardHoverVariant, buttonTapVariant, useReducedMotionVariant } from "@/lib/motion";
import GradientText from "@/components/ui/GradientText";
import GlowCard from "@/components/ui/GlowCard";
import { Lead } from "@/types/lead";
import { Activity, Mail, Building, Clock, ChevronDown, CheckCircle, Trash2 } from "lucide-react";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchLeads();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      await fetch(`/api/leads/${id}`, { method: "DELETE" });
      fetchLeads();
    } catch (err) {
      console.error("Failed to delete lead", err);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div
        variants={sectionRevealVariant}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-10"
      >
        <div className="flex items-center justify-between">
          <div>
            <GradientText as="h1" className="text-4xl md:text-5xl font-display mb-2">
              Lead Management
            </GradientText>
            <p className="text-muted">Review and manage incoming inquiries and discovery calls.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium">
            <Activity className="w-4 h-4 text-accent-to" />
            <span>{leads.length} Total Leads</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-muted py-20">Loading leads...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leads.length === 0 ? (
              <div className="col-span-full text-center text-muted py-20 bg-white/5 rounded-2xl border border-white/10">
                No leads found. When users submit the contact form, they will appear here.
              </div>
            ) : (
              leads.map((lead, i) => (
                <motion.div
                  key={lead.id}
                  custom={i}
                  variants={sectionRevealVariant}
                  whileHover={useReducedMotionVariant(cardHoverVariant.hover, {})}
                >
                  <GlowCard className="h-full flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${
                          lead.status === 'new' ? 'bg-blue-500/20 text-blue-300' :
                          lead.status === 'contacted' ? 'bg-yellow-500/20 text-yellow-300' :
                          lead.status === 'qualified' ? 'bg-green-500/20 text-green-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {lead.status}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted">
                          <Clock className="w-3 h-3" />
                          {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-white mb-1">{lead.name}</h3>
                      
                      <div className="flex items-center gap-2 text-sm text-muted mb-1">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${lead.email}`} className="hover:text-accent-to transition-colors">
                          {lead.email}
                        </a>
                      </div>
                      
                      {lead.company && (
                        <div className="flex items-center gap-2 text-sm text-muted mb-4">
                          <Building className="w-4 h-4" />
                          <span>{lead.company}</span>
                        </div>
                      )}

                      <div className="mt-4 p-4 rounded-xl bg-bg/50 border border-white/5 text-sm text-white/80 h-32 overflow-y-auto">
                        {lead.message}
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className="bg-transparent border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-accent-to"
                      >
                        <option value="new" className="bg-bg">New</option>
                        <option value="contacted" className="bg-bg">Contacted</option>
                        <option value="qualified" className="bg-bg">Qualified</option>
                        <option value="lost" className="bg-bg">Lost</option>
                      </select>

                      <motion.button
                        whileTap={useReducedMotionVariant(buttonTapVariant.tap, {})}
                        onClick={() => deleteLead(lead.id)}
                        className="p-2 text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
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
  );
}
