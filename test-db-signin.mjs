import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  console.log('[v0] Testing database connection...');
  
  // Test 1: Check if User table exists and accessible
  console.log('[v0] Querying User table...');
  const users = await prisma.user.findMany({ take: 3 });
  console.log('[v0] Users found:', users.length);
  console.log('[v0] Sample users:', users.map(u => ({ id: u.id, email: u.email, role: u.role })));
  
  // Test 2: Check Account table
  console.log('[v0] Querying Account table...');
  const accounts = await prisma.account.findMany({ take: 3 });
  console.log('[v0] Accounts found:', accounts.length);
  
  // Test 3: Check Session table
  console.log('[v0] Querying Session table...');
  const sessions = await prisma.session.findMany({ take: 3 });
  console.log('[v0] Sessions found:', sessions.length);
  
  // Test 4: Try to create a test user
  console.log('[v0] Testing user creation...');
  const testUser = await prisma.user.upsert({
    where: { email: 'test-oauth-callback@example.com' },
    update: { name: 'Test User Updated' },
    create: {
      email: 'test-oauth-callback@example.com',
      name: 'Test User',
    },
  });
  console.log('[v0] User create/update successful:', testUser.id, testUser.email);
  
  console.log('[v0] All database tests PASSED!');
} catch (error) {
  console.error('[v0] DATABASE ERROR:', error.message);
  console.error('[v0] Error code:', error.code);
  console.error('[v0] Stack:', error.stack);
} finally {
  await prisma.$disconnect();
}
