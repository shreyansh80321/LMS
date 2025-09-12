require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const faker = require("faker");
const User = require("./models/User");
const Lead = require("./models/Lead");

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  const password = await bcrypt.hash("Testpass123!", 10);
  const user = await User.findOneAndUpdate(
    { email: "testuser@example.com" },
    { email: "testuser@example.com", password, name: "Test User" },
    { upsert: true, new: true }
  );

  const sources = [
    "website",
    "facebook_ads",
    "google_ads",
    "referral",
    "events",
    "other",
  ];
  const statuses = ["new", "contacted", "qualified", "lost", "won"];

  const leads = [];
  for (let i = 0; i < 150; i++) {
    leads.push({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: `lead${i}-${Date.now()}@example.com`,
      phone: faker.phone.phoneNumber(),
      company: faker.company.companyName(),
      city: faker.address.city(),
      state: faker.address.state(),
      source: sources[Math.floor(Math.random() * sources.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      score: Math.floor(Math.random() * 101),
      lead_value: Number((Math.random() * 10000).toFixed(2)),
      last_activity_at: Math.random() > 0.5 ? faker.date.recent(120) : null,
      is_qualified: Math.random() > 0.7,
      ownerId: user._id,
    });
  }

  await Lead.insertMany(leads);
  console.log("Seeded user + leads successfully");
  process.exit(0);
}

main();
