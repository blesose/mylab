const selfCareTipQueue = require("../jobs/selfCareTip.job");

function scheduleDailySelfCareTips(users) {
  users.forEach(user => {
    selfCareTipQueue.add(
      { userId: user._id, userData: user },
      { repeat: { cron: "0 8 * * *" } } // every morning 8 AM
    );
  });
}

module.exports = { scheduleDailySelfCareTips };
