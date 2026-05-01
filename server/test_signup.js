async function test() {
  try {
    const res = await fetch('http://localhost:5001/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Admin',
        email: `admin_${Date.now()}@test.com`,
        password: 'password123',
        role: 'admin'
      })
    });
    const data = await res.json();
    console.log('Signup status:', res.status);
    console.log('Signup success:', data);
    
    // Test login
    const loginRes = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.user.email,
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    console.log('Login success:', loginData.user.role);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
