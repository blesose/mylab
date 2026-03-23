const Queue = require("bull");
const { sendEmail } = require("../utils/emailService");
const User = require("../modules/user/models/user.model");

const broadcastQueue = new Queue("admin-broadcast", process.env.REDIS_URL);

broadcastQueue.process(async (job) => {
  const { title, message } = job.data;
  const users = await User.find({}, "email");
  for (const u of users) {
    await sendEmail(u.email, title, message);
  }
  console.log(`[Broadcast] ${users.length} users notified.`);
});

module.exports = { broadcastQueue };
