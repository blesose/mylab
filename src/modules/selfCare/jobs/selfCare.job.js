import Queue from "bull";
import { getSmartTip } from "../../../core/ai/localAI.js";

const selfCareQueue = new Queue("selfCare-reminder");

selfCareQueue.process(async (job) => {
  const { userId, activityType } = job.data;
  const aiTip = await getSmartTip(`Remind the user to continue ${activityType} for better self-care`);
  console.log(`🔔 Reminder for ${userId}: ${aiTip}`);
});

export const scheduleSelfCareReminder = (userId, activityType) => {
  selfCareQueue.add({ userId, activityType }, { delay: 3600000 }); // 1 hour later
};

