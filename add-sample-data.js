// This script adds sample high profile call girls data to localStorage
// Run this in browser console on your app

const sampleHighProfileGirls = [
  {
    id: 'hp1',
    heading: 'Priya Sharma',
    description: 'Premium high-profile call girl in Jaipur. Available for both incall and outcall services. 100% satisfaction guaranteed.',
    location: 'Jaipur',
    contactNumber: '7878787878',
    images: ['https://picsum.photos/400/600?random=1'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'hp2', 
    heading: 'Ananya Verma',
    description: 'Elite Jaipur escort with stunning looks and charming personality. WhatsApp for booking and rates.',
    location: 'Jaipur',
    contactNumber: '7878787878',
    images: ['https://picsum.photos/400/600?random=2'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'hp3',
    heading: 'Kavya Singh',
    description: 'Beautiful high-profile call girl in Jaipur. Professional services with complete privacy and discretion.',
    location: 'Jaipur', 
    contactNumber: '7878787878',
    images: ['https://picsum.photos/400/600?random=3'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Save to localStorage
localStorage.setItem('blogify_high_profile_call_girls', JSON.stringify(sampleHighProfileGirls));
console.log('Sample high profile call girls data added to localStorage!');
