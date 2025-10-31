const { mensHealthQueue } = require("../../utils/queues");
const MenHealth = require("../models/menHealth.model");
const { getMenHealthInsights } = require("../services/menHealth.analysis");
const { generateSmartHealthTip } = require("../../ai/ai.helper");

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

// // src/workers/mensHealth.worker.js
// const { mensHealthQueue } = require("../utils/queues");
// const { sendEmail } = require("../utils/email.utils");
// const { getMensHealthInsights } = require("../utils/mensHealth.utils");
// const { weeklyMensHealthTips } = require("../utils/emailTemplates");

// /**
//  * This worker processes men's health insight jobs.
//  * Each job expects: { record, userEmail }
//  */
// mensHealthQueue.process(async (job) => {
//   try {
//     const { record, userEmail } = job.data;

//     console.log(`👨‍⚕️ Processing Men's Health job: ${job.id} for ${userEmail}`);

//     // 1️⃣ Generate personalized insights from the record
//     const insights = getMensHealthInsights(record);

//     // 2️⃣ Prepare email HTML using reusable template
//     const htmlBody = weeklyMensHealthTips(insights);

//     // 3️⃣ Send the email
//     await sendEmail({
//       to: userEmail,
//       subject: "Your Weekly MyLab Men's Health Insights 💪",
//       html: htmlBody,
//     });

//     console.log(`✅ Men's Health insights email sent to ${userEmail}`);
//     return { status: "sent", insights };

//   } catch (error) {
//     console.error("❌ Error processing men's health job:", error);
//     throw error;
//   }
// });
