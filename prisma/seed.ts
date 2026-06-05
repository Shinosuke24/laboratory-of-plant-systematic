import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const seedUsers = [
  {
    email: "admin@ugm.ac.id",
    name: "Admin Lab Sistematik Tumbuhan",
    role: Role.ADMIN,
  },
  {
    email: "asisten@ugm.ac.id",
    name: "Asisten Lab Sistematik Tumbuhan",
    role: Role.ASISTEN,
  },
  {
    email: "mahasiswa@ugm.ac.id",
    name: "Mahasiswa Lab Sistematik Tumbuhan",
    role: Role.MAHASISWA,
  },
];

async function main() {
  for (const user of seedUsers) {
    const result = await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, role: user.role },
      create: user,
    });
    console.log(`[seed] ${result.role.padEnd(10)} ${result.email}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
