
import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-ocean-dark text-white">
      <div className="wave-divider bg-white transform rotate-180"></div>
      
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Untung Jawa</h3>
            <p className="mb-4">
              Your island paradise escape, just a short boat ride away from Jakarta.
              Experience authentic island living in our community homestays.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://facebook.com/untungjawa" target="_blank" rel="noopener noreferrer" className="hover:text-ocean transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/untungjawa" target="_blank" rel="noopener noreferrer" className="hover:text-ocean transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/untungjawa" target="_blank" rel="noopener noreferrer" className="hover:text-ocean transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://youtube.com/@untungjawa" target="_blank" rel="noopener noreferrer" className="hover:text-ocean transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-ocean transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-ocean transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/homestays" className="hover:text-ocean transition-colors">Homestays</Link>
              </li>
              <li>
                <Link to="/activities" className="hover:text-ocean transition-colors">Activities</Link>
              </li>
              <li>
                <Link to="/conservation" className="hover:text-ocean transition-colors">Conservation</Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-ocean transition-colors">Map</Link>
              </li>
              <li>
                <a href="/contact" className="hover:text-ocean transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Homestay Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/homestays?category=beachfront" className="hover:text-ocean transition-colors">Beachfront Villas</Link>
              </li>
              <li>
                <Link to="/homestays?category=family" className="hover:text-ocean transition-colors">Family Homestays</Link>
              </li>
              <li>
                <Link to="/homestays?category=budget" className="hover:text-ocean transition-colors">Budget Options</Link>
              </li>
              <li>
                <Link to="/homestays?category=group" className="hover:text-ocean transition-colors">Group Accommodations</Link>
              </li>
              <li>
                <Link to="/homestays?category=premium" className="hover:text-ocean transition-colors">Premium Suites</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Untung Jawa Island, Kepulauan Seribu, North Jakarta, DKI Jakarta, Indonesia</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                <a href="tel:+6281234567890" className="hover:text-ocean transition-colors">+62 812-3456-7890</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                <a href="mailto:info@untungjawa.com" className="hover:text-ocean transition-colors">info@untungjawa.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/20 text-center md:text-left md:flex md:justify-between md:items-center">
          <p>&copy; 2025 Untung Jawa Island. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm mr-4 hover:text-ocean transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm mr-4 hover:text-ocean transition-colors">Terms of Service</Link>
            <Link to="/sitemap" className="text-sm hover:text-ocean transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
