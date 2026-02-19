require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected for Seeding");

    // Optional: clear existing users
    await User.deleteMany();
    console.log("🗑 Old users deleted");

    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.create([
      {
        name: "Suraj",
        email: "suraj@gmail.com",
        password: hashedPassword,
      },
      {
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
      },
    ]);

    console.log("🌱 Data Seeded Successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Seeding Error:", error.message);
    process.exit(1);
  }
};

seedData();
