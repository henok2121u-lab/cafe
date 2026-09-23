import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// This script runs as a standalone Node process (via tsx), outside Next's
// webpack build, so it can't import lib/db.ts or lib/auth.ts: both pull in
// the `server-only` package, which unconditionally throws unless Next's
// bundler substitutes it away. It builds its own client instead.
const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "owner@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "change-me-after-first-login";

  await db.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: await hashPassword(adminPassword),
    },
  });
  console.log(`Admin user ready: ${adminEmail}`);

  await db.cafeSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "The Corner Café",
      address: "123 Main Street, Your City",
      phone: "+1 (555) 123-4567",
      email: "hello@example.com",
      openingHours: {
        mon: "7:00 - 18:00",
        tue: "7:00 - 18:00",
        wed: "7:00 - 18:00",
        thu: "7:00 - 18:00",
        fri: "7:00 - 20:00",
        sat: "8:00 - 20:00",
        sun: "8:00 - 16:00",
      },
      mapEmbedUrl: null,
      facebookUrl: null,
      instagramUrl: null,
    },
  });
  console.log("Café settings ready");

  const existingCategories = await db.category.count();
  if (existingCategories === 0) {
    const coffee = await db.category.create({
      data: { name: "Coffee", sortOrder: 0 },
    });
    const pastries = await db.category.create({
      data: { name: "Pastries", sortOrder: 1 },
    });

    await db.menuItem.createMany({
      data: [
        {
          categoryId: coffee.id,
          name: "Espresso",
          description: "Rich, concentrated shot of our house-blend beans.",
          price: 3.0,
          sortOrder: 0,
        },
        {
          categoryId: coffee.id,
          name: "Cappuccino",
          description: "Espresso with steamed milk and a thick layer of foam.",
          price: 4.5,
          sortOrder: 1,
        },
        {
          categoryId: coffee.id,
          name: "Latte",
          description: "Espresso with steamed milk, lightly foamed.",
          price: 4.75,
          sortOrder: 2,
        },
        {
          categoryId: pastries.id,
          name: "Butter Croissant",
          description: "Flaky, buttery, baked fresh every morning.",
          price: 3.5,
          sortOrder: 0,
        },
        {
          categoryId: pastries.id,
          name: "Blueberry Muffin",
          description: "Moist muffin loaded with fresh blueberries.",
          price: 3.75,
          sortOrder: 1,
        },
      ],
    });
    console.log("Starter categories and menu items created");
  } else {
    console.log("Categories already exist, skipping starter menu content");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
