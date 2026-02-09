import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Get all users
  const users = await prisma.user.findMany();
  
  console.log(`Found ${users.length} users to update`);
  
  for (const user of users) {
    // Skip if name is already set
    if (user.name) continue;
    
    // Create a default name from email if no name is available
    const defaultName = user.email.split('@')[0];
    
    console.log(`Updating user ${user.email} with name: ${defaultName}`);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { name: defaultName }
    });
  }
  
  console.log('All users updated successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
