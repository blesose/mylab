const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    gender: {
      type: String,
      enum: ["female", "male", "other"],
      required: true,
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "coach"],
      default: "user",
    },
    profilePicture: {
      type: String, 
      default: "https://media.istockphoto.com/id/2186891726/vector/monochrome-diverse-faceless-anonymous-people-characters-avatar-headshot-portrait-isolated-set.jpg?s=612x612&w=0&k=20&c=8AbAmcR1uW-lw2QMEf2bP8_b481lrmoV0ciDbnDd-zs=",
    },
    bio: {
      type: String,
      maxlength: [300, "Bio cannot exceed 300 characters"],
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Method to compare password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// Optional: index email for faster lookup
// userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("user", userSchema);



// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//       minlength: [3, "Name must be at least 3 characters long"],
//       maxlength: [50, "Name cannot exceed 50 characters"],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [8, "Password must be at least 8 characters long"],
//     },
//     gender: {
//       type: String,
//       enum: ["female", "male"],
//       required: true,
//     },
//     dob: {
//       type: Date,
//       required: [true, "Date of birth is required"],
//     },
//     role: {
//       type: String,
//       enum: ["user", "admin", "coach"],
//       default: "user",
//     },
//     profilePicture: {
//       type: String, // URL to stored profile image
//       default: "",
//     },
//     bio: {
//       type: String,
//       maxlength: [300, "Bio cannot exceed 300 characters"],
//       default: "",
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     lastLogin: {
//       type: Date,
//     },
//   },
//   {
//     timestamps: true, // createdAt & updatedAt
//   }
// );

// module.exports = mongoose.model("user", userSchema);
