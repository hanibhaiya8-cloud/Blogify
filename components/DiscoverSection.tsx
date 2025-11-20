import Link from 'next/link';
import { Users, MessageCircle, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: <Users className="w-8 h-8 text-purple-500" />,
    title: 'Diverse Profiles',
    description: 'Connect with professionals from various fields'
  },
  {
    icon: <MessageCircle className="w-8 h-8 text-purple-500" />,
    title: 'Easy Contact',
    description: 'Reach out directly via WhatsApp'
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-purple-500" />,
    title: 'Verified Profiles',
    description: 'All profiles are carefully curated'
  }
];

export default function DiscoverSection({ profileCount = 6 }) {
  return (
    <section className="bg-gradient-to-b from-purple-50 to-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Discover Amazing People
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with professionals from various fields and find the perfect match for your needs.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200">
            <Link href="/user" className="flex items-center">
              Browse Profiles
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20">
                {profileCount} profiles available
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
