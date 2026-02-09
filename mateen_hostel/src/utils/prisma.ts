import { PrismaClient } from "@prisma/client"
import { withAccelerate } from "@prisma/extension-accelerate"

const prisma = new PrismaClient({
    log: ["query"]
}).$extends(withAccelerate());

export default prisma;