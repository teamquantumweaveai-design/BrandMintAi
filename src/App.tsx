
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// SEO Manager
import SEOManager from "./components/SEOManager";

// Import pages
import Home from "./pages/Home";
import About from "./pages/About";
import Solutions from "./pages/Solutions";
import BusinessGrowth from "./pages/BusinessGrowth";
import QuantumWeave from "./pages/QuantumWeave";
import Ventures from "./pages/Ventures";
import Academy from "./pages/Academy";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import AdminLeads from "./pages/AdminLeads";
import WhatsAppAutomationBangalore
  from "./pages/WhatsAppAutomationBangalore";
// Floating components
import FloatingButtons from "./components/floating/FloatingButtons";
import ExitIntentModal from "./components/floating/ExitIntentModal";
import VoiceAgent from "./components/voice/VoiceAgent";

export default function App() {
  return (
    <Router>
      {/* Manage SEO metadata for each route */}
      <SEOManager />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route
          path="/business-growth"
          element={<BusinessGrowth />}
        />
        <Route
          path="/quantum-weave"
          element={<QuantumWeave />}
        />
        <Route path="/ventures" element={<Ventures />} />
        <Route path="/academy" element={<Academy />} />

        {/* BrandMint AI Blog */}
        <Route path="/blog" element={<Blog />} />

        <Route path="/contact" element={<Contact />} />
        <Route
          path="/admin/leads"
          element={<AdminLeads />}
        />
        <Route
  path="/whatsapp-automation-bangalore"
  element={<WhatsAppAutomationBangalore />}
/>
      </Routes>

      {/* Existing floating components */}
      <FloatingButtons />
      <ExitIntentModal />
      <VoiceAgent />
    </Router>
  );
}
