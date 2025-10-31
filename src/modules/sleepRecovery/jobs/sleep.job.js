import Queue from "bull";
import { getSmartTip } from "../../../core/ai/localAI.js";

const sleepQueue = new Queue("sleep-reminder");

sleepQueue.process(async (job) => {
  const { userId, reminderType } = job.data;
  const aiTip = await getSmartTip(`Generate a sleep reminder tip for ${reminderType}`);
  console.log(`🕐 Sleep reminder for ${userId}: ${aiTip}`);
});

export const scheduleSleepReminder = (userId, reminderType = "bedtime") => {
  const delay = reminderType === "bedtime" ? 7200000 : 0; // 2 hours before bedtime
  sleepQueue.add({ userId, reminderType }, { delay });
};
