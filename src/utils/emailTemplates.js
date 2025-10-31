// src/utils/emailTemplates.js

/**
 * Build a styled HTML email body for weekly men's health tips
 */
function weeklyMensHealthTips(insights = []) {
  const tipList = insights.map(t => `<li style="margin-bottom:8px;">${t}</li>`).join("");

  return `
  <div style="font-family:Arial, sans-serif; background:#f4f4f4; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#fff; border-radius:10px; padding:20px;">
      <h2 style="color:#2B463C;">💪 MyLab Weekly Men's Health Insights</h2>
      <p>Hey there! Here's your personalized wellness update:</p>
      <ul>${tipList}</ul>
      <p style="margin-top:20px;">Remember: small daily habits = long-term strength 💥</p>
      <p>— The MyLab Team 🧬</p>
    </div>
  </div>`;
}

module.exports = { weeklyMensHealthTips };

// // src/utils/emailTemplates.js
// const weeklyMensHealthTips = (insights) => `
//   <div style="font-family:Arial, sans-serif; color:#333;">
//     <h2>🧠 Weekly Men's Health Insights</h2>
//     <p>Here’s how you can stay on track this week:</p>
//     <ul>
//       ${insights.map((tip) => `<li>${tip}</li>`).join("")}
//     </ul>
//     <p>Keep going — small habits build strong lives 💪</p>
//     <hr/>
//     <footer>
//       <p style="font-size:12px; color:#888;">Sent by MyLab Health Platform</p>
//     </footer>
//   </div>
// `;

// module.exports = { weeklyMensHealthTips };
