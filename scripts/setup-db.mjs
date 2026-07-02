import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Checking SQLite database connection...");
  try {
    const userCount = await prisma.user.count();
    console.log(`Database connection successful! Current user count: ${userCount}`);
    
    // Test a write operation
    const testEmail = `test_${Date.now()}@example.com`;
    const tempUser = await prisma.user.create({
      data: {
        email: testEmail,
        name: "Database Test User",
      }
    });
    console.log(`Successfully created test user with ID: ${tempUser.id}`);
    
    // Clean up test data
    await prisma.user.delete({
      where: { id: tempUser.id }
    });
    console.log("Successfully cleaned up test user.");
    console.log("SQLite database via Prisma is fully operational!");
  } catch (error) {
    console.error("Database connection check failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
