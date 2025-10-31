const MenHealth = require("../models/menHealth.model");
const { generateSmartHealthTip } = require("../ai/ai.helper");


//Compute insights using last 5 records
// async function computeInsights(userId, currentPayload) {
//   // Fetch last 4 previous records (so with current one we have max 5)
//   const records = await MenHealth.find({ userId })
//     .sort({ createdAt: -1 })
//     .limit(4);

//   // Only compute averages if at least 1 previous record exists
//   if (records.length < 1) return { insights: [], advice: "" };
// console.log("Incoming data to computeInsights:", currentPayload)
//   // Include current payload
//   const allRecords = [
//     ...records.map(r => ({
//       sleepHours: Number(r.sleepHours) || 0,
//       stressLevel: Number(r.stressLevel) || 0

//     })),
    
//     {
      
//       sleepHours: Number(currentPayload.sleepHours) || 0,
//       stressLevel: Number(currentPayload.stressLevel) || 0
//     }
//   ];

//   const totalSleep = allRecords.reduce((sum, r) => sum + r.sleepHours, 0);
//   const totalStress = allRecords.reduce((sum, r) => sum + r.stressLevel, 0);

//   const avgSleep = totalSleep / allRecords.length;
//   const avgStress = totalStress / allRecords.length;

//   let advice = "";
//   if (avgSleep < 6) advice += "Try to improve your sleep quality. ";
//   if (avgStress > 7) advice += "Stress seems high — practice relaxation or short walks. ";
//   if (!advice) advice = "You're maintaining good balance. Keep it up!";

//   return {
//     insights: [
//       { metric: "Average Sleep (hrs)", value: avgSleep.toFixed(1) },
//       { metric: "Average Stress Level", value: avgStress.toFixed(1) },
//     ],
//     advice,
//   };
// };


// async function createRecord(userId, payload) {
//   // 1️⃣ Save raw record first
//   const record = new MenHealth({ userId, ...payload });
//   await record.save();

//   // 2️⃣ Compute analysis using last 5 saved records
//   const analysis = await computeInsights(userId);

//   // 3️⃣ Generate AI tip
//   const aiTip = await generateSmartHealthTip({
//     category: "men's health",
//     userData: payload,
//     context: "Focus on energy, testosterone, stress, and daily activity."
//   });

//   // 4️⃣ Attach to record and save again
//   record.analysis = analysis;
//   record.aiTip = aiTip;
//   await record.save();

//   return record;
// }


// ---------------- COMPUTE INSIGHTS ----------------
async function computeInsights(userId, currentPayload) {
  // Fetch last 4 previous records (so with current one we have max 5)
  const records = await MenHealth.find({ userId })
    .sort({ createdAt: -1 })
    .limit(4);

  console.log("Incoming data to computeInsights:", currentPayload);

  // Only compute averages if at least 1 previous record exists
  if (records.length < 1) {
    return { insights: [], advice: "" };
  }

  // Include current payload into calculation
  const allRecords = [
    ...records.map((r) => ({
      sleepHours: Number(r.sleepHours) || 0,
      stressLevel: Number(r.stressLevel) || 0,
    })),
    {
      sleepHours: Number(currentPayload.sleepHours) || 0,
      stressLevel: Number(currentPayload.stressLevel) || 0,
    },
  ];

  const totalSleep = allRecords.reduce((sum, r) => sum + r.sleepHours, 0);
  const totalStress = allRecords.reduce((sum, r) => sum + r.stressLevel, 0);

  const avgSleep = totalSleep / allRecords.length;
  const avgStress = totalStress / allRecords.length;

  let advice = "";
  if (avgSleep < 6) advice += "Try to improve your sleep quality. ";
  if (avgStress > 7) advice += "Stress seems high — practice relaxation or short walks. ";
  if (!advice) advice = "You're maintaining good balance. Keep it up!";

  return {
    insights: [
      { metric: "Average Sleep (hrs)", value: avgSleep.toFixed(1) },
      { metric: "Average Stress Level", value: avgStress.toFixed(1) },
    ],
    advice,
  };
}

// ---------------- CREATE RECORD ----------------
async function createRecord(userId, payload) {
  // 1️⃣ Save raw record first
  const record = new MenHealth({ userId, ...payload });
  await record.save();

  // 2️⃣ Compute analysis using current payload ✅ (fixed argument)
  const analysis = await computeInsights(userId, payload);

  // 3️⃣ Generate AI tip
  const aiTip = await generateSmartHealthTip({
    category: "men's health",
    userData: payload,
    context: "Focus on energy, testosterone, stress, and daily activity.",
  });

  // 4️⃣ Attach analysis + aiTip to record and save again
  record.analysis = analysis;
  record.aiTip = aiTip;
  await record.save();

  return record;
}

// Export service functions

async function getRecords(userId, { page = 1, limit = 20 }) {
  const skip = (page - 1) * limit;
  const records = await MenHealth.find({ userId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  const total = await MenHealth.countDocuments({ userId });
  return { records, total };
}

async function getRecordById(userId, id) {
  return MenHealth.findOne({ _id: id, userId });
}

// async function updateRecord(userId, id, data) {
//   return MenHealth.findOneAndUpdate({ _id: id, userId }, data, { new: true });
// }
async function updateRecord(userId, id, data) {
  // Step 1: Update main fields
  const updated = await MenHealth.findOneAndUpdate(
    { _id: id, userId },
    data,
    { new: true }
  );
  if (!updated) return null;

  // Step 2: Recompute insights and AI tip using latest data
  const analysis = await computeInsights(userId, updated);
  const aiTip = await generateSmartHealthTip({
    category: "men's health",
    userData: updated,
    context: "Focus on energy, testosterone, stress, and daily activity."
  });

  // Step 3: Save both updates
  updated.analysis = analysis;
  updated.aiTip = aiTip;
  await updated.save();

  return updated;
}

async function deleteRecord(userId, id) {
  return MenHealth.findOneAndDelete({ _id: id, userId });
}

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  computeInsights
};
