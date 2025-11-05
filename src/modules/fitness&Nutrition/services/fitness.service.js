// src/modules/fitness&Nutrition/services/fitness.service.js
const Fitness = require("../models/fitness.model");

async function createFitnessActivity(data) {
  return await Fitness.create(data);
}

async function getUserFitnessActivities(userId) {
  return await Fitness.find({ userId }).sort({ createdAt: -1 });
}


async function updateFitnessActivity(id, updates) {
  return await Fitness.findByIdAndUpdate(id, updates, { new: true });
}

async function deleteFitnessActivity(id) {
  return await Fitness.findByIdAndDelete(id);
}

module.exports = {
  createFitnessActivity,
  getUserFitnessActivities,
  updateFitnessActivity,
  deleteFitnessActivity,
};
