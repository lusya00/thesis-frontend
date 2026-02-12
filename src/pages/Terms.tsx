import React from 'react';
import { FileText } from 'lucide-react';

const Terms = () => (
  <div className="min-h-screen bg-gradient-to-br from-white via-sand-light/20 to-ocean/5 relative overflow-hidden">
    {/* Hero Section */}
    <div className="relative h-64 flex items-center justify-center bg-gradient-to-r from-ocean via-ocean-dark to-cyan-900 mb-12">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      <div className="relative z-10 text-center">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <FileText className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white font-playfair mb-2">Terms of Service</h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">The rules and conditions for using Untung Jawa Island's website and services</p>
      </div>
    </div>
    {/* Main Content Card */}
    <div className="container mx-auto px-4 pb-16 flex justify-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-semibold text-ocean-dark mb-4">Bookings & Payments</h2>
        <ul className="list-disc ml-6 mb-6 text-gray-700">
          <li>All bookings are subject to availability and confirmation.</li>
          <li>Payment must be made in full to secure your reservation.</li>
          <li>Cancellations and refunds are subject to our cancellation policy.</li>
        </ul>
        <h2 className="text-2xl font-semibold text-ocean-dark mb-4">User Responsibilities</h2>
        <ul className="list-disc ml-6 mb-6 text-gray-700">
          <li>Provide accurate information when making a booking.</li>
          <li>Respect the property and community guidelines during your stay.</li>
          <li>Do not misuse the website or attempt unauthorized access.</li>
        </ul>
        <h2 className="text-2xl font-semibold text-ocean-dark mb-4">Liability</h2>
        <ul className="list-disc ml-6 mb-6 text-gray-700">
          <li>We are not liable for personal injury, loss, or damage during your stay.</li>
          <li>We reserve the right to modify these terms at any time.</li>
        </ul>
        <p className="mt-8 text-gray-700">For questions about these terms, contact us at <a href="mailto:info@untungjawa.com" className="text-ocean underline">info@untungjawa.com</a>.</p>
      </div>
    </div>
  </div>
);

export default Terms; 