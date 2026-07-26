const express = require("express");
const userRouter = express.Router();

const {
  register,
  login,
  getProfile,
  updateProfile,
  deleteUser,
  getAllUsers,
} = require("../controllers/user.controller");

const { validate } = require("../../../middleware/validate");
const { signupValidator, loginValidator } = require("../validators/user.validator");
const { authMiddleware } = require("../../../middleware/auth.middleware");

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new MyLab account with email, password, and personal details
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RegisterRequest"
 *           example:
 *             name: "Jane Doe"
 *             userName: "janedoe123"
 *             email: "jane@example.com"
 *             password: "securePass123"
 *             phone: "+2348012345678"
 *             dob: "1995-06-15"
 *             gender: "female"
 *             role: "user"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *             example:
 *               success: true
 *               message: "User registered successfully"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               user:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 name: "Jane Doe"
 *                 userName: "janedoe123"
 *                 email: "jane@example.com"
 *                 phone: "+2348012345678"
 *                 gender: "female"
 *                 role: "user"
 *       400:
 *         description: Validation error - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "All fields are required"
 *       409:
 *         description: Email already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "Email already in use"
 *       500:
 *         description: Server error
 */
userRouter.post("/register", validate(signupValidator), register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login to MyLab
 *     description: Authenticate user and receive JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginRequest"
 *           example:
 *             email: "jane@example.com"
 *             password: "securePass123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *             example:
 *               success: true
 *               message: "Login successful"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               user:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 name: "Jane Doe"
 *                 email: "jane@example.com"
 *                 role: "user"
 *       400:
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "Email and password are required"
 *       401:
 *         description: Invalid password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "Invalid password"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "Invalid credentials"
 *       500:
 *         description: Server error
 */
userRouter.post("/login", validate(loginValidator), login);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieve the profile of the authenticated user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: "#/components/schemas/User"
 *             example:
 *               success: true
 *               message: "Profile retrieved successfully"
 *               user:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 name: "Jane Doe"
 *                 userName: "janedoe123"
 *                 email: "jane@example.com"
 *                 phone: "+2348012345678"
 *                 gender: "female"
 *                 role: "user"
 *       401:
 *         description: Unauthorized - No token provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "Authentication failed: No token provided"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "Profile not found"
 */
userRouter.get("/profile", authMiddleware, getProfile);

/**
 * @swagger
 * /api/users/all-profile:
 *   get:
 *     summary: Get all users
 *     description: Retrieve all users in the system (Admin only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/User"
 *             example:
 *               success: true
 *               message: "Users retrieved successfully"
 *               users:
 *                 - _id: "507f1f77bcf86cd799439011"
 *                   name: "Jane Doe"
 *                   email: "jane@example.com"
 *                   role: "user"
 *                 - _id: "507f1f77bcf86cd799439012"
 *                   name: "John Smith"
 *                   email: "john@example.com"
 *                   role: "admin"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: No users found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "No users found"
 */
userRouter.get("/all-profile", authMiddleware, getAllUsers);

/**
 * @swagger
 * /api/users/update-profile:
 *   put:
 *     summary: Update user profile
 *     description: Update the authenticated user's profile information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Smith"
 *               userName:
 *                 type: string
 *                 example: "janesmith123"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane.smith@example.com"
 *               phone:
 *                 type: string
 *                 example: "+2348098765432"
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "1996-08-20"
 *               gender:
 *                 type: string
 *                 enum: ["female", "male", "other"]
 *                 example: "female"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "newSecurePass456"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: "#/components/schemas/User"
 *             example:
 *               success: true
 *               message: "Profile updated successfully"
 *               user:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 name: "Jane Smith"
 *                 userName: "janesmith123"
 *                 email: "jane.smith@example.com"
 *                 phone: "+2348098765432"
 *                 gender: "female"
 *                 role: "user"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
userRouter.put("/update-profile", authMiddleware, updateProfile);

/**
 * @swagger
 * /api/users/delete-profile:
 *   delete:
 *     summary: Delete user account
 *     description: Permanently delete the authenticated user's account (Irreversible)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiResponse"
 *             example:
 *               success: true
 *               message: "User deleted successfully"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               success: false
 *               message: "User not found"
 */
userRouter.delete("/delete-profile", authMiddleware, deleteUser);

module.exports = userRouter;