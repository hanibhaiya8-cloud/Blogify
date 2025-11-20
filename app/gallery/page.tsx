'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import UserProfileList from '../../components/UserProfileList';

export default function GalleryPage() {
  const router = useRouter();

  return (
    <div className=" bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="group mb-8 flex items-center text-purple-700 hover:text-pink-700 transition-all duration-300"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center mr-3 group-hover:bg-pink-100 group-hover:shadow-md transition-all duration-300">
            <ArrowLeft className="w-5 h-5 group-hover:scale-110 group-hover:text-pink-600 transition-transform" />
          </div>
          <span className="font-medium group-hover:translate-x-1 group-hover:font-semibold transition-transform">Back to Home</span>
        </button>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-800">
            All Profiles
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through all available profiles. Click on any profile to view more details.
          </p>
        </div>
        
        {/* Profile List */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
          <UserProfileList showAll={true} />
        </div>
      </div>

      {/* ==================== FOOTER SECTION ==================== */}
      <footer className="bg-gray-300 w-full mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 text-left py-10 gap-8 px-6">

          {/* Disclaimer */}
          <div>
            <h3 className="font-bold text-lg mb-3">Disclaimer</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Here you will get to see all pictures and details.  
              If you are below 18 then we strongly recommend you to  
              leave this website.
            </p>
          </div>

          {/* Contact Us */}
          <div id="contact-section">
            <h3 className="font-bold text-lg mb-3">Contact Us</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Phone: +91-7978431266 <br />
              Address: Jodhpur, India
            </p>
          </div>

          {/* India-wide Service */}
          <div>
            <h3 className="font-bold text-lg mb-3">We offer call girls service in Whole India</h3>
            <p className="text-gray-700 text-sm">Hanny Bhaiya</p>
          </div>

        </div>

        {/* Divider Line */}
        <div className="border-t border-gray-400"></div>

        {/* Copyright */}
        <div className="py-4 text-center text-sm text-gray-800 font-semibold">
          Copyright © 2025 Jodhpur Call Girls
        </div>
      </footer>
    </div>
  );
}
