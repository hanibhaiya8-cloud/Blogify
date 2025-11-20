// This script adds sample high profile call girls data to localStorage
// Run this in browser console on your app

const sampleHighProfileGirls = [
  {
    id: 'hp1',
    heading: 'Priya Sharma',
    description: 'Premium high-profile call girl in Jodhpur. Available for both incall and outcall services. 100% satisfaction guaranteed.',
    location: 'Jodhpur',
    contactNumber: '7878787878',
    images: ['https://picsum.photos/400/600?random=1'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'hp2', 
    heading: 'Ananya Verma',
    description: 'Elite Jodhpur escort with stunning looks and charming personality. WhatsApp for booking and rates.',
    location: 'Jodhpur',
    contactNumber: '7878787878',
    images: ['https://picsum.photos/400/600?random=2'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'hp3',
    heading: 'Kavya Singh',
    description: 'Beautiful high-profile call girl in Jodhpur. Professional services with complete privacy and discretion.',
    location: 'Jodhpur', 
    contactNumber: '7878787878',
    images: ['https://picsum.photos/400/600?random=3'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Save to localStorage
localStorage.setItem('blogify_high_profile_call_girls', JSON.stringify(sampleHighProfileGirls));
console.log('Sample high profile call girls data added to localStorage!');
