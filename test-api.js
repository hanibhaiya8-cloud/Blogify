// Test script to verify API endpoints
// Run this in browser console when your app is running

async function testHighProfileAPI() {
  console.log('Testing High Profile Call Girls API...');
  
  try {
    // Test GET all
    console.log('1. Testing GET /api/high-profile-call-girls');
    const getAllResponse = await fetch('/api/high-profile-call-girls');
    const allProfiles = await getAllResponse.json();
    console.log('GET all response:', allProfiles);
    
    // Test POST (create new profile)
    console.log('2. Testing POST /api/high-profile-call-girls');
    const newProfile = {
      heading: 'Test Girl',
      description: 'Test description for API',
      location: 'Jaipur',
      contactNumber: '7878787878',
      images: ['https://picsum.photos/400/600?random=999']
    };
    
    const createResponse = await fetch('/api/high-profile-call-girls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProfile),
    });
    
    const createdProfile = await createResponse.json();
    console.log('POST response:', createdProfile);
    
    if (createdProfile._id) {
      // Test GET single
      console.log('3. Testing GET /api/high-profile-call-girls/[id]');
      const getSingleResponse = await fetch(`/api/high-profile-call-girls/${createdProfile._id}`);
      const singleProfile = await getSingleResponse.json();
      console.log('GET single response:', singleProfile);
      
      // Test PUT (update)
      console.log('4. Testing PUT /api/high-profile-call-girls/[id]');
      const updateData = { heading: 'Updated Test Girl' };
      
      const updateResponse = await fetch(`/api/high-profile-call-girls/${createdProfile._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const updatedProfile = await updateResponse.json();
      console.log('PUT response:', updatedProfile);
      
      // Test DELETE
      console.log('5. Testing DELETE /api/high-profile-call-girls/[id]');
      const deleteResponse = await fetch(`/api/high-profile-call-girls/${createdProfile._id}`, {
        method: 'DELETE',
      });
      
      const deleteResult = await deleteResponse.json();
      console.log('DELETE response:', deleteResult);
    }
    
    console.log('✅ API tests completed!');
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

// Run the test
testHighProfileAPI();
