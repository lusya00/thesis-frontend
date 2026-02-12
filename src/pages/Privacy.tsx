import React from 'react';
import { Shield } from 'lucide-react';

const Privacy = () => (
  <div className="min-h-screen bg-gradient-to-br from-white via-sand-light/20 to-ocean/5 relative overflow-hidden">
    {/* Hero Section */}
    <div className="relative h-64 flex items-center justify-center bg-gradient-to-r from-ocean via-ocean-dark to-cyan-900 mb-12">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      <div className="relative z-10 text-center">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Shield className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white font-playfair mb-2">Privacy Policy</h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">How we collect, use, and protect your information at Untung Jawa Island</p>
      </div>
    </div>
    {/* Main Content Card */}
    <div className="container mx-auto px-4 pb-16 flex justify-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-semibold text-ocean-dark mb-4">Information We Collect</h2>
        <ul className="list-disc ml-6 mb-6 text-gray-700">
          <li>Personal identification information (Name, email address, phone number, etc.)</li>
          <li>Booking and payment details</li>
          <li>Usage data and cookies</li>
        </ul>
        <h2 className="text-2xl font-semibold text-ocean-dark mb-4">How We Use Your Information</h2>
        <ul className="list-disc ml-6 mb-6 text-gray-700">
          <li>To process bookings and payments</li>
          <li>To communicate with you about your reservations</li>
          <li>To improve our website and services</li>
          <li>To comply with legal obligations</li>
        </ul>
        <h2 className="text-2xl font-semibold text-ocean-dark mb-4">Your Rights</h2>
        <ul className="list-disc ml-6 mb-6 text-gray-700">
          <li>You can request access to or deletion of your personal data</li>
          <li>You can opt out of marketing communications at any time</li>
        </ul>
        <p className="mt-8 text-gray-700">For questions about this policy, contact us at <a href="mailto:info@untungjawa.com" className="text-ocean underline">info@untungjawa.com</a>.</p>
      </div>
    </div>
  </div>
);

export default Privacy; 