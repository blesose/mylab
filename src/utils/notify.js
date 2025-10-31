const Notification = require("../models/notification.model");
const sendEmail = require("./email.utilis");

const createNotification = async (userId, title, message, type="reminder", emailOpt=true, userEmail) => {
  try {
    await Notification.create({ userId, title, message, type });
    if (emailOpt && userEmail) {
      await sendEmail(userEmail, title, message, `<p>${message}</p>`);
    }
  } catch (err) {
    console.error("createNotification err", err);
  }
};

module.exports = { createNotification }