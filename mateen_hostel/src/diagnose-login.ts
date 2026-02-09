import prisma from "./utils/prisma";
import { compare } from "./utils/bcrypt";

async function diagnose() {
    const email = "wotoliy458@izeao.com";
    const password = "password";

    console.log(`Checking user: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log("User NOT found in database.");
        return;
    }

    console.log("User found!");
    console.log(`ID: ${user.id}`);
    console.log(`Role: ${user.role}`);
    console.log(`DeletedAt: ${user.deletedAt}`);

    if (!user.password) {
        console.log("CRITICAL: User has NO password field in DB.");
    } else {
        console.log(`Password hash length: ${user.password.length}`);
        console.log(`Password starts with: ${user.password.substring(0, 10)}...`);

        const isMatch = await compare(password, user.password);
        console.log(`Manual comparison with 'password': ${isMatch}`);
    }
}

diagnose()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
