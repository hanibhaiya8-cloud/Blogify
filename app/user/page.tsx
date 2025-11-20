"use client";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import dynamic from 'next/dynamic';
import { AdminLoginButton } from '../../components/AdminLoginButton';
import { isAdminAuthenticated } from '../../lib/auth';
import { EditableTable } from '../../components/EditableTable';
import { ExtraTables } from '../../components/ExtraTables';
import { FinalCallGirlsTable } from '../../components/FinalCallGirlsTable';
import VideoSection from '../../components/VideoSection';

const ReadOnlyAdminDashboard = dynamic(
  () => import('../../components/ReadOnlyAdminDashboard').then(mod => mod.ReadOnlyAdminDashboard),
  { ssr: false, loading: () => <div className="text-center py-10">Loading services...</div> }
);

const GalleryGrid = dynamic(() => import('../../components/GalleryGrid').then(mod => mod.default), {
  ssr: false,
  loading: () => <div>Loading gallery...</div>
});

// Dynamically import the HighProfileCallGirlsList component with SSR disabled
const HighProfileCallGirlsList = dynamic(() => import('../../components/HighProfileCallGirlsList'), {
  ssr: false,
});

function NoProfilesMessage() {
  const [hasProfiles, setHasProfiles] = React.useState(true);

  React.useEffect(() => {
    try {
      const profiles = JSON.parse(localStorage.getItem('blogify_profiles') || '[]');
      setHasProfiles(profiles.length > 0);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      setHasProfiles(true);
    }
  }, []);

  if (hasProfiles) return null;

  return (
    <div className="text-center py-10">
      <p className="text-gray-500 mb-4">No profiles available yet. Please check back later.</p>
    </div>
  );
}

export default function UserPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check admin status on client side
    isAdminAuthenticated();
  }, []);

  const scrollToService = useCallback(() => {
    const serviceSection = document.getElementById("services-table");
    if (serviceSection) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        serviceSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollToContact = useCallback(() => {
    const contactSection = document.getElementById("contact-section");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const scrollToGallery = useCallback(() => {
    const gallerySection = document.getElementById("gallery-section");
    if (gallerySection) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        gallerySection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 text-gray-900 relative">
      <AdminLoginButton />

      {/* ==================== MOBILE-OPTIMIZED NAVBAR ==================== */}
      <header className="bg-gradient-to-r from-white to-gray-50 p-4 shadow-md sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
            Honny Bhaiya
          </h1>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-2 lg:space-x-4">
            {["Home", "Gallery", "Service", "Contact Us"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  if (item === "Service") {
                    scrollToService();
                  } else if (item === "Home") {
                    scrollToTop();
                  } else if (item === "Contact Us") {
                    scrollToContact();
                  } else if (item === "Gallery") {
                    scrollToGallery();
                  }
                }}
                className={`px-4 py-2 font-medium rounded-full transition-all duration-300 transform hover:scale-105 cursor-pointer ${item === 'Home'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:from-purple-600 hover:to-pink-600'
                    : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <nav className="flex flex-col space-y-2 mt-3 px-4 pb-4">
            {["Home", "Gallery", "Service", "Contact Us"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setIsMenuOpen(false);
                  if (item === "Service") {
                    requestAnimationFrame(() => {
                      requestAnimationFrame(() => scrollToService());
                    });
                  } else if (item === "Home") {
                    requestAnimationFrame(() => {
                      requestAnimationFrame(() => scrollToTop());
                    });
                  } else if (item === "Contact Us") {
                    requestAnimationFrame(() => {
                      requestAnimationFrame(() => scrollToContact());
                    });
                  } else if (item === "Gallery") {
                    requestAnimationFrame(() => {
                      requestAnimationFrame(() => scrollToGallery());
                    });
                  }
                }}
                className="w-full text-left px-5 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white active:bg-pink-700 transition-all duration-300 shadow-lg text-lg touch-manipulation"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        {/* Dark Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0  z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto">

        {/* HERO HEADER */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-800 leading-tight">
          Jaipur Call Girls Hot Local Call Girl in Jaipur
        </h2>

        {/* ==================== ENHANCED VIDEO SECTION ==================== */}
        <VideoSection />

        {/* DESCRIPTION */}
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-purple-800">
          Rinky Walia Best Call Girl Service in Jaipur
        </h3>
        <p className="mb-8 text-gray-700 leading-relaxed text-base md:text-lg">
          If you want to have fun in India, one of the best places that comes to everyone’s mind is the city of India. Jaipur is a city with vibrant colours and people from different communities have migrated to Jaipur in search of jobs and opportunities. One such opportunity was of working as a call girl in Jaipur and making money, thus Jaipur has variety of call girls from different communities, ages and walks of life.
        </p>


        <h3 className="text-xl sm:text-2xl font-bold mb-3 text-purple-800">The Evolution of Call Girls in Jaipur – Rinkywalia.com</h3>
        <p className="mb-6 text-gray-700 leading-relaxed">
          Jaipur being the capital of India saw a rapid spike in need for <strong className="text-pink-600">call girls in Jaipur</strong>, previously when internet didn’t exist people used to visit girls in personal and then take services from them, but now with the onset of internet the youth is subjected to various girls online that are in short clothes, thus the youth now wants to experience what it feels like to have sex, therefore there is a huge spike in need for call girls services in Jaipur.
        </p>

        <h3 className="text-xl sm:text-2xl font-bold mb-3 text-pink-700">Common questions about Jaipur Call Girls</h3>
        <h3 className="text-lg sm:text-xl font-bold mb-2 text-purple-700">What are benefits of Jaipur Call Girl?</h3>
        <p className="mb-6 text-gray-700 leading-relaxed">
          are one of the best things that exist in this world for man, man in relationship tend to give their most times caring for their partner but the girl would just be with the man for his money and sexual pleasure, the moment she meets someone with more money and pleasure she will leave you, so instead of being in a caught up relationship you can just book a call girl Jaipur, she can be of your age, younger than you or a MILF, you can enjoy any girl you like with call girls.
        </p>

        <h3 className="text-lg sm:text-xl font-bold mb-2 text-purple-700">Am I safe with call girl Jaipur?</h3>
        <p className="mb-8 text-gray-700 leading-relaxed">
          These call girls take very proper care of their hygiene and as much as you care about your safety they also care about themselves, so they get regularly tested for any sexual disease, so they are free to have sex with anyone and make your time as well as their time worth it when both of you together get intimate in the bedroom to have fun.
        </p>

        {/* PROFILE CARDS */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center my-10 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-800">
          High-profile Jaipur Call Girls with WhatsApp numbers and 100% original photos
        </h2>

        <HighProfileCallGirlsList />

        <NoProfilesMessage />

        {/* GALLERY SECTION */}
        <div id="gallery-section" className="pt-20 -mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center my-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Choose Your Sexy Girl In a Single Touch
            </h2>
            <div className="bg-white/50 backdrop-blur-sm  shadow-xl border border-white/20">
              <GalleryGrid />
            </div>
          </div>
        </div>

        {/* CATEGORIES */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center my-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Different categories of Rinkywalia call girl Jaipur Choose
        </h2>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md mb-5 border border-purple-200">
            <p className="text-gray-700 leading-relaxed">
              <strong className="text-purple-700">Young Call Girls:</strong> Young call girls in Jaipur as the name suggests are the young girls that have recently started to work as call girls, these girls due to their lower age (still they have age of 20+) have not had sex many times so they are beginners, but you can train them and be their teacher when it comes to having fun time with them, you can teach them what positions are good and how to have sex for longer durations or what is it that a man likes the most during the fun times.
            </p>
          </div>
        ))}

        {/* DEMAND REASONS */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center my-12 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-red-600">
          Why is there a Growing Demand for Jaipur Call Girl
        </h2>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl shadow-md mb-5 border-l-4 border-purple-600">
            <p className="text-gray-800 font-medium">
              <strong className="text-purple-700">Online Accessibility:</strong>
              The youth now watches Instagram and other platforms day and night with the availability of internet, thus they come across various girls that are ready to show their body for some likes and views, these in turn makes this youth feel teased and now they have a unending urge to have sex as fast as they can, so this leads to them trying to have sex with call girls near Jaipur and experiencing what it feels like to have sex.
            </p>
          </div>
        ))}

        {/* SERVICES TABLE */}
        <div id="services-table" className="py-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Our Services
          </h2>
          <div className="mb-12">
            <EditableTable />
          </div>
          <Suspense fallback={<div className="text-center py-10">Loading services...</div>}>
            <ReadOnlyAdminDashboard
              profiles={[]} // This will be populated client-side
              searchTerm=""
            />
          </Suspense>
        </div>

        {/* PREMIUM MEMBERSHIP */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center my-12 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-red-600">
          What type of Cheap Call Girls in Jaipur you are looking for?
        </h2>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-teal-200">
            <h3 className="font-bold text-lg md:text-xl text-teal-700 mb-2">Premium Membership Services:</h3>
            <p className="text-gray-700 leading-relaxed">
              If you want a special and exclusive experience, some websites and agencies offer premium memberships. These special memberships give you access to top professionals, a more personal and easy booking process, and extra benefits. You might get priority scheduling, meaning you can book services before others. You may also receive VIP treatment, which means you’ll be treated with extra care and attention. Premium memberships are a great option for people who want high-quality service and a smoother experience.
            </p>
          </div>
        ))}

        {/* EXTRA TABLES */}
        <div className="py-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Extra Tables
          </h2>
          <ExtraTables />
        </div>

        {/* FINAL SECTION */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center my-12 bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-pink-600">
          100% Real Photos And Phone Numbers | Indian Call Girls Real Number 2024
        </h2>



        <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 md:p-8 rounded-2xl shadow-xl mb-10 border border-rose-200">
          <p className="text-base md:text-lg text-gray-800 mb-5 leading-relaxed">
            Welcome to our most popular and renowned call girl agency in Jaipur. If you are one of those tired of boring nights, we are here to help you. You are at the right place to enjoy adult pleasure. We bring you girls who can give you the ultimate sexual satisfaction. It’s time for you to build deep connections with high-class women. Our call girls are perfect and skilled at fulfilling your sexual desires.
          </p>
          <p className="text-base md:text-lg text-gray-800 leading-relaxed">
            They will leave you with no complaints. They are the best in bed, and you will always enjoy the time spent with them. They are ready to meet you tonight. So, what are you thinking about Jaipur? The call girls are available with real pictures. You can check their photos on our website. We also provide genuine phone numbers for Indian call girls. If you are looking for sexy girls in Jaipur, visit us, check the phone numbers, and connect directly with the call girls to enjoy your time.
          </p>
        </div>

        <div className="mb-8">
          <FinalCallGirlsTable />
        </div>
        {/* MULTIPLE HEADINGS */}
        <h3 className="text-xl sm:text-2xl font-bold mb-3 text-pink-700">Heading 1</h3>
        <p className="mb-6 text-sm md:text-base text-gray-600 leading-relaxed">
          Hyderabad Call Girls| Pune Call Girls| Noida Call Girls| Delhi Call Girls| Aerocity Call Girls| Mumbai Call Girls| Aerocity Call Girls| Jaipur Call Girls| Chennai Call Girls| Bangalore Call Girls| Goa Call Girls| Chandigarh Call Girls| Lucknow Call Girls| Dehradun Call Girls| Indore Call Girls| Jalandhar Call Girls| Rishikesh Call Girls| Manali Call Girls| Zirakpur Call Girls| Ludhiana Call Girls Ahmedabad Call Girls| Ajmer Call Girls| Allahabad Call Girls| Amritsar Call Girls| Aurangabad Call Girls| Bareilly Call Girls| Bhubaneswar Call Girls| Bilaspur Call Girls| Coimbatore Call Girls| Cuttack Call Girls| Darbhanga Call Girls| Darjeeling Call Girls| Dhanbad Call Girls| Gangtok Call Girls| Ghaziabad Call Girls| Ghazipur Call Girls| Gorakhpur Call Girls| Guwahati Call Girls| Andheri| Aerocity Call Girls| Bandra Call Girls| Bhopal Call Girls| Kanpur Call Girls| Surat Call Girls|Mohali Call Girls| Gwalior Call Girls| Haridwar Call Girls
        </p>

      </main>
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
              Address: Jaipur, India
            </p>
          </div>

          {/* India-wide Service */}
          <div>
            <h3 className="font-bold text-lg mb-3">We offer call girls service in Whole India</h3>
            <p className="text-gray-700 text-sm">Rinky Walia</p>
          </div>

        </div>

        {/* Divider Line */}
        <div className="border-t border-gray-400"></div>

        {/* Copyright */}
        <div className="py-4 text-center text-sm text-gray-800 font-semibold">
          Copyright © 2025 Jaipur Call Girls
        </div>
      </footer>

    </div>
  );
}