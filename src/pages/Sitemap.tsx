import React from 'react';
import { Map } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sitemap = () => (
  <div className="min-h-screen bg-gradient-to-br from-white via-sand-light/20 to-ocean/5 relative overflow-hidden">
    {/* Hero Section */}
    <div className="relative h-64 flex items-center justify-center bg-gradient-to-r from-ocean via-ocean-dark to-cyan-900 mb-12">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      <div className="relative z-10 text-center">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Map className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white font-playfair mb-2">Sitemap</h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">Explore all the main pages and sections of Untung Jawa Island's website</p>
      </div>
    </div>
    {/* Main Content Card */}
    <div className="container mx-auto px-4 pb-16 flex justify-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li><Link to="/" className="text-ocean underline">Home</Link></li>
          <li><Link to="/about" className="text-ocean underline">About Us</Link></li>
          <li><Link to="/homestays" className="text-ocean underline">Homestays</Link></li>
          <li><Link to="/activities" className="text-ocean underline">Activities</Link></li>
          <li><Link to="/map" className="text-ocean underline">Map</Link></li>
          <li><Link to="/contact" className="text-ocean underline">Contact</Link></li>
          <li><Link to="/privacy" className="text-ocean underline">Privacy Policy</Link></li>
          <li><Link to="/terms" className="text-ocean underline">Terms of Service</Link></li>
        </ul>
      </div>
    </div>
  </div>
);

export default Sitemap; 