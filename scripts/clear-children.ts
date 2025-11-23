import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Contagens antes:");
  console.log("Children:", await prisma.child.count());
  console.log("Sequences:", await prisma.sequence.count());
  console.log("ChildAccess:", await prisma.childAccess.count());
  console.log("Reports:", await prisma.report.count());

  // Deletar todas as children
  await prisma.child.deleteMany({});
  console.log("Todos os registros de Child removidos.");

  console.log("Contagens depois:");
  console.log("Children:", await prisma.child.count());
  console.log("Sequences:", await prisma.sequence.count());
  console.log("ChildAccess:", await prisma.childAccess.count());
  console.log("Reports:", await prisma.report.count());
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });