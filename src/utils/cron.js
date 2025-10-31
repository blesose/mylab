const cron = require("node-cron");
const User = require("../models/user.model");
const { scheduleNextPeriodReminder } = require("./reminderProducer");
const sendEmail = require("./email.utilis");
const { getWeeklyTip } = require("./pregnancyTips");
const Pregnancy = require("../models/pregnancy.model");
const Notification = require("../models/notification.model");

const startAll = () => {
  // daily OTP cleanup (example)
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily cleanup...");
    // implement cleanup tasks if you have OTP collection
  });

  // daily pregnancy weekly tip sender: run every day at 08:00 and send to users in that week (optionally only once per week)
  cron.schedule("0 8 * * *", async () => {
    try {
      console.log("Running daily pregnancy tip job...");
      const pregnancies = await Pregnancy.find({});
      for (const p of pregnancies) {
        p.currentWeek = require("./pregnancyCalc").calculateWeek(p.startDate);
        const tip = getWeeklyTip(p.currentWeek);
        // create notification and optionally send email if user has email
        await Notification.create({ userId: p.userId, title: `Week ${p.currentWeek} Tip`, message: tip, type: "insight" });
        const user = await User.findById(p.userId).select("email");
        if (user && user.email) {
          await sendEmail(user.email, `Week ${p.currentWeek} Tip`, tip, `<p>${tip}</p>`);
        }
      }
      console.log("Pregnancy tips processed");
    } catch (err) {
      console.error("pregnancy tip cron err", err);
    }
  });

  console.log("Cron jobs scheduled");
};

module.exports = { startAll };
