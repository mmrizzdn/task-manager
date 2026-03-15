/**
 * Test API response structure to debug data loading issues
 */

export async function testApiResponse() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    const response = await fetch('http://localhost:3001/tasks/my-tasks?page=1&limit=10', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

(window as any).testApiResponse = testApiResponse;
