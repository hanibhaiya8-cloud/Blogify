// Test script to verify ALL API endpoints (both regular profiles and high profile call girls)
// Run this in browser console when your app is running

async function testAllAPIs() {
  console.log('🧪 Testing All APIs...');
  
  // Test Regular Profiles API
  console.log('\n📋 Testing Regular Profiles API...');
  
  try {
    // Test GET all regular profiles
    console.log('1. Testing GET /api/profiles');
    const getAllProfilesResponse = await fetch('/api/profiles');
    const allProfiles = await getAllProfilesResponse.json();
    console.log('GET all profiles response:', allProfiles);
    
    // Test POST (create new regular profile)
    console.log('2. Testing POST /api/profiles');
    const newProfile = {
      heading: 'Test Regular Girl',
      description: 'Test description for regular profile API',
      location: 'Jaipur',
      contactNumber: '9876543210',
      images: ['https://picsum.photos/400/600?random=888']
    };
    
    const createProfileResponse = await fetch('/api/profiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProfile),
    });
    
    const createdProfile = await createProfileResponse.json();
    console.log('POST profile response:', createdProfile);
    
    if (createdProfile._id) {
      // Test DELETE regular profile
      console.log('3. Testing DELETE /api/profiles/[id]');
      const deleteProfileResponse = await fetch(`/api/profiles/${createdProfile._id}`, {
        method: 'DELETE',
      });
      
      const deleteProfileResult = await deleteProfileResponse.json();
      console.log('DELETE profile response:', deleteProfileResult);
    }
    
    console.log('✅ Regular Profiles API tests completed!');
  } catch (error) {
    console.error('❌ Regular Profiles API test failed:', error);
  }
  
  // Test High Profile Call Girls API
  console.log('\n👑 Testing High Profile Call Girls API...');
  
  try {
    // Test GET all high profile call girls
    console.log('1. Testing GET /api/high-profile-call-girls');
    const getAllHighProfilesResponse = await fetch('/api/high-profile-call-girls');
    const allHighProfiles = await getAllHighProfilesResponse.json();
    console.log('GET all high profiles response:', allHighProfiles);
    
    // Test POST (create new high profile)
    console.log('2. Testing POST /api/high-profile-call-girls');
    const newHighProfile = {
      heading: 'Test High Profile Girl',
      description: 'Test description for high profile API',
      location: 'Jaipur',
      contactNumber: '7878787878',
      images: ['https://picsum.photos/400/600?random=999']
    };
    
    const createHighProfileResponse = await fetch('/api/high-profile-call-girls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newHighProfile),
    });
    
    const createdHighProfile = await createHighProfileResponse.json();
    console.log('POST high profile response:', createdHighProfile);
    
    if (createdHighProfile._id) {
      // Test GET single high profile
      console.log('3. Testing GET /api/high-profile-call-girls/[id]');
      const getSingleHighResponse = await fetch(`/api/high-profile-call-girls/${createdHighProfile._id}`);
      const singleHighProfile = await getSingleHighResponse.json();
      console.log('GET single high profile response:', singleHighProfile);
      
      // Test PUT (update high profile)
      console.log('4. Testing PUT /api/high-profile-call-girls/[id]');
      const updateHighData = { heading: 'Updated Test High Profile Girl' };
      
      const updateHighResponse = await fetch(`/api/high-profile-call-girls/${createdHighProfile._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateHighData),
      });
      
      const updatedHighProfile = await updateHighResponse.json();
      console.log('PUT high profile response:', updatedHighProfile);
      
      // Test DELETE high profile
      console.log('5. Testing DELETE /api/high-profile-call-girls/[id]');
      const deleteHighResponse = await fetch(`/api/high-profile-call-girls/${createdHighProfile._id}`, {
        method: 'DELETE',
      });
      
      const deleteHighResult = await deleteHighResponse.json();
      console.log('DELETE high profile response:', deleteHighResult);
    }
    
    console.log('✅ High Profile Call Girls API tests completed!');
  } catch (error) {
    console.error('❌ High Profile Call Girls API test failed:', error);
  }
  
  console.log('\n🎉 All API tests completed!');
}

// Run the test
testAllAPIs();
