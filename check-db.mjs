import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('\n=== USERS IN DATABASE ===');
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
  console.table(users);

  console.log('\n=== SESSIONS IN DATABASE ===');
  const sessions = await prisma.session.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
  console.table(sessions);

  console.log('\n=== ACCOUNTS IN DATABASE ===');
  const accounts = await prisma.account.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
  console.table(accounts);

  console.log('\n=== TOTAL COUNTS ===');
  const userCount = await prisma.user.count();
  const sessionCount = await prisma.session.count();
  const accountCount = await prisma.account.count();
  
  console.log(`Total Users: ${userCount}`);
  console.log(`Total Sessions: ${sessionCount}`);
  console.log(`Total Accounts: ${accountCount}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
