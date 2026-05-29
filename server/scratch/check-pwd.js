const bcrypt = require('bcryptjs');

const hash = '$2b$10$3VtQ4aHKvWrK8uvmawnEDOO416bC3tVotuJg3g0hyNBDqYFGZLpSe';

const candidates = [
  'Admin@123',
  '123456',
  '12345678',
  'admin123',
  'admin',
  'password',
  'superadmin',
  'Admin123',
  '123456aA@'
];

console.log('Testing hash:', hash);
candidates.forEach(pwd => {
  const isMatch = bcrypt.compareSync(pwd, hash);
  console.log(`Password "${pwd}":`, isMatch);
});
