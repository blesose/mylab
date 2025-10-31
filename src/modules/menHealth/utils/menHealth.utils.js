exports.formatInsightsEmail = (insights = []) => `
  <div style="font-family:Arial, sans-serif; padding:16px;">
    <h2>MyLab — Men’s Health Insights</h2>
    <ul>${insights.map(i => `<li>${i}</li>`).join("")}</ul>
    <p>— The MyLab Team</p>
  </div>
`;
