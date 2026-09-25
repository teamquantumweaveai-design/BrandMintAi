import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import pages
import Home from "./pages/Home";
import About from "./pages/About";
import Solutions from "./pages/Solutions";
import BusinessGrowth from "./pages/BusinessGrowth";
import QuantumWeave from "./pages/QuantumWeave";
import Ventures from "./pages/Ventures";
import Academy from "./pages/Academy";
import Contact from "./pages/Contact";
import AdminLeads from "./pages/AdminLeads";
import FloatingButtons from "./components/floating/FloatingButtons";
import ExitIntentModal from "./components/floating/ExitIntentModal";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/business-growth" element={<BusinessGrowth />} />
        <Route path="/quantum-weave" element={<QuantumWeave />} />
        <Route path="/ventures" element={<Ventures />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/leads" element={<AdminLeads />} />
      </Routes>
      <FloatingButtons />
      <ExitIntentModal />
    </Router>
  );
}

