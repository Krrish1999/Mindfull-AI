import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Instagram, Twitter, Facebook, Brain } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center">
              <div className="flex items-center justify-center bg-blue-600 w-8 h-8 rounded-md text-white mr-2">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">MindWell</span>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Empowering you on your mental health journey through accessible resources, professional support, and self-care tools.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/resources" className="text-gray-400 hover:text-blue-400 transition-colors">Articles</Link></li>
              <li><Link to="/resources" className="text-gray-400 hover:text-blue-400 transition-colors">Self-help</Link></li>
              <li><Link to="/resources" className="text-gray-400 hover:text-blue-400 transition-colors">Crisis Support</Link></li>
              <li><Link to="/resources" className="text-gray-400 hover:text-blue-400 transition-colors">Wellness Tips</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-blue-400 transition-colors">Contact</Link></li>
              <li><Link to="/careers" className="text-gray-400 hover:text-blue-400 transition-colors">Careers</Link></li>
              <li><Link to="/for-therapists" className="text-gray-400 hover:text-blue-400 transition-colors">For Therapists</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/accessibility" className="text-gray-400 hover:text-blue-400 transition-colors">Accessibility</Link></li>
              <li><Link to="/cookie-policy" className="text-gray-400 hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} MindWell. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 mt-2 md:mt-0 flex items-center">
            Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for mental well-being
          </p>
        </div>
      </div>
    </footer>
  );
};