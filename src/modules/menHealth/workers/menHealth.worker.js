const { mensHealthQueue } = require("../queues/menHealth.queue");
const MenHealth = require("../models/menHealth.model");
const { getMenHealthInsights } = require("../services/menHealth.analysis");
const { generateSmartHealthTip } = require("../ai/ai.helper");

mensHealthQueue.process("analyzeMenRecord", async (job) => {
  const { userId, recordId } = job.data;

  console.log(`Processing menHealth analysis for user ${userId} record ${recordId}...`);

  try {
    const record = await MenHealth.findById(recordId);
    if (!record) throw new Error("Record not found");

    // 1️⃣ Generate insights based on trends
    const insights = await getMenHealthInsights(userId);

    // 2️⃣ Generate an AI wellness tip
    const aiTip = await generateSmartHealthTip({
      category: "Men's Health",
      userData: {
        stressLevel: record.stressLevel,
        sleepHours: record.sleepHours,
        workoutDays: record.workoutDays,
        age: record.age,
        name: record.name,
      },
      context: "Focus on energy, testosterone, stress, and daily activity.",
    });

    // 3️⃣ Save insights + tip to Mongo
    record.analysis = {
      insights,
      aiTip,
      analyzedAt: new Date(),
    };

    await record.save();
    console.log(`✅ Men’s Health analysis complete for record ${recordId}`);
    return { insights, aiTip };
  } catch (err) {
    console.error("❌ Men’s Health analysis error:", err.message);
    throw err;
  }
});

// const { mensHealthQueue } = require("../../../utils/queues");
// const MenHealth = require("../models/menHealth.model");
// const { getMenHealthInsights } = require("../services/menHealth.analysis");
// const { sendEmail } = require("../../../utils/email.utils");
// const User = require("../../../models/user.schema"); // adjust path to your user model

// /**
//  * Job: analyzeMenRecord
//  * Data: { userId, recordId }
//  */
// mensHealthQueue.process("analyzeMenRecord", async (job) => {
//   const { userId, recordId } = job.data;
//   console.log(`🩺 [MenHealthWorker] analyzeMenRecord job ${job.id} user ${userId}`);

//   // fetch record and recent history
//   const record = await MenHealth.findById(recordId);
//   if (!record) return { ok: false, message: "Record not found" };

//   const insights = await getMenHealthInsights(userId);

//   // optional: send email with insights (if user has email)
//   try {
//     const user = await User.findById(userId).select("email name");
//     if (user?.email) {
//       const html = `
//         <h3>MyLab — Your Men’s Health Insights</h3>
//         <p>Hello ${user.name || ""}, here are insights based on your recent entries:</p>
//         <ul>${insights.map(i => `<li>${i}</li>`).join("")}</ul>
//       `;
//       await sendEmail({ to: user.email, subject: "Your Men’s Health Insights", html });
//     }
//   } catch (err) {
//     console.error("Failed to send menHealth insight email:", err.message);
//   }

//   return { ok: true, insights };
// });

// /**
//  * Job: weeklyMenSummary
//  * Data: { userId, email (optional) }
//  */
// mensHealthQueue.process("weeklyMenSummary", async (job) => {
//   const { userId, email } = job.data;
//   console.log(`📅 [MenHealthWorker] weeklyMenSummary job ${job.id} user ${userId}`);

//   const insights = await getMenHealthInsights(userId);
//   const summaryHtml = `
//     <h3>Weekly Men’s Health Summary</h3>
//     <ul>${insights.map(i => `<li>${i}</li>`).join("")}</ul>
//   `;
//   if (email) {
//     await sendEmail({ to: email, subject: "MyLab Weekly Men’s Health Summary", html: summaryHtml });
//   }
//   return { ok: true, insights };
// });
