import { generateSelfCareAdvice } from "../../selfCare/service/selfCare.ai.js";

mentalHealthAlertQueue.process(async (job) => {
  const { user } = job.data;

  // 🧠 Generate an AI-based self-care suggestion
  const aiTip = await generateSelfCareAdvice(user.name, "negative mood trend");

  console.log(`📩 Sending mental health alert with AI tip to ${user.email}`);

  await sendEmail({
    to: user.email,
    subject: "🧠 Your Mental Health Check-In",
    html: `
      <h2>Hey ${user.name},</h2>
      <p>We noticed your mood trend has been low recently.</p>
      <p>${aiTip}</p>
      <p>💚 Stay positive,</p>
      <p><b>The MyLab Wellness Team</b></p>
    `,
  });
});

// import Queue from "bull";
// import { sendEmail } from "../../../utils/emailService.js";
// import { mentalHealthAlertEmail } from "../utils/templates/mentalHealthAlertEmail.js";

// const mentalHealthAlertQueue = new Queue("mentalHealthAlert");

// mentalHealthAlertQueue.process(async (job) => {
//   const { user } = job.data;
  
//   console.log(`📩 Sending mental health alert to ${user.email}...`);

//   await sendEmail({
//     to: user.email,
//     subject: "🧠 Your Mental Health Check-In",
//     html: mentalHealthAlertEmail(user.name),
//   });
// });

// export const queueMentalHealthAlert = async (user) => {
//   await mentalHealthAlertQueue.add({ user });
// };
