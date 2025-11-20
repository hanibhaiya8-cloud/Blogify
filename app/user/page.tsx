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
          Jodhpur Call Girls Hot Local Call Girl in Jodhpur
        </h2>

        {/* ==================== ENHANCED VIDEO SECTION ==================== */}
        <VideoSection />

        {/* DESCRIPTION */}
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-purple-800">
          Hanny Bhaiya Best Call Girl Service in Jodhpur
        </h3>
        <p className="mb-8 text-gray-700 leading-relaxed text-base md:text-lg">
          If you want to have fun in India, one of the best places that comes to everyone’s mind is the city of India. Jodhpur is a city with vibrant colours and people from different communities have migrated to Jodhpur in search of jobs and opportunities. One such opportunity was of working as a call girl in Jodhpur and making money, thus Jodhpur has variety of call girls from different communities, ages and walks of life.
        </p>


        <h3 className="text-xl sm:text-2xl font-bold mb-3 text-purple-800">The Evolution of Call Girls in Jodhpur – CallGirlJodhpur.com</h3>
        <p className="mb-6 text-gray-700 leading-relaxed">
          Jodhpur being the capital of India saw a rapid spike in need for <strong className="text-pink-600">call girls in Jodhpur</strong>, previously when internet didn’t exist people used to visit girls in personal and then take services from them, but now with the onset of internet the youth is subjected to various girls online that are in short clothes, thus the youth now wants to experience what it feels like to have sex, therefore there is a huge spike in need for call girls services in Jodhpur.
        </p>

        <h3 className="text-xl sm:text-2xl font-bold mb-3 text-pink-700">Common questions about Jodhpur Call Girls</h3>
        <h3 className="text-lg sm:text-xl font-bold mb-2 text-purple-700">What are benefits of Jodhpur Call Girl?</h3>
        <p className="mb-6 text-gray-700 leading-relaxed">
          are one of the best things that exist in this world for man, man in relationship tend to give their most times caring for their partner but the girl would just be with the man for his money and sexual pleasure, the moment she meets someone with more money and pleasure she will leave you, so instead of being in a caught up relationship you can just book a call girl Jodhpur, she can be of your age, younger than you or a MILF, you can enjoy any girl you like with call girls.
        </p>

        <h3 className="text-lg sm:text-xl font-bold mb-2 text-purple-700">Am I safe with call girl Jodhpur?</h3>
        <p className="mb-8 text-gray-700 leading-relaxed">
          These call girls take very proper care of their hygiene and as much as you care about your safety they also care about themselves, so they get regularly tested for any sexual disease, so they are free to have sex with anyone and make your time as well as their time worth it when both of you together get intimate in the bedroom to have fun.
        </p>

        {/* PROFILE CARDS */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center my-10 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-800">
          High-profile Jodhpur Call Girls with WhatsApp numbers and 100% original photos
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
          Different categories of Hanny Bhaiya call girl Jodhpur Choose
        </h2>
        {[
          {
            title: "Young Call Girls",
            description: "Young call girls in Jodhpur as the name suggests are the young girls that have recently started to work as call girls, these girls due to their lower age (still they have age of 20+) have not had sex many times so they are beginners, but you can train them and be their teacher when it comes to having fun time with them, you can teach them what positions are good and how to have sex for longer durations or what is it that a man likes the most during the fun times."
          },
          {
            title: "MILF Call Girls",
            description: "MILF call girls in Jodhpur are no joke! These girls are highly experienced in their art and they know how to make you feel satisfied multiple times, they have served more than 100+ clients and they are very thick and curvy in terms of the structure of their bodies, if you are lucky enough you can get a lactating MILF that can even let you drink her milk straight from her boobs."
          },
          {
            title: "VIP Call Girls",
            description: "VIP Call girls Jodhpur are the highest of the highest class. They are pure luxury and they maintain professionalism when meeting the client, these call girls are expensive and only meet at expensive hotels and they charge much higher fees than the other girls, this fees is reflected in their performance on the bed because they are very talented in bed."
          }
        ].map((category, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md mb-5 border border-purple-200">
            <p className="text-gray-700 leading-relaxed">
              <strong className="text-purple-700">{category.title}:</strong> {category.description}
            </p>
          </div>
        ))}

        {/* INCALL & OUTCALL SERVICES */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl shadow-md mb-10 border-l-4 border-indigo-600 mt-12">
          <p className="text-gray-800 leading-relaxed">
            At our Jodhpur call girl agency, you will find both incall and outcall services. For incall services, you can visit the location decided by the girls. For outcall services, the girls will come to the location you specify. Both experiences are safe and secure, ensuring your enjoyment. Our call girls will come to you with home delivery services for your convenience.
          </p>
        </div>

        {/* DEMAND REASONS */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center my-12 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-red-600">
          Why is there a Growing Demand for Jodhpur Call Girl
        </h2>
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md mb-5 border border-purple-200">
          <p className="text-center text-xl sm:text-2xl text-gray-800 font-medium mb-8 leading-relaxed">
            In recent years the call for Jodhpur Call Girl has seen a large increase.<br />
            This surge can be attributed to several elements:
          </p>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl shadow-md border-l-4 border-purple-600">
              <p className="text-gray-800 leading-relaxed">
                <strong className="text-purple-700">Online Accessibility:</strong> The youth now watches Instagram and other platforms day and night with the availability of internet, thus they come across various girls that are ready to show their body for some likes and views, these in turn makes this youth feel teased and now they have a unending urge to have sex as fast as they can, so this leads to them trying to have sex with call girls near Jodhpur and experiencing what it feels like to have sex.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl shadow-md border-l-4 border-purple-600">
              <p className="text-gray-800 leading-relaxed">
                <strong className="text-purple-700">Urbanization:</strong> With urbanization, Jodhpur has changed tenfold, there are various spaces where people can stay at cheap rates also it has lead to more apartments and big societies that can house tens and thousands of people in one small area with houses stacked on top of each another leading to increase in population rapidly.
              </p>
            </div>
          </div>
        </div>

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
          What type of Cheap Call Girls in Jodhpur you are looking for?
        </h2>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-teal-200">
            <h3 className="font-bold text-lg md:text-xl text-teal-700 mb-3">Premium Membership Services:</h3>
            <p className="text-gray-700 leading-relaxed">
              You want a special and exclusive experience, some websites and agencies offer premium memberships. These special memberships give you access to top professionals, a more personal and easy booking process, and extra benefits. You might get priority scheduling, meaning you can book services before others. You may also receive VIP treatment, which means you'll be treated with extra care and attention. Premium memberships are a great option for people who want high-quality service and a smoother experience.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-teal-200">
            <h3 className="font-bold text-lg md:text-xl text-teal-700 mb-3">Reviews and Testimonials:</h3>
            <p className="text-gray-700 leading-relaxed">
              Customer reviews and feedback are very important in this industry. Many websites in Jodhpur have detailed reviews where people share their experiences. These reviews talk about the quality of service, how professional the providers are, and the overall experience. They help new customers choose the best service and also give providers useful feedback to improve their work.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-teal-200">
            <h3 className="font-bold text-lg md:text-xl text-teal-700 mb-3">Customized and Personalized Services:</h3>
            <p className="text-gray-700 leading-relaxed">
              Many platforms offer customized services to match clients' preferences. Clients can filter options based on location, availability, and specific needs. Some providers also offer personalized experiences, ensuring a comfortable and satisfying service. This level of customization makes it easier for people to find exactly what they are looking for.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-teal-200">
            <h3 className="font-bold text-lg md:text-xl text-teal-700 mb-3">Loyalty Programs and Discounts:</h3>
            <p className="text-gray-700 leading-relaxed">
              To attract and retain customers, many websites and agencies in Jodhpur offer loyalty programs. Frequent users can earn points, discounts, or special offers after multiple bookings. Some services provide referral programs, where clients get rewards for recommending the platform to friends. These programs help make services more affordable and appealing.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-teal-200">
            <h3 className="font-bold text-lg md:text-xl text-teal-700 mb-3">Verified and Professional Service Providers:</h3>
            <p className="text-gray-700 leading-relaxed">
              To ensure quality and trust, many platforms verify their service providers. This includes background checks, certification verification, and customer ratings. Verified profiles give clients confidence that they are choosing experienced and professional providers. Some websites even display badges or certifications to highlight trusted professionals.
            </p>
          </div>
        </div>

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
            Welcome to our most popular and renowned call girl agency in Jodhpur. If you are one of those tired of boring nights, we are here to help you. You are at the right place to enjoy adult pleasure. We bring you girls who can give you the ultimate sexual satisfaction. It’s time for you to build deep connections with high-class women. Our call girls are perfect and skilled at fulfilling your sexual desires.
          </p>
          <p className="text-base md:text-lg text-gray-800 leading-relaxed">
            They will leave you with no complaints. They are the best in bed, and you will always enjoy the time spent with them. They are ready to meet you tonight. So, what are you thinking about Jodhpur? The call girls are available with real pictures. You can check their photos on our website. We also provide genuine phone numbers for Indian call girls. If you are looking for sexy girls in Jodhpur, visit us, check the phone numbers, and connect directly with the call girls to enjoy your time.
          </p>
        </div>

        <div className="mb-8">
          <FinalCallGirlsTable />
        </div>
        {/* CITY LINKS SECTION */}
        <div className="mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Find Call Girls in Top Cities Across India
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
            {[
              'Hyderabad', 'Pune', 'Noida', 'Delhi', 'Aerocity', 'Mumbai', 'Chennai', 
              'Bangalore', 'Goa', 'Chandigarh', 'Lucknow', 'Dehradun', 'Indore', 
              'Jalandhar', 'Rishikesh', 'Manali', 'Zirakpur', 'Ludhiana', 'Ahmedabad',
              'Ajmer', 'Allahabad', 'Amritsar', 'Aurangabad', 'Bareilly', 'Bhubaneswar',
              'Bilaspur', 'Coimbatore', 'Cuttack', 'Darbhanga', 'Darjeeling', 'Dhanbad',
              'Gangtok', 'Ghaziabad', 'Ghazipur', 'Gorakhpur', 'Guwahati', 'Andheri',
              'Bandra', 'Bhopal', 'Kanpur', 'Surat', 'Mohali', 'Gwalior', 'Haridwar'
            ].map((city, index) => (
              <a 
                key={index}
                href={`/${city.toLowerCase().replace(/\s+/g, '-')}-call-girls`}
                className="block text-center px-3 py-2 bg-white/80 hover:bg-pink-50 text-gray-700 hover:text-pink-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-pink-200 text-sm font-medium"
              >
                {city} Call Girls
              </a>
            ))}
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-6">
            Explore our premium services in these top cities across India
          </p>
        </div>

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
          Copyright © 2015 Jodhpur Call Girls
        </div>
      </footer>

    </div>
  );
}