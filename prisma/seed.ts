import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { hash } from "bcryptjs";
import path from "path";

const adapter = new PrismaLibSql({
  url: `file:${path.join(process.cwd(), "dev.db")}`,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.statusUpdate.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.creditApplication.deleteMany();
  await prisma.document.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();
  await prisma.dealership.deleteMany();

  // Create dealerships
  const dealership1 = await prisma.dealership.create({
    data: {
      name: "Sunset Motors",
      address: "1234 Main Street",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      phone: "(310) 555-0100",
      email: "info@sunsetmotors.com",
    },
  });

  const dealership2 = await prisma.dealership.create({
    data: {
      name: "Pacific Auto Group",
      address: "5678 Coast Highway",
      city: "San Diego",
      state: "CA",
      zip: "92101",
      phone: "(619) 555-0200",
      email: "info@pacificauto.com",
    },
  });

  console.log(`Created dealerships: ${dealership1.name}, ${dealership2.name}`);

  // Create demo dealer user
  const dealerPassword = await hash("dealer123", 12);
  await prisma.user.create({
    data: {
      email: "dealer@sunsetmotors.com",
      passwordHash: dealerPassword,
      firstName: "Sarah",
      lastName: "Martinez",
      phone: "(310) 555-0101",
      role: "DEALER",
      dealershipId: dealership1.id,
    },
  });
  console.log("Created dealer user: dealer@sunsetmotors.com / dealer123");

  // Create demo customer user
  const customerPassword = await hash("customer123", 12);
  await prisma.user.create({
    data: {
      email: "customer@example.com",
      passwordHash: customerPassword,
      firstName: "Jordan",
      lastName: "Chen",
      phone: "(213) 555-0300",
      role: "CUSTOMER",
    },
  });
  console.log("Created customer user: customer@example.com / customer123");

  // Create vehicles
  const vehicles = [
    {
      year: 2025,
      make: "Toyota",
      model: "Camry",
      trim: "XSE",
      vin: "1TOYOTA2025CAMRYX",
      msrp: 32000,
      salePrice: 31500,
      residualPct: 0.55,
      moneyFactor: 0.00125,
      exteriorColor: "Midnight Black",
      interiorColor: "Red Leather",
      mileage: 12,
      bodyType: "Sedan",
      fuelType: "Gas",
      status: "AVAILABLE",
      dealershipId: dealership1.id,
    },
    {
      year: 2025,
      make: "Honda",
      model: "CR-V",
      trim: "Sport Touring",
      vin: "2HONDA2025CRVSPRT",
      msrp: 39000,
      salePrice: 38500,
      residualPct: 0.58,
      moneyFactor: 0.0011,
      exteriorColor: "Canyon River Blue",
      interiorColor: "Black Leather",
      mileage: 8,
      bodyType: "SUV",
      fuelType: "Hybrid",
      status: "AVAILABLE",
      dealershipId: dealership1.id,
    },
    {
      year: 2025,
      make: "Tesla",
      model: "Model 3",
      trim: "Long Range",
      vin: "3TESLA2025MDL3LRG",
      msrp: 42000,
      salePrice: 42000,
      residualPct: 0.52,
      moneyFactor: 0.0015,
      exteriorColor: "Pearl White",
      interiorColor: "White Vegan Leather",
      mileage: 5,
      bodyType: "Sedan",
      fuelType: "Electric",
      status: "AVAILABLE",
      dealershipId: dealership1.id,
    },
    {
      year: 2025,
      make: "BMW",
      model: "X3",
      trim: "xDrive30i",
      vin: "4BMW20252X3XDRV30",
      msrp: 49500,
      salePrice: 48000,
      residualPct: 0.56,
      moneyFactor: 0.00145,
      exteriorColor: "Alpine White",
      interiorColor: "Cognac Leather",
      mileage: 15,
      bodyType: "SUV",
      fuelType: "Gas",
      status: "AVAILABLE",
      dealershipId: dealership1.id,
    },
    {
      year: 2024,
      make: "Ford",
      model: "Mustang Mach-E",
      trim: "Premium",
      vin: "5FORD2024MACHE_PR",
      msrp: 48000,
      salePrice: 46500,
      residualPct: 0.5,
      moneyFactor: 0.0013,
      exteriorColor: "Rapid Red",
      interiorColor: "Black ActiveX",
      mileage: 200,
      bodyType: "SUV",
      fuelType: "Electric",
      status: "AVAILABLE",
      dealershipId: dealership1.id,
    },
    {
      year: 2025,
      make: "Hyundai",
      model: "Tucson",
      trim: "Limited",
      vin: "6HYUNDAI25TUCLMTD",
      msrp: 37500,
      salePrice: 36800,
      residualPct: 0.54,
      moneyFactor: 0.001,
      exteriorColor: "Amazon Gray",
      interiorColor: "Taupe Leather",
      mileage: 22,
      bodyType: "SUV",
      fuelType: "Hybrid",
      status: "AVAILABLE",
      dealershipId: dealership2.id,
    },
    {
      year: 2025,
      make: "Mazda",
      model: "CX-50",
      trim: "Turbo Premium Plus",
      vin: "7MAZDA2025CX50TPP",
      msrp: 43000,
      salePrice: 42200,
      residualPct: 0.53,
      moneyFactor: 0.00115,
      exteriorColor: "Soul Red Crystal",
      interiorColor: "Terracotta Leather",
      mileage: 10,
      bodyType: "SUV",
      fuelType: "Gas",
      status: "AVAILABLE",
      dealershipId: dealership2.id,
    },
    {
      year: 2025,
      make: "Kia",
      model: "EV6",
      trim: "GT-Line",
      vin: "8KIA2025EV6GTLINE",
      msrp: 52000,
      salePrice: 51000,
      residualPct: 0.48,
      moneyFactor: 0.0014,
      exteriorColor: "Yacht Blue",
      interiorColor: "Gray-Green",
      mileage: 0,
      bodyType: "SUV",
      fuelType: "Electric",
      status: "AVAILABLE",
      dealershipId: dealership2.id,
    },
    {
      year: 2025,
      make: "Lexus",
      model: "ES",
      trim: "350 F Sport",
      vin: "9LEXUS2025ES350FS",
      msrp: 46500,
      salePrice: 45800,
      residualPct: 0.57,
      moneyFactor: 0.00105,
      exteriorColor: "Nori Green Pearl",
      interiorColor: "Rioja Red",
      mileage: 18,
      bodyType: "Sedan",
      fuelType: "Gas",
      status: "AVAILABLE",
      dealershipId: dealership2.id,
    },
    {
      year: 2024,
      make: "Chevrolet",
      model: "Equinox EV",
      trim: "3RS",
      vin: "10CHEVY24EQNOXEV3",
      msrp: 35000,
      salePrice: 33500,
      residualPct: 0.45,
      moneyFactor: 0.0012,
      exteriorColor: "Riptide Blue",
      interiorColor: "Jet Black",
      mileage: 50,
      bodyType: "SUV",
      fuelType: "Electric",
      status: "AVAILABLE",
      dealershipId: dealership2.id,
    },
    {
      year: 2025,
      make: "Subaru",
      model: "Outback",
      trim: "Touring XT",
      vin: "11SUBARU25OUTBKXT",
      msrp: 41000,
      salePrice: 40500,
      residualPct: 0.52,
      moneyFactor: 0.00118,
      exteriorColor: "Autumn Green",
      interiorColor: "Java Brown",
      mileage: 30,
      bodyType: "SUV",
      fuelType: "Gas",
      status: "AVAILABLE",
      dealershipId: dealership1.id,
    },
    {
      year: 2025,
      make: "Mercedes-Benz",
      model: "C-Class",
      trim: "C 300",
      vin: "12MERC2025C300SED",
      msrp: 47500,
      salePrice: 46800,
      residualPct: 0.54,
      moneyFactor: 0.0016,
      exteriorColor: "Obsidian Black",
      interiorColor: "Macchiato Beige",
      mileage: 7,
      bodyType: "Sedan",
      fuelType: "Gas",
      status: "AVAILABLE",
      dealershipId: dealership1.id,
    },
  ];

  for (const vehicle of vehicles) {
    await prisma.vehicle.create({ data: vehicle });
  }
  console.log(`Created ${vehicles.length} vehicles`);

  // Create time slots for dealership 1 (Mon-Sat, 9am-5pm, 30-min slots)
  const days = [1, 2, 3, 4, 5, 6]; // Mon-Sat
  for (const day of days) {
    for (let hour = 9; hour < 17; hour++) {
      for (const min of ["00", "30"]) {
        const startHour = hour.toString().padStart(2, "0");
        const endMin = min === "00" ? "30" : "00";
        const endHour =
          min === "30"
            ? (hour + 1).toString().padStart(2, "0")
            : startHour;
        await prisma.timeSlot.create({
          data: {
            dealershipId: dealership1.id,
            dayOfWeek: day,
            startTime: `${startHour}:${min}`,
            endTime: `${endHour}:${endMin}`,
            maxBookings: 2,
          },
        });
      }
    }
  }
  console.log("Created time slots for Sunset Motors");

  console.log("\nSeed complete!");
  console.log("Demo accounts:");
  console.log("  Customer: customer@example.com / customer123");
  console.log("  Dealer:   dealer@sunsetmotors.com / dealer123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
