const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

// ====== CORE IMPORTS ======
const LabInsights = require("../models/labInsights.model");
const { analyzeData } = require("./labInsights.analysis");

// ====== DYNAMIC MODEL IMPORTS ======
let SleepRecord, Fitness, Nutrition, SelfCare, CommunityPost, User;

// Sleep
try {
  SleepRecord = require("../../sleepRecovery/models/sleep.model");
  console.log('✅ SleepRecord loaded');
} catch (e) {
  try {
    SleepRecord = require("../../sleep/models/sleep.model");
    console.log('✅ SleepRecord loaded from alternative path');
  } catch (e2) { 
  console.log('❌ SleepRecord:', e2.message); } }

// Fitness
try {
  Fitness = require("../../fitness&Nutrition/models/fitness.model");
  console.log('✅ Fitness loaded');
} catch (e) { 
  try {
    Fitness = require("../../fitness/models/fitness.model");
    console.log('✅ Fitness loaded from alternative path');
  } catch (e2) {
    console.log('❌ Fitness:', e2.message);
  }
}

// Nutrition
try {
  Nutrition = require("../../fitness&Nutrition/models/nutrition.model");
  console.log('✅ Nutrition loaded');
} catch (e) { 
  try {
    Nutrition = require("../../Nutrition/models/nutrition.model");
    console.log('✅ Nutrition loaded from alternative path');
  } catch (e2) {
    console.log('❌ Nutrition:', e2.message);
  }
}

// SelfCare
try {
  SelfCare = require("../../selfCare/models/selfCare.model");
  console.log('✅ SelfCare loaded');
} catch (e) { 
  try {
    SelfCare = require("../../selfCare/models/selfCare.model");
    console.log('✅ SelfCare loaded from alternative path');
  } catch (e2) {
    console.log('❌ SelfCare:', e2.message);
  }
}

// CommunityPost
try {
  CommunityPost = require("../../communityPost/models/communityPost.model");
  console.log('✅ CommunityPost loaded');
} catch (e) { 
  try {
    CommunityPost = require("../../community/models/communityPost.model");
    console.log('✅ CommunityPost loaded from alternative path');
  } catch (e2) {
    console.log('❌ CommunityPost:', e2.message);
  }
}

// User
try {
  User = require("../../users/models/user.schema");
  console.log('✅ User loaded');
} catch (e) { 
  try {
    User = require("../../auth/models/user.model");
    console.log('✅ User loaded from alternative path');
  } catch (e2) {
    console.log('❌ User:', e2.message);
  }
}

// ====== DEBUG FUNCTION ======
async function debugDataSources(userId) {
  console.log("\n🔍 DEBUG: Checking data sources for user:", userId);
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  try {
    // Check if models exist
    console.log("1. Checking model availability:");
    console.log("   - SleepRecord:", SleepRecord ? "✓ Found" : "✗ Missing");
    console.log("   - Fitness:", Fitness ? "✓ Found" : "✗ Missing");
    console.log("   - Nutrition:", Nutrition ? "✓ Found" : "✗ Missing");
    console.log("   - SelfCare:", SelfCare ? "✓ Found" : "✗ Missing");
    console.log("   - CommunityPost:", CommunityPost ? "✓ Found" : "✗ Missing");
    console.log("   - LabInsights:", LabInsights ? "✓ Found" : "✗ Missing");
    
    // Try to fetch some data
    console.log("\n2. Trying to fetch data:");
    
    if (SleepRecord) {
      const sleepCount = await SleepRecord.countDocuments({ userId });
      console.log("   - Sleep records:", sleepCount);
    }
    
    if (Fitness) {
      const fitnessCount = await Fitness.countDocuments({ userId });
      console.log("   - Fitness records:", fitnessCount);
    }
    
    if (Nutrition) {
      const nutritionCount = await Nutrition.countDocuments({ userId });
      console.log("   - Nutrition records:", nutritionCount);
    }
    
    // Check LabInsights
    if (LabInsights) {
      const insightsCount = await LabInsights.countDocuments({ userId });
      console.log("   - LabInsights records:", insightsCount);
    } else {
      console.log("   - LabInsights: Model not available");
    }
    
    return true;
  } catch (error) {
    console.log("❌ Debug error:", error.message);
    return false;
  }
}

// ====== CORE FUNCTIONS ======
async function generateInsight(userId, category, data) {
  try {
    console.log(`\n🔧 generateInsight called for ${category}:`);
    console.log(`   Data: ${JSON.stringify(data)}`);
    console.log(`   Data length: ${data.length}`);
    
    // VALIDATE: Data must be provided
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error(`Cannot generate ${category} insight: No data provided`);
    }
    
    // Generate insight from REAL data
    const result = await analyzeData(userId, category, data);
    
    // Make sure LabInsights model is available
    if (!LabInsights) {
      throw new Error("LabInsights model is not defined. Check imports.");
    }
    
    const insight = new LabInsights(result);
    await insight.save();
    
    console.log(`✅ Created ${category} insight with ${data.length} data points`);
    console.log(`   Summary: ${result.summary}`);
    
    return insight;
    
  } catch (error) {
    console.error(`❌ Error generating ${category} insight:`, error.message);
    throw error;
  }
}

async function getUserInsights(userId) {
  if (!LabInsights) {
    console.log("❌ LabInsights model not available");
    return [];
  }
  return LabInsights.find({ userId }).sort({ createdAt: -1 });
}

// ====== WEEKLY DATA FUNCTIONS ======
async function getUserWeeklyData(userId) {
  try {
    console.log(`\n📊 [getUserWeeklyData] Fetching ALL weekly data for user: ${userId}`);
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    console.log(`   Date range: ${oneWeekAgo.toISOString()} to now`);
    
    // Initialize with default structure
    const defaultData = {
      userInfo: { name: "User", email: "N/A" },
      summary: {
        totalSleepHours: 0,
        totalWorkouts: 0,
        totalPosts: 0,
        totalSelfCare: 0,
        avgSleepQuality: 0,
        avgCaloriesBurned: 0
      },
      details: {
        sleep: [],
        fitness: [],
        nutrition: [],
        selfCare: [],
        community: []
      }
    };
    
    // Get user info
    try {
      if (User) {
        const user = await User.findById(userId).select("name email");
        if (user) defaultData.userInfo = user;
        console.log(`✅ User info loaded: ${user?.name || 'N/A'}`);
      }
    } catch (userError) {
      console.log("⚠️ User error:", userError.message);
    }
    
    // Get sleep data
    if (SleepRecord) {
      try {
        const sleepData = await SleepRecord.find({ 
          userId, 
          createdAt: { $gte: oneWeekAgo } 
        }).lean();
        
        defaultData.details.sleep = sleepData;
        console.log(`✅ Sleep: ${sleepData.length} records`);
        
        // Calculate sleep statistics
        let totalSleepHours = 0;
        let totalSleepQuality = 0;
        let qualityCount = 0;
        
        sleepData.forEach(record => {
          if (record.sleepStart && record.sleepEnd) {
            try {
              const parseTime = (timeStr) => {
                const [hours, minutes] = timeStr.split(':').map(Number);
                return hours + (minutes / 60);
              };
              
              const start = parseTime(record.sleepStart);
              const end = parseTime(record.sleepEnd);
              
              let duration = end - start;
              if (duration < 0) duration += 24;
              
              totalSleepHours += duration;
            } catch (e) {
              totalSleepHours += 7;
            }
          }
          
          if (record.sleepQuality !== undefined) {
            totalSleepQuality += record.sleepQuality;
            qualityCount++;
          }
        });
        
        defaultData.summary.totalSleepHours = parseFloat(totalSleepHours.toFixed(1));
        defaultData.summary.avgSleepQuality = qualityCount > 0 ? 
          parseFloat((totalSleepQuality / qualityCount).toFixed(1)) : 0;
        
      } catch (sleepError) {
        console.log("⚠️ Sleep error:", sleepError.message);
      }
    }
    
    // Get fitness data
    if (Fitness) {
      try {
        const fitnessData = await Fitness.find({ 
          userId, 
          createdAt: { $gte: oneWeekAgo } 
        }).lean();
        
        defaultData.details.fitness = fitnessData;
        defaultData.summary.totalWorkouts = fitnessData.length;
        console.log(`✅ Fitness: ${fitnessData.length} records`);
        
        if (fitnessData.length > 0) {
          const totalDuration = fitnessData.reduce((sum, record) => 
            sum + (record.duration || 0), 0
          );
          const estimatedCalories = fitnessData.length * 300;
          defaultData.summary.avgCaloriesBurned = estimatedCalories;
        }
        
      } catch (fitnessError) {
        console.log("⚠️ Fitness error:", fitnessError.message);
      }
    }
    
    // Get nutrition data
    if (Nutrition) {
      try {
        const nutritionData = await Nutrition.find({ 
          userId, 
          createdAt: { $gte: oneWeekAgo } 
        }).lean();
        
        defaultData.details.nutrition = nutritionData;
        console.log(`✅ Nutrition: ${nutritionData.length} records`);
        
      } catch (nutritionError) {
        console.log("⚠️ Nutrition error:", nutritionError.message);
      }
    }
    
    // Get self-care data
    if (SelfCare) {
      try {
        const selfCareData = await SelfCare.find({ 
          userId, 
          createdAt: { $gte: oneWeekAgo } 
        }).lean();
        
        defaultData.details.selfCare = selfCareData;
        defaultData.summary.totalSelfCare = selfCareData.length;
        console.log(`✅ Self-care: ${selfCareData.length} records`);
        
      } catch (selfCareError) {
        console.log("⚠️ Self-care error:", selfCareError.message);
      }
    }
    
    // Get community data
    if (CommunityPost) {
      try {
        const communityData = await CommunityPost.find({ 
          userId, 
          createdAt: { $gte: oneWeekAgo } 
        }).lean();
        
        defaultData.details.community = communityData;
        defaultData.summary.totalPosts = communityData.length;
        console.log(`✅ Community: ${communityData.length} posts`);
        
      } catch (communityError) {
        console.log("⚠️ Community error:", communityError.message);
      }
    }
    
    // Final summary
    console.log(`\n📦 FINAL DATA SUMMARY:`);
    console.log(`   Sleep: ${defaultData.details.sleep.length} records`);
    console.log(`   Fitness: ${defaultData.details.fitness.length} records`);
    console.log(`   Nutrition: ${defaultData.details.nutrition.length} records`);
    console.log(`   Self-care: ${defaultData.details.selfCare.length} records`);
    console.log(`   Community: ${defaultData.details.community.length} posts`);
    
    return defaultData;
    
  } catch (error) {
    console.error("❌ Error in getUserWeeklyData:", error.message);
    
    return {
      userInfo: { name: "User", email: "N/A" },
      summary: {
        totalSleepHours: 0,
        totalWorkouts: 0,
        totalPosts: 0,
        totalSelfCare: 0,
        avgSleepQuality: 0,
        avgCaloriesBurned: 0
      },
      details: {
        sleep: [],
        fitness: [],
        nutrition: [],
        selfCare: [],
        community: []
      }
    };
  }
}

async function getUserAllTimeData(userId) {
  try {
    console.log(`\n📊 [getUserAllTimeData] Fetching ALL TIME data for user: ${userId}`);
    
    // Initialize with default structure
    const result = {
      userInfo: { name: "User", email: "N/A" },
      summary: {
        totalSleepHours: 0,
        totalWorkouts: 0,
        totalPosts: 0,
        totalSelfCare: 0,
        avgSleepQuality: 0,
        avgCaloriesBurned: 0
      },
      details: {
        sleep: [],
        fitness: [],
        nutrition: [],
        selfCare: [],
        community: []
      },
      timeRange: {
        oldest: null,
        newest: null
      }
    };
    
    // ====== 1. GET USER INFO ======
    try {
      if (User) {
        const user = await User.findById(userId).select("name email");
        if (user) result.userInfo = user;
        console.log(`✅ User info loaded: ${user?.name || 'N/A'}`);
      }
    } catch (userError) {
      console.log("⚠️ User error:", userError.message);
    }
    
    // ====== 2. GET ALL SLEEP DATA ======
    if (SleepRecord) {
      try {
        const sleepData = await SleepRecord.find({ userId }).sort({ createdAt: 1 }).lean();
        result.details.sleep = sleepData;
        console.log(`✅ Sleep: ${sleepData.length} records (all time)`);
        
        if (sleepData.length > 0) {
          // Calculate sleep statistics
          let totalSleepHours = 0;
          let totalSleepQuality = 0;
          let qualityCount = 0;
          
          sleepData.forEach(record => {
            // Calculate duration
            if (record.sleepStart && record.sleepEnd) {
              try {
                const parseTime = (timeStr) => {
                  const [hours, minutes] = timeStr.split(':').map(Number);
                  return hours + (minutes / 60);
                };
                
                const start = parseTime(record.sleepStart);
                const end = parseTime(record.sleepEnd);
                
                let duration = end - start;
                if (duration < 0) duration += 24;
                
                totalSleepHours += duration;
              } catch (e) {
                totalSleepHours += 7; // Default
              }
            }
            
            // Add sleep quality
            if (record.sleepQuality !== undefined) {
              totalSleepQuality += record.sleepQuality;
              qualityCount++;
            }
          });
          
          result.summary.totalSleepHours = parseFloat(totalSleepHours.toFixed(1));
          result.summary.avgSleepQuality = qualityCount > 0 ? 
            parseFloat((totalSleepQuality / qualityCount).toFixed(1)) : 0;
          
          // Update time range
          if (!result.timeRange.oldest || sleepData[0].createdAt < result.timeRange.oldest) {
            result.timeRange.oldest = sleepData[0].createdAt;
          }
          if (!result.timeRange.newest || sleepData[sleepData.length - 1].createdAt > result.timeRange.newest) {
            result.timeRange.newest = sleepData[sleepData.length - 1].createdAt;
          }
        }
        
      } catch (sleepError) {
        console.log("⚠️ Sleep error:", sleepError.message);
      }
    }
    
    // ====== 3. GET ALL FITNESS DATA ======
    if (Fitness) {
      try {
        const fitnessData = await Fitness.find({ userId }).sort({ createdAt: 1 }).lean();
        result.details.fitness = fitnessData;
        result.summary.totalWorkouts = fitnessData.length;
        console.log(`✅ Fitness: ${fitnessData.length} records (all time)`);
        
        if (fitnessData.length > 0) {
          // Update time range
          if (!result.timeRange.oldest || fitnessData[0].createdAt < result.timeRange.oldest) {
            result.timeRange.oldest = fitnessData[0].createdAt;
          }
          if (!result.timeRange.newest || fitnessData[fitnessData.length - 1].createdAt > result.timeRange.newest) {
            result.timeRange.newest = fitnessData[fitnessData.length - 1].createdAt;
          }
        }
        
      } catch (fitnessError) {
        console.log("⚠️ Fitness error:", fitnessError.message);
      }
    }
    
    // ====== 4. GET ALL NUTRITION DATA ======
    if (Nutrition) {
      try {
        const nutritionData = await Nutrition.find({ userId }).sort({ createdAt: 1 }).lean();
        result.details.nutrition = nutritionData;
        console.log(`✅ Nutrition: ${nutritionData.length} records (all time)`);
        
        if (nutritionData.length > 0) {
          // Update time range
          if (!result.timeRange.oldest || nutritionData[0].createdAt < result.timeRange.oldest) {
            result.timeRange.oldest = nutritionData[0].createdAt;
          }
          if (!result.timeRange.newest || nutritionData[nutritionData.length - 1].createdAt > result.timeRange.newest) {
            result.timeRange.newest = nutritionData[nutritionData.length - 1].createdAt;
          }
        }
        
      } catch (nutritionError) {
        console.log("⚠️ Nutrition error:", nutritionError.message);
      }
    }
    
    // ====== 5. GET ALL SELF-CARE DATA ======
    if (SelfCare) {
      try {
        const selfCareData = await SelfCare.find({ userId }).sort({ createdAt: 1 }).lean();
        result.details.selfCare = selfCareData;
        result.summary.totalSelfCare = selfCareData.length;
        console.log(`✅ Self-care: ${selfCareData.length} records (all time)`);
        
        if (selfCareData.length > 0) {
          // Update time range
          if (!result.timeRange.oldest || selfCareData[0].createdAt < result.timeRange.oldest) {
            result.timeRange.oldest = selfCareData[0].createdAt;
          }
          if (!result.timeRange.newest || selfCareData[selfCareData.length - 1].createdAt > result.timeRange.newest) {
            result.timeRange.newest = selfCareData[selfCareData.length - 1].createdAt;
          }
        }
        
      } catch (selfCareError) {
        console.log("⚠️ Self-care error:", selfCareError.message);
      }
    }
    
    // ====== 6. GET ALL COMMUNITY DATA ======
    if (CommunityPost) {
      try {
        const communityData = await CommunityPost.find({ userId }).sort({ createdAt: 1 }).lean();
        result.details.community = communityData;
        result.summary.totalPosts = communityData.length;
        console.log(`✅ Community: ${communityData.length} posts (all time)`);
        
        if (communityData.length > 0) {
          // Update time range
          if (!result.timeRange.oldest || communityData[0].createdAt < result.timeRange.oldest) {
            result.timeRange.oldest = communityData[0].createdAt;
          }
          if (!result.timeRange.newest || communityData[communityData.length - 1].createdAt > result.timeRange.newest) {
            result.timeRange.newest = communityData[communityData.length - 1].createdAt;
          }
        }
        
      } catch (communityError) {
        console.log("⚠️ Community error:", communityError.message);
      }
    }
    
    // ====== 7. FORMAT TIME RANGE ======
    if (result.timeRange.oldest) {
      result.timeRange.oldest = result.timeRange.oldest.toLocaleDateString();
    }
    if (result.timeRange.newest) {
      result.timeRange.newest = result.timeRange.newest.toLocaleDateString();
    }
    
    // ====== FINAL SUMMARY ======
    console.log(`\n📦 ALL TIME DATA SUMMARY:`);
    console.log(`   Sleep: ${result.details.sleep.length} records`);
    console.log(`   Fitness: ${result.details.fitness.length} records`);
    console.log(`   Nutrition: ${result.details.nutrition.length} records`);
    console.log(`   Self-care: ${result.details.selfCare.length} records`);
    console.log(`   Community: ${result.details.community.length} posts`);
    console.log(`   Time range: ${result.timeRange.oldest || 'N/A'} to ${result.timeRange.newest || 'N/A'}`);
    
    return result;
    
  } catch (error) {
    console.error("❌ Error in getUserAllTimeData:", error.message);
    console.error(error.stack);
    
    return {
      userInfo: { name: "User", email: "N/A" },
      summary: {
        totalSleepHours: 0,
        totalWorkouts: 0,
        totalPosts: 0,
        totalSelfCare: 0,
        avgSleepQuality: 0,
        avgCaloriesBurned: 0
      },
      details: {
        sleep: [],
        fitness: [],
        nutrition: [],
        selfCare: [],
        community: []
      },
      timeRange: {
        oldest: null,
        newest: null
      },
      error: error.message
    };
  }
}
// ====== REPORT FUNCTIONS ======
async function generateUserWeeklyReport(userId) {
  try {
    console.log(`\n⚡ GENERATING REPORT for user: ${userId}`);
    
    const weeklyData = await getUserWeeklyData(userId);
    
    // Get insights
    let insights = [];
    if (LabInsights) {
      insights = await LabInsights.find({ userId })
        .sort({ createdAt: -1 })
        .limit(20);
    }
    
    // Generate PDF
    const REPORT_DIR = path.join(__dirname, "../../report/generated");
    if (!fs.existsSync(REPORT_DIR)) {
      fs.mkdirSync(REPORT_DIR, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `Weekly_Report_${userId}_${timestamp}.pdf`;
    const filePath = path.join(REPORT_DIR, fileName);
    
    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    
    // PDF content
    doc.fontSize(24).fillColor('#2E86C1').text('MyLab Weekly Health Report', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#666')
       .text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' })
       .text(`For: ${weeklyData.userInfo.name}`, { align: 'center' });
    doc.moveDown(1);
    
    const summary = weeklyData.summary;
    doc.fontSize(18).fillColor('#2C3E50').text('📊 Weekly Activity Summary', { underline: true });
    doc.moveDown(0.5);
    
    doc.fontSize(12)
       .text(`• Sleep: ${summary.totalSleepHours} hours (Quality: ${summary.avgSleepQuality}/10)`)
       .text(`• Workouts: ${summary.totalWorkouts} sessions`)
       .text(`• Self-Care: ${summary.totalSelfCare} activities`)
       .text(`• Community: ${summary.totalPosts} posts`);
    
    doc.end();
    
    await new Promise((resolve) => writeStream.on('finish', resolve));
    
    return {
      success: true,
      filePath,
      fileName,
      downloadUrl: `/labinsights/lab/weekly-report/download/${fileName}`,
      summary: weeklyData.summary
    };
    
  } catch (error) {
    console.error('❌ Error generating user weekly report:', error);
    return { 
      success: false, 
      message: error.message
    };
  }
}

async function generateAllUsersWeeklyReports() {
  try {
    const users = await User.find({}).select('_id');
    const reports = [];
    
    for (const user of users) {
      const report = await generateUserWeeklyReport(user._id);
      if (report.success) {
        reports.push(report);
      }
    }
    
    return {
      success: true,
      totalGenerated: reports.length,
      reports: reports.map(r => ({
        userId: r.userId,
        fileName: r.fileName
      }))
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// ====== EXPORTS ======
module.exports = {
  generateInsight,
  getUserInsights,
  getUserWeeklyData,
  getUserAllTimeData,
  generateUserWeeklyReport,
  generateAllUsersWeeklyReports,
  debugDataSources
};