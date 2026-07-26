const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const environment = process.env.NODE_ENV || "development";

const getDeployedUrl = () => {
  if (environment === "production") {
    return process.env.DEPLOYED_URL || "http://localhost:9000";
  }
  if (environment === "staging") {
    return process.env.DEPLOYED_URL || "https://staging.mylab.com";
  }
  return "http://localhost:9000";
};

const deployedUrl = getDeployedUrl();

const servers = {
  development: [
    {
      url: "http://localhost:9000",
      description: "Development Server"
    },
    {
      url: "https://mylab-lts4.onrender.com",
      description: "Development Server"
    }
  ],
  staging: [
    {
      url: "https://staging.mylab.com",
      description: "Staging Server"
    },
    {
      url: "http://localhost:9000",
      description: "Development Server"
    }
  ],
  production: [
    {
      url: deployedUrl,
      description: "Production Server"
    }
  ]
};

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MyLab - Health & Wellness Platform API",
      version: "1.0.0",
      description: `
# Welcome to MyLab API Documentation

MyLab is a full-stack health and wellness platform designed to make reliable 
health information, self-care tools, and supportive communities accessible to everyone.

## Wellness Categories

| Category | Description | Endpoints |
|----------|-------------|-----------|
| Women's Health | Menstrual health, pregnancy, hormonal wellness | /api/females |
| Men's Health | Fitness, reproductive health, lifestyle | /api/mens |
| Mental Wellbeing | Anxiety, stress management, mindfulness | /api/shealth |
| Fitness & Nutrition | Workouts, healthy meals, nutrition | /api/fitnessnutrition |
| Self-Care | Sleep, hydration, skincare, productivity | /api/selfhealth |
| Community | Share experiences, ask questions, support | /api/communitypost |

## Authentication

All protected endpoints require a JWT token in the Authorization header:

Authorization: Bearer <your_jwt_token>

How to get a token:
1. Register a new user at POST /api/users/register
2. Login at POST /api/users/login
3. Use the returned token in all subsequent requests

## Standard Response Format

Success Response:
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}

Error Response:
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}

## Base URLs

Production: ${deployedUrl}
Development: http://localhost:9000
      `,
      contact: {
        name: "MyLab API Support",
        email: "api-support@mylab.com",
        url: "https://mylab.com/support"
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT"
      }
    },
    servers: servers[environment] || servers.development,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token as: Bearer <token>"
        }
      },
      schemas: {
        // ============================================
        // USER SCHEMAS
        // ============================================
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Auto-generated user ID",
              example: "507f1f77bcf86cd799439011"
            },
            name: {
              type: "string",
              description: "User full name",
              example: "Jane Doe"
            },
            userName: {
              type: "string",
              description: "Unique username",
              example: "janedoe123"
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "jane@example.com"
            },
            phone: {
              type: "string",
              description: "Phone number",
              example: "+2348012345678"
            },
            dob: {
              type: "string",
              format: "date",
              description: "Date of birth",
              example: "1995-06-15"
            },
            gender: {
              type: "string",
              enum: ["female", "male", "other"],
              description: "User gender",
              example: "female"
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              default: "user",
              description: "User role",
              example: "user"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation timestamp"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp"
            }
          }
        },

        RegisterRequest: {
          type: "object",
          required: ["name", "userName", "email", "password", "phone", "gender"],
          properties: {
            name: {
              type: "string",
              minLength: 3,
              maxLength: 50,
              example: "Jane Doe"
            },
            userName: {
              type: "string",
              minLength: 3,
              maxLength: 20,
              example: "janedoe123"
            },
            email: {
              type: "string",
              format: "email",
              example: "jane@example.com"
            },
            password: {
              type: "string",
              format: "password",
              minLength: 6,
              example: "securePass123"
            },
            phone: {
              type: "string",
              minLength: 11,
              maxLength: 15,
              example: "+2348012345678"
            },
            dob: {
              type: "string",
              format: "date",
              example: "1995-06-15"
            },
            gender: {
              type: "string",
              enum: ["female", "male", "other"],
              example: "female"
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              default: "user"
            }
          }
        },

        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "jane@example.com"
            },
            password: {
              type: "string",
              format: "password",
              example: "securePass123"
            }
          }
        },

        AuthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true
            },
            message: {
              type: "string",
              example: "Login successful"
            },
            token: {
              type: "string",
              description: "JWT access token",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            },
            user: {
              $ref: "#/components/schemas/User"
            }
          }
        },

        // ============================================
        // COMMUNITY POST SCHEMAS
        // ============================================
        CommunityPost: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439031"
            },
            userId: {
              type: "object",
              properties: {
                _id: { type: "string" },
                name: { type: "string" },
                email: { type: "string" },
                userName: { type: "string" }
              }
            },
            title: {
              type: "string",
              maxLength: 200,
              example: "My Journey with Mental Health"
            },
            content: {
              type: "string",
              minLength: 10,
              maxLength: 5000,
              example: "I wanted to share my experience with anxiety and how I learned to manage it..."
            },
            tags: {
              type: "array",
              items: { type: "string" },
              example: ["anxiety", "mental health", "mindfulness"]
            },
            likes: {
              type: "array",
              description: "Array of users who liked this post",
              items: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  name: { type: "string" },
                  email: { type: "string" }
                }
              }
            },
            likesCount: {
              type: "integer",
              description: "Total number of likes",
              example: 5
            },
            hasLiked: {
              type: "boolean",
              description: "Whether the current user has liked this post",
              example: true
            },
            comments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  userId: {
                    type: "object",
                    properties: {
                      _id: { type: "string" },
                      name: { type: "string" },
                      email: { type: "string" }
                    }
                  },
                  text: { type: "string" },
                  createdAt: { type: "string", format: "date-time" }
                }
              }
            },
            commentsCount: {
              type: "integer",
              example: 3
            },
            aiInsight: {
              type: "string",
              description: "AI-generated insight about the post",
              example: "Long-form post with detailed insight"
            },
            engagementScore: {
              type: "integer",
              description: "Sum of likes and comments",
              example: 12
            },
            createdAt: {
              type: "string",
              format: "date-time"
            },
            updatedAt: {
              type: "string",
              format: "date-time"
            }
          }
        },

        CreateCommunityPostRequest: {
          type: "object",
          required: ["content"],
          properties: {
            title: {
              type: "string",
              maxLength: 200,
              example: "My Journey with Mental Health"
            },
            content: {
              type: "string",
              minLength: 10,
              maxLength: 5000,
              example: "I wanted to share my experience with anxiety and how I learned to manage it through mindfulness and therapy..."
            },
            tags: {
              type: "array",
              items: { type: "string" },
              example: ["anxiety", "mental health", "mindfulness"]
            }
          }
        },

        CommentRequest: {
          type: "object",
          required: ["text"],
          properties: {
            text: {
              type: "string",
              minLength: 1,
              maxLength: 1000,
              example: "This really resonates with me. Thank you for sharing!"
            }
          }
        },

        PostAnalysis: {
          type: "object",
          properties: {
            totalPosts: { type: "integer", example: 15 },
            totalLikes: { type: "integer", example: 78 },
            totalComments: { type: "integer", example: 45 },
            avgLikes: { type: "string", example: "5.20" },
            avgComments: { type: "string", example: "3.00" },
            trend: {
              type: "string",
              enum: ["High engagement", "Moderate engagement"],
              example: "High engagement"
            },
            mostEngagedPostId: { type: "string" },
            mostEngagedPostEngagement: { type: "integer" }
          }
        },

        // ============================================
        // WOMEN'S HEALTH - CYCLE SCHEMAS
        // ============================================
        Cycle: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: {
              type: "string",
              description: "User ID this cycle belongs to"
            },
            startDate: {
              type: "string",
              format: "date",
              description: "First day of menstruation",
              example: "2026-07-15"
            },
            endDate: {
              type: "string",
              format: "date",
              description: "Last day of menstruation",
              example: "2026-07-19"
            },
            flowLevel: {
              type: "string",
              enum: ["light", "medium", "heavy"],
              default: "medium",
              example: "medium"
            },
            symptoms: {
              type: "array",
              items: { type: "string" },
              example: ["cramps", "headache", "fatigue"]
            },
            mood: {
              type: "string",
              enum: ["very-happy", "happy", "neutral", "sad", "very-sad", "anxious", "irritable"],
              default: "neutral",
              example: "neutral"
            },
            energyLevel: {
              type: "string",
              enum: ["very-high", "high", "medium", "low", "very-low"],
              default: "medium",
              example: "medium"
            },
            crampsIntensity: {
              type: "string",
              enum: ["none", "mild", "moderate", "severe", "debilitating"],
              default: "none",
              example: "moderate"
            },
            flowConsistency: {
              type: "string",
              enum: ["normal", "clotty", "watery", "spotting"],
              default: "normal",
              example: "normal"
            },
            notes: {
              type: "string",
              example: "Had mild cramps on day 2"
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },

        CreateCycleRequest: {
          type: "object",
          required: ["userId", "startDate", "endDate"],
          properties: {
            userId: {
              type: "string",
              description: "User ID",
              example: "507f1f77bcf86cd799439011"
            },
            startDate: {
              type: "string",
              format: "date",
              example: "2026-07-15"
            },
            endDate: {
              type: "string",
              format: "date",
              example: "2026-07-19"
            },
            flowLevel: {
              type: "string",
              enum: ["light", "medium", "heavy"],
              default: "medium"
            },
            symptoms: {
              type: "array",
              items: { type: "string" },
              example: ["cramps", "headache"]
            },
            mood: {
              type: "string",
              enum: ["very-happy", "happy", "neutral", "sad", "very-sad", "anxious", "irritable"],
              default: "neutral"
            },
            energyLevel: {
              type: "string",
              enum: ["very-high", "high", "medium", "low", "very-low"],
              default: "medium"
            },
            crampsIntensity: {
              type: "string",
              enum: ["none", "mild", "moderate", "severe", "debilitating"],
              default: "none"
            },
            flowConsistency: {
              type: "string",
              enum: ["normal", "clotty", "watery", "spotting"],
              default: "normal"
            },
            notes: {
              type: "string",
              example: "Had mild cramps on day 2"
            }
          }
        },

        CycleAnalysis: {
          type: "object",
          properties: {
            averageLength: {
              type: "integer",
              description: "Average cycle length in days",
              example: 28
            },
            irregularities: {
              type: "integer",
              description: "Number of irregular cycles detected",
              example: 0
            },
            isRegular: {
              type: "boolean",
              description: "Whether the cycle is regular",
              example: true
            },
            predictedNext: {
              type: "string",
              format: "date",
              description: "Predicted start date of next cycle",
              example: "2026-08-12"
            },
            summary: {
              type: "string",
              example: "Your cycle appears regular. Great job maintaining consistency!"
            },
            status: {
              type: "string",
              enum: ["Healthy", "Monitor", "Irregular"],
              example: "Healthy"
            },
            tip: {
              type: "string",
              description: "AI-generated health tip",
              example: "Track your cycle regularly and eat iron-rich foods to replace blood loss."
            },
            commonSymptoms: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  symptom: { type: "string" },
                  frequency: { type: "integer" }
                }
              }
            },
            moodPatterns: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  mood: { type: "string" },
                  count: { type: "integer" }
                }
              }
            },
            flowPatterns: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  flow: { type: "string" },
                  count: { type: "integer" }
                }
              }
            }
          }
        },

        // ============================================
        // WOMEN'S HEALTH - OVULATION SCHEMAS
        // ============================================
        Ovulation: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            cycleStart: {
              type: "string",
              format: "date",
              example: "2026-07-15"
            },
            cycleLength: {
              type: "integer",
              default: 28,
              example: 28
            },
            ovulationDate: {
              type: "string",
              format: "date",
              description: "Predicted ovulation date",
              example: "2026-07-29"
            },
            fertileWindowStart: {
              type: "string",
              format: "date",
              example: "2026-07-24"
            },
            fertileWindowEnd: {
              type: "string",
              format: "date",
              example: "2026-07-30"
            },
            notes: {
              type: "string",
              example: "Felt mild cramps during ovulation"
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },

        CreateOvulationRequest: {
          type: "object",
          required: ["userId", "cycleStart", "cycleLength"],
          properties: {
            userId: {
              type: "string",
              example: "507f1f77bcf86cd799439011"
            },
            cycleStart: {
              type: "string",
              format: "date",
              example: "2026-07-15"
            },
            cycleLength: {
              type: "integer",
              minimum: 20,
              maximum: 40,
              default: 28,
              example: 28
            },
            notes: {
              type: "string",
              example: "Felt mild cramps during ovulation"
            }
          }
        },

        // ============================================
        // WOMEN'S HEALTH - PREGNANCY SCHEMAS
        // ============================================
        Pregnancy: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            conceptionDate: {
              type: "string",
              format: "date",
              example: "2026-07-01"
            },
            dueDate: {
              type: "string",
              format: "date",
              example: "2027-04-07"
            },
            currentWeek: {
              type: "integer",
              minimum: 1,
              maximum: 42,
              example: 8
            },
            week: {
              type: "integer",
              description: "Week at time of record creation",
              example: 8
            },
            symptoms: {
              type: "array",
              items: { type: "string" },
              example: ["nausea", "fatigue", "breast tenderness"]
            },
            emotion: {
              type: "string",
              example: "Happy and excited"
            },
            energyLevel: {
              type: "integer",
              minimum: 1,
              maximum: 10,
              example: 6
            },
            notes: {
              type: "string",
              example: "First trimester symptoms are manageable"
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },

        CreatePregnancyRequest: {
          type: "object",
          required: ["userId", "conceptionDate", "dueDate", "currentWeek", "week"],
          properties: {
            userId: {
              type: "string",
              example: "507f1f77bcf86cd799439011"
            },
            conceptionDate: {
              type: "string",
              format: "date",
              example: "2026-07-01"
            },
            dueDate: {
              type: "string",
              format: "date",
              example: "2027-04-07"
            },
            currentWeek: {
              type: "integer",
              minimum: 1,
              maximum: 42,
              example: 8
            },
            week: {
              type: "integer",
              minimum: 1,
              maximum: 42,
              example: 8
            },
            notes: {
              type: "string",
              example: "First trimester symptoms are manageable"
            },
            symptoms: {
              type: "array",
              items: { type: "string" },
              example: ["nausea", "fatigue"]
            },
            emotion: {
              type: "string",
              example: "Happy and excited"
            },
            energyLevel: {
              type: "integer",
              minimum: 1,
              maximum: 10,
              example: 6
            }
          }
        },

        PregnancyInsights: {
          type: "object",
          properties: {
            trimester: {
              type: "string",
              enum: ["First Trimester", "Second Trimester", "Third Trimester"],
              example: "First Trimester"
            },
            message: {
              type: "string",
              example: "Your baby is developing organs and heartbeat."
            }
          }
        },

        // ============================================
        // MEN'S HEALTH SCHEMAS
        // ============================================
        MenHealthRecord: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            condition: { type: "string" },
            description: { type: "string" },
            stressLevel: { type: "integer", minimum: 0, maximum: 10 },
            sleepHours: { type: "number", minimum: 0, maximum: 24 },
            workoutDays: { type: "integer", minimum: 0, maximum: 7 },
            energyLevel: { type: "integer", minimum: 0, maximum: 10 },
            age: { type: "integer", minimum: 18, maximum: 100 },
            prostateCheck: { type: "boolean" },
            testosteroneLevel: { type: "integer", minimum: 0, maximum: 100 },
            sexualHealthConcerns: { type: "string" },
            notes: { type: "string" },
            aiTip: { type: "string" },
            analysis: {
              type: "object",
              properties: {
                insights: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      metric: { type: "string" },
                      value: { type: "string" }
                    }
                  }
                },
                advice: { type: "string" }
              }
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },

        CreateMenHealthRequest: {
          type: "object",
          properties: {
            stressLevel: { type: "integer", minimum: 0, maximum: 10, example: 5 },
            sleepHours: { type: "number", minimum: 0, maximum: 24, example: 7.5 },
            workoutDays: { type: "integer", minimum: 0, maximum: 7, example: 4 },
            energyLevel: { type: "integer", minimum: 0, maximum: 10, example: 7 },
            age: { type: "integer", minimum: 18, maximum: 100, example: 35 },
            prostateCheck: { type: "boolean", example: false },
            testosteroneLevel: { type: "integer", minimum: 0, maximum: 100, example: 45 },
            sexualHealthConcerns: { type: "string", example: "Mild concerns about energy levels" },
            notes: { type: "string", example: "Feeling generally healthy this week" }
          }
        },

        // ============================================
        // SLEEP & RECOVERY SCHEMAS
        // ============================================
        SleepRecord: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            sleepStart: { type: "string", pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$" },
            sleepEnd: { type: "string", pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$" },
            sleepQuality: { type: "integer", minimum: 1, maximum: 10 },
            notes: { type: "string" },
            aiTip: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },

        CreateSleepRequest: {
          type: "object",
          required: ["sleepStart", "sleepEnd"],
          properties: {
            sleepStart: { type: "string", pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", example: "22:30" },
            sleepEnd: { type: "string", pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", example: "06:30" },
            sleepQuality: { type: "integer", minimum: 1, maximum: 10, default: 5, example: 7 },
            notes: { type: "string", example: "Slept well, woke up refreshed" }
          }
        },

        // ============================================
        // SELF-CARE SCHEMAS
        // ============================================
        SelfCareActivity: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            activityType: {
              type: "string",
              enum: ["meditation", "journaling", "sleep", "skinCare", "mindfulness", "reading", "exercise", "music", "nature", "social", "hobby", "relaxation", "self_reflection", "other"]
            },
            activity: { type: "string" },
            duration: { type: "integer", minimum: 1, maximum: 1440 },
            moodBefore: { type: "integer", minimum: 1, maximum: 10 },
            moodAfter: { type: "integer", minimum: 1, maximum: 10 },
            satisfaction: { type: "integer", minimum: 1, maximum: 10 },
            notes: { type: "string" },
            aiTip: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },

        CreateSelfCareRequest: {
          type: "object",
          required: ["activityType", "duration"],
          properties: {
            activityType: {
              type: "string",
              enum: ["meditation", "journaling", "sleep", "skinCare", "mindfulness", "reading", "exercise", "music", "nature", "social", "hobby", "relaxation", "self_reflection", "other"],
              example: "meditation"
            },
            activity: { type: "string", example: "Guided meditation for anxiety" },
            duration: { type: "integer", minimum: 1, maximum: 1440, example: 15 },
            moodBefore: { type: "integer", minimum: 1, maximum: 10, default: 5, example: 4 },
            moodAfter: { type: "integer", minimum: 1, maximum: 10, default: 5, example: 7 },
            satisfaction: { type: "integer", minimum: 1, maximum: 10, default: 5, example: 8 },
            notes: { type: "string", example: "Felt calmer after meditation" }
          }
        },

        // ============================================
        // FITNESS & NUTRITION SCHEMAS
        // ============================================
        FitnessActivity: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            activityType: { type: "string" },
            duration: { type: "integer", minimum: 10 },
            intensity: { type: "string", enum: ["low", "medium", "high"] },
            frequency: { type: "integer", minimum: 1, maximum: 7 },
            goal: { type: "string", enum: ["weight_loss", "muscle_gain", "endurance", "flexibility", "general_health"] },
            grade: { type: "string" },
            aiTip: { type: "string" },
            createdAt: { type: "string", format: "date-time" }
          }
        },

        CreateFitnessRequest: {
          type: "object",
          required: ["activityType", "duration", "intensity", "frequency", "goal"],
          properties: {
            activityType: { type: "string", example: "Running" },
            duration: { type: "integer", minimum: 10, example: 30 },
            intensity: { type: "string", enum: ["low", "medium", "high"], example: "medium" },
            frequency: { type: "integer", minimum: 1, maximum: 7, example: 4 },
            goal: { type: "string", enum: ["weight_loss", "muscle_gain", "endurance", "flexibility", "general_health"], example: "general_health" }
          }
        },

        NutritionEntry: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            meal: { type: "string" },
            calories: { type: "integer" },
            protein: { type: "integer" },
            carbs: { type: "integer" },
            fats: { type: "integer" },
            fiber: { type: "integer" },
            sugar: { type: "integer" },
            mealType: { type: "string", enum: ["breakfast", "lunch", "dinner", "snack"] },
            portion: { type: "string", enum: ["small", "medium", "large"], default: "medium" },
            notes: { type: "string" },
            grade: { type: "string" },
            aiTip: { type: "string" },
            createdAt: { type: "string", format: "date-time" }
          }
        },

        CreateNutritionRequest: {
          type: "object",
          required: ["meal", "calories", "mealType"],
          properties: {
            meal: { type: "string", example: "Grilled Chicken Salad" },
            calories: { type: "integer", example: 450 },
            protein: { type: "integer", example: 25 },
            carbs: { type: "integer", example: 30 },
            fats: { type: "integer", example: 15 },
            fiber: { type: "integer", example: 8 },
            sugar: { type: "integer", example: 5 },
            mealType: { type: "string", enum: ["breakfast", "lunch", "dinner", "snack"], example: "lunch" },
            portion: { type: "string", enum: ["small", "medium", "large"], default: "medium", example: "medium" },
            notes: { type: "string", example: "Added extra vegetables" }
          }
        },

        FoodItem: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            category: {
              type: "string",
              enum: ["fruits", "vegetables", "proteins", "carbs", "fats", "dairy", "meals", "snacks", "beverages", "custom"]
            },
            calories: { type: "integer" },
            protein: { type: "number" },
            carbs: { type: "number" },
            fats: { type: "number" },
            fiber: { type: "number" },
            sugar: { type: "number" },
            servingSize: { type: "string" },
            servingUnit: { type: "string", default: "g" },
            isCommon: { type: "boolean", default: true },
            isCustom: { type: "boolean", default: false },
            userId: { type: "string" },
            image: { type: "string" },
            createdAt: { type: "string", format: "date-time" }
          }
        },

        // ============================================
        // LAB INSIGHTS SCHEMAS
        // ============================================
        LabInsight: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            category: {
              type: "string",
              enum: ["femaleHealth", "sleepRecovery", "menHealth", "fitness", "nutrition", "selfCare", "community", "blood-test"]
            },
            summary: { type: "string" },
            aiGeneratedTips: { type: "array", items: { type: "string" } },
            createdAt: { type: "string", format: "date-time" }
          }
        },

        CreateInsightRequest: {
          type: "object",
          required: ["category", "data"],
          properties: {
            category: {
              type: "string",
              enum: ["femaleHealth", "sleepRecovery", "menHealth", "fitness", "nutrition", "selfCare", "community", "blood-test"],
              example: "fitness"
            },
            data: {
              type: "array",
              items: { type: "number" },
              example: [75, 82, 68, 90, 78]
            }
          }
        },

        DashboardInsights: {
          type: "object",
          properties: {
            weeklySummary: {
              type: "object",
              properties: {
                totalSleepHours: { type: "number" },
                avgSleepQuality: { type: "number" },
                totalWorkouts: { type: "integer" },
                totalSelfCare: { type: "integer" },
                totalPosts: { type: "integer" },
                avgCaloriesBurned: { type: "integer" }
              }
            },
            recentInsights: {
              type: "array",
              items: { $ref: "#/components/schemas/LabInsight" }
            },
            aiSummary: {
              type: "array",
              items: { type: "string" }
            }
          }
        },

        WeeklyReport: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            downloadUrl: { type: "string" },
            summary: {
              type: "object",
              properties: {
                totalSleepHours: { type: "number" },
                avgSleepQuality: { type: "number" },
                totalWorkouts: { type: "integer" },
                totalSelfCare: { type: "integer" },
                totalPosts: { type: "integer" }
              }
            }
          }
        },

        // ============================================
        // COMMON RESPONSE SCHEMAS
        // ============================================
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
            data: { type: "object" }
          }
        },

        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", default: false },
            message: { type: "string" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" }
                }
              }
            }
          }
        },

        PaginatedResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: {
              type: "array",
              items: { type: "object" }
            },
            pagination: {
              type: "object",
              properties: {
                page: { type: "integer" },
                limit: { type: "integer" },
                total: { type: "integer" },
                totalPages: { type: "integer" },
                hasNext: { type: "boolean" },
                hasPrev: { type: "boolean" }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication - Register, Login, Profile management"
      },
      {
        name: "Community",
        description: "Community posts - Share experiences, support others"
      },
      {
        name: "Women's Health - Cycle",
        description: "Menstrual cycle tracking and analysis"
      },
      {
        name: "Women's Health - Ovulation",
        description: "Ovulation tracking and fertility window prediction"
      },
      {
        name: "Women's Health - Pregnancy",
        description: "Pregnancy tracking and wellness tips"
      },
      {
        name: "Men's Health",
        description: "Men's health tracking - Stress, sleep, fitness, testosterone"
      },
      {
        name: "Sleep & Recovery",
        description: "Sleep tracking and recovery insights"
      },
      {
        name: "Self-Care",
        description: "Self-care activities and mood tracking"
      },
      {
        name: "Fitness & Nutrition",
        description: "Fitness and nutrition tracking with AI grading"
      },
      {
        name: "Lab Insights",
        description: "Lab insights and weekly health reports"
      }
    ],
    security: [{ bearerAuth: [] }]
  },
  apis: [
    "./src/modules/**/routes/*.js",
    "./src/modules/**/controllers/*.js"
  ]
};

const specs = swaggerJsdoc(options);
module.exports = { swaggerUi, specs };