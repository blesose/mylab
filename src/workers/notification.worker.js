// src/workers/notification.worker.js
const { notificationQueue } = require("../utils/queues");

// Process jobs from the notification queue
notificationQueue.process(async (job) => {
  const { type, message, userId, email } = job.data;
  console.log("🔔 Processing notification job:", job.id, type);

  try {
    // Example handling based on notification type
    switch (type) {
      case "cycleReminder":
        console.log(`🩸 Reminder for user ${userId}: ${message}`);
        break;

      case "healthTip":
        console.log(`💡 Health Tip for user ${userId}: ${message}`);
        break;

      case "emailAlert":
        console.log(`📧 Email Alert queued for ${email}`);
        // You could even call addEmailJob() here if you want to trigger an email
        break;

      default:
        console.log("ℹ️ General notification:", message);
    }

    console.log(`✅ Notification job ${job.id} processed successfully`);
  } catch (error) {
    console.error(`❌ Notification job ${job.id} failed:`, error.message);
    throw error;
  }
});



// case "emailAlert":
//   console.log(`📧 Sending email alert to ${email}`);
//   await addEmailJob({
//     to: email,
//     subject: "MyLab Notification",
//     text: message,
//     html: `<p>${message}</p>`,
//   });
//   break;
