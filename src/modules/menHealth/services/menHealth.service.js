const MenHealth = require("../models/menHealth.model");
const { generateSmartHealthTip } = require("../ai/ai.helper");

async function computeInsights(userId, currentPayload) {
  const records = await MenHealth.find({ userId })
    .sort({ createdAt: -1 })
    .limit(4);

  console.log("Incoming data to computeInsights:", currentPayload);

  if (records.length < 1) {
    return { insights: [], advice: "" };
  }

  const allRecords = [
    ...records.map((r) => ({
      sleepHours: Number(r.sleepHours) || 0,
      stressLevel: Number(r.stressLevel) || 0,
      workoutDays: Number(r.workoutDays) || 0,
      energyLevel: Number(r.energyLevel) || 0,
    })),
    {
      sleepHours: Number(currentPayload.sleepHours) || 0,
      stressLevel: Number(currentPayload.stressLevel) || 0,
      workoutDays: Number(currentPayload.workoutDays) || 0,
      energyLevel: Number(currentPayload.energyLevel) || 0,
    },
  ];

  const totalSleep = allRecords.reduce((sum, r) => sum + r.sleepHours, 0);
  const totalStress = allRecords.reduce((sum, r) => sum + r.stressLevel, 0);
  const totalWorkout = allRecords.reduce((sum, r) => sum + r.workoutDays, 0);
  const totalEnergy = allRecords.reduce((sum, r) => sum + r.energyLevel, 0);

  const avgSleep = totalSleep / allRecords.length;
  const avgStress = totalStress / allRecords.length;
  const avgWorkout = totalWorkout / allRecords.length;
  const avgEnergy = totalEnergy / allRecords.length;

  let advice = "";
  if (avgSleep < 6) advice += "Try to improve your sleep quality. ";
  if (avgSleep > 9) advice += "You're getting good sleep, maintain it. ";
  if (avgStress > 7) advice += "Stress seems high — practice relaxation or short walks. ";
  if (avgWorkout < 3) advice += "Consider increasing workout frequency for better health. ";
  if (avgWorkout > 5) advice += "Great workout consistency! ";
  if (avgEnergy < 4) advice += "Low energy detected — check sleep and nutrition. ";
  if (!advice) advice = "You're maintaining good balance. Keep it up!";

  return {
    insights: [
      { metric: "Average Sleep (hrs)", value: avgSleep.toFixed(1) },
      { metric: "Average Stress Level", value: avgStress.toFixed(1) },
      { metric: "Average Workout Days", value: avgWorkout.toFixed(1) },
      { metric: "Average Energy Level", value: avgEnergy.toFixed(1) },
    ],
    advice,
  };
}

async function createRecord(userId, payload) {
  let condition = "General Health Check";
  if (payload.stressLevel >= 8) condition = "High Stress Management";
  if (payload.sleepHours < 6) condition = "Sleep Optimization";
  if (payload.testosteroneLevel && payload.testosteroneLevel < 3) condition = "Hormone Balance";
  if (payload.workoutDays >= 5) condition = "Active Lifestyle";

  const description = `Health check: Stress ${payload.stressLevel || 0}/10, Sleep ${payload.sleepHours || 0}hrs, Workout ${payload.workoutDays || 0} days/week, Energy ${payload.energyLevel || 0}/10`;

  const record = new MenHealth({ 
    userId, 
    condition,
    description,
    date: new Date(),
    ...payload 
  });
  await record.save();

  const analysis = await computeInsights(userId, payload);

  const aiTip = await generateSmartHealthTip({
    category: "men's health",
    userData: payload,
    context: "Focus on energy, testosterone, stress, and daily activity.",
  });

  record.analysis = analysis;
  record.aiTip = aiTip;
  await record.save();

  return record;
}

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

async function updateRecord(userId, id, data) {
  const updated = await MenHealth.findOneAndUpdate(
    { _id: id, userId },
    data,
    { new: true }
  );
  if (!updated) return null;

  const analysis = await computeInsights(userId, updated);
  const aiTip = await generateSmartHealthTip({
    category: "men's health",
    userData: updated,
    context: "Focus on energy, testosterone, stress, and daily activity."
  });

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