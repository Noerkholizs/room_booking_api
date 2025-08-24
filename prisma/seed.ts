import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      password: "$2b$10$Y8rDtPEmcoDZorJr1elmoOU5nqKjHlqXPakfD5rW9apt4QOiYhQNG",
      role: "ADMIN",
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: "syaiful@example.com",
      name: "syaiful",
      password: "$2b$10$Y8rDtPEmcoDZorJr1elmoOU5nqKjHlqXPakfD5rW9apt4QOiYhQNG",
      role: "USER",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "nurkholis@example.com",
      name: "Nurkholis",
      password: "$2b$10$Y8rDtPEmcoDZorJr1elmoOU5nqKjHlqXPakfD5rW9apt4QOiYhQNG",
      role: "USER",
    },
  });

  const roomA = await prisma.room.create({
    data: {
      name: "Meeting Room A",
      description: "Large meeting room with projector",
      capacity: 12,
    },
  });

  const roomB = await prisma.room.create({
    data: {
      name: "Conference Room B",
      description: "Small conference room",
      capacity: 6,
    },
  });
  
  const roomC = await prisma.room.create({
    data: {
      name: "ClassRoom",
      description: "Large meeting room with projector",
      capacity: 12,
    },
  });

  await prisma.booking.create({
    data: {
      startTime: new Date("2025-08-21T09:00:00Z"),
      endTime: new Date("2025-08-21T10:00:00Z"),
      status: "SUBMIT",
      notes: "Team meeting",
      userId: user1.id,
      roomId: roomA.id,
    },
  });

  await prisma.booking.create({
    data: {
      startTime: new Date("2025-08-21T11:00:00Z"),
      endTime: new Date("2025-08-21T12:30:00Z"),
      status: "APPROVED",
      notes: "Client presentation",
      userId: user2.id,
      roomId: roomA.id,
    },
  });

  await prisma.booking.create({
    data: {
      startTime: new Date("2025-08-22T13:00:00Z"),
      endTime: new Date("2025-08-22T14:00:00Z"),
      status: "REJECTED",
      notes: "Brainstorming session",
      userId: user1.id,
      roomId: roomB.id,
    },
  });

  console.log("✅ Seeding finished!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
