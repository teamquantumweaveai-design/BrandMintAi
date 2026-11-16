
import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

// SEO Manager
import SEOManager from "./components/SEOManager";

// Homepage loads immediately
import Home from "./pages/Home";

// Lazy-load secondary pages
const About = lazy(() => import("./pages/About"));

const Solutions = lazy(
  () => import("./pages/Solutions")
);

const BusinessGrowth = lazy(
  () => import("./pages/BusinessGrowth")
);

const QuantumWeave = lazy(
  () => import("./pages/QuantumWeave")
);

const Ventures = lazy(
  () => import("./pages/Ventures")
);

const Academy = lazy(
  () => import("./pages/Academy")
);

const Blog = lazy(
  () => import("./pages/Blog")
);

const Contact = lazy(
  () => import("./pages/Contact")
);

const AdminLeads = lazy(
  () => import("./pages/AdminLeads")
);

const WhatsAppAutomationBangalore = lazy(
  () => import("./pages/WhatsAppAutomationBangalore")
);

const AIAgentsBangalore = lazy(
  () => import("./pages/AIAgentsBangalore")
);

// Existing floating components
import FloatingButtons from "./components/floating/FloatingButtons";
import ExitIntentModal from "./components/floating/ExitIntentModal";
import VoiceAgent from "./components/voice/VoiceAgent";

// Accessible loading fallback
function PageLoading() {
  return (
    <main
      className="min-h-screen flex items-center justify-center bg-[#F8F9FA]"
      role="status"
      aria-live="polite"
    >
      <p className="text-[#516F90] text-sm">
        Loading page...
      </p>
    </main>
  );
}

export default function App() {
  return (
    <Router>
      {/* Manage SEO metadata for each route */}
      <SEOManager />

      {/* Lazy-loaded pages */}
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/solutions"
            element={<Solutions />}
          />

          <Route
            path="/business-growth"
            element={<BusinessGrowth />}
          />

          <Route
            path="/quantum-weave"
            element={<QuantumWeave />}
          />

          <Route
            path="/ventures"
            element={<Ventures />}
          />

          <Route
            path="/academy"
            element={<Academy />}
          />

          {/* BrandMint AI Blog */}
          <Route
            path="/blog"
            element={<Blog />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          {/* Existing Admin Leads route */}
          <Route
            path="/admin/leads"
            element={<AdminLeads />}
          />

          {/* WhatsApp Automation Landing Page */}
          <Route
            path="/whatsapp-automation-bangalore"
            element={<WhatsAppAutomationBangalore />}
          />

          {/* AI Agents Bangalore Landing Page */}
          <Route
            path="/ai-agents-bangalore"
            element={<AIAgentsBangalore />}
          />
        </Routes>
      </Suspense>

      {/* Existing floating components */}
      <FloatingButtons />
      <ExitIntentModal />
      <VoiceAgent />
    </Router>
  );
}
