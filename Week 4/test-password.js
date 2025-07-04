const bcrypt = require('bcryptjs');

async function testPassword() {
  // This is the expected hash for 'user123'
  const plainPassword = 'user123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  
  console.log('Plain password:', plainPassword);
  console.log('Hashed password:', hashedPassword);
  
  // Test if they match
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('Passwords match:', isMatch);
  
  // Test against what might be in the database
  const possibleHashes = [
    'password123', // original password
    'user123',     // expected password
  ];
  
  for (const pwd of possibleHashes) {
    const hash = await bcrypt.hash(pwd, 10);
    console.log(`\nTesting password: ${pwd}`);
    console.log(`Hash: ${hash}`);
    console.log(`Match with user123: ${await bcrypt.compare('user123', hash)}`);
  }
}

testPassword().catch(console.error);
