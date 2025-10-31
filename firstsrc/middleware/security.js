const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");

function applySecurityMiddlewares(app) {
  // Secure HTTP headers
  app.use(helmet());

  // Enable CORS
  app.use(cors());

  // Prevent NoSQL injection (configure properly)
  app.use(
    mongoSanitize({
      replaceWith: "_", // ⬅ replaces dangerous characters with "_"
    })
  );

  // Prevent XSS attacks
  app.use(xss());

  // Prevent parameter pollution
  app.use(hpp());

  // Rate limiter
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP
    message: "Too many requests from this IP, please try again later.",
  });

  app.use("/api", limiter); // only apply to API routes
}

module.exports = applySecurityMiddlewares;



// const helmet = require("helmet");
// const cors = require("cors");
// const mongoSanitize = require("express-mongo-sanitize");
// const xss = require("xss-clean");
// const hpp = require("hpp");
// const rateLimit = require("express-rate-limit");

// function applySecurityMiddlewares(app) {
//   // Secure HTTP headers
//   app.use(helmet());

//   // Enable CORS
//   app.use(cors());

//   // Prevent NoSQL injection
//   app.use(mongoSanitize({
//     replaceWith: "_" // avoids breaking Express 5 req.query
//   }));

//   // Prevent XSS attacks
//   app.use(xss());

//   // Prevent HTTP parameter pollution
//   app.use(hpp());

//   // Rate limiter for API routes
//   const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // 100 requests per IP
//     standardHeaders: true,
//     legacyHeaders: false,
//     message: {
//       success: false,
//       error: "Too many requests from this IP, please try again later."
//     }
//   });
//   app.use("/api", limiter);
// }

// module.exports = applySecurityMiddlewares;

