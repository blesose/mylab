const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const LabInsights = require("../models/labInsights.model");
const { analyzeData } = require("./labInsights.analysis");

let SleepRecord, Fitness, Nutrition, SelfCare, CommunityPost, User;


try {
  SleepRecord = require("../../sleepRecovery/models/sleep.model");
  console.log('SleepRecord loaded');
} catch (e) {
  try {
    SleepRecord = require("../../sleep/models/sleep.model");
    console.log('SleepRecord loaded from alternative path');
  } catch (e2) { 
  console.log('SleepRecord:', e2.message); } }

try {
  Fitness = require("../../fitness&Nutrition/models/fitness.model");
  console.log('Fitness loaded');
} catch (e) { 
  try {
    Fitness = require("../../fitness/models/fitness.model");
    console.log('Fitness loaded from alternative path');
  } catch (e2) {
    console.log('Fitness:', e2.message);
  }
}

try {
  Nutrition = require("../../fitness&Nutrition/models/nutrition.model");
  console.log('Nutrition loaded');
} catch (e) { 
  try {
    Nutrition = require("../../Nutrition/models/nutrition.model");
    console.log('Nutrition loaded from alternative path');
  } catch (e2) {
    console.log('Nutrition:', e2.message);
  }
}

try {
  SelfCare = require("../../selfCare/models/selfCare.model");
  console.log('SelfCare loaded');
} catch (e) { 
  try {
    SelfCare = require("../../selfCare/models/selfCare.model");
    console.log('SelfCare loaded from alternative path');
  } catch (e2) {
    console.log('SelfCare:', e2.message);
  }
}

try {
  CommunityPost = require("../../communityPost/models/communityPost.model");
  console.log('CommunityPost loaded');
} catch (e) { 
  try {
    CommunityPost = require("../../community/models/communityPost.model");
    console.log('CommunityPost loaded from alternative path');
  } catch (e2) {
    console.log('CommunityPost:', e2.message);
  }
}

try {
  User = require("../../users/models/user.schema");
  console.log('User loaded');
} catch (e) { 
  try {
    User = require("../../auth/models/user.model");
    console.log('User loaded from alternative path');
  } catch (e2) {
    console.log('User:', e2.message);
  }
}

async function debugDataSources(userId) {
  console.log("\n🔍 DEBUG: Checking data sources for user:", userId);
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  try {
    console.log("1. Checking model availability:");
    console.log("   - SleepRecord:", SleepRecord ? "✓ Found" : "✗ Missing");
    console.log("   - Fitness:", Fitness ? "✓ Found" : "✗ Missing");
    console.log("   - Nutrition:", Nutrition ? "✓ Found" : "✗ Missing");
    console.log("   - SelfCare:", SelfCare ? "✓ Found" : "✗ Missing");
    console.log("   - CommunityPost:", CommunityPost ? "✓ Found" : "✗ Missing");
    console.log("   - LabInsights:", LabInsights ? "✓ Found" : "✗ Missing");
    
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
    
    if (LabInsights) {
      const insightsCount = await LabInsights.countDocuments({ userId });
      console.log("   - LabInsights records:", insightsCount);
    } else {
      console.log("   - LabInsights: Model not available");
    }
    
    return true;
  } catch (error) {
    console.log("Debug error:", error.message);
    return false;
  }
}

async function generateInsight(userId, category, data) {
  try {
    console.log(`\n🔧 generateInsight called for ${category}:`);
    console.log(`   Data: ${JSON.stringify(data)}`);
    console.log(`   Data length: ${data.length}`);
 
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error(`Cannot generate ${category} insight: No data provided`);
    }
    
    const result = await analyzeData(userId, category, data);
 
    if (!LabInsights) {
      throw new Error("LabInsights model is not defined. Check imports.");
    }
    
    const insight = new LabInsights(result);
    await insight.save();
    
    console.log(`Created ${category} insight with ${data.length} data points`);
    console.log(`Summary: ${result.summary}`);
    
    return insight;
    
  } catch (error) {
    console.error(`Error generating ${category} insight:`, error.message);
    throw error;
  }
}

async function getUserInsights(userId) {
  if (!LabInsights) {
    console.log("LabInsights model not available");
    return [];
  }
  return LabInsights.find({ userId }).sort({ createdAt: -1 });
}

async function getUserWeeklyData(userId) {
  try {
    console.log(`\n [getUserWeeklyData] Fetching ALL weekly data for user: ${userId}`);
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    console.log(`   Date range: ${oneWeekAgo.toISOString()} to now`);
 
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
  
    try {
      if (User) {
        const user = await User.findById(userId).select("name email");
        if (user) {
          defaultData.userInfo = user;
          console.log(`User info loaded: ${user.name || 'N/A'}`);
        }
      }
    } catch (userError) {
      console.log("User error:", userError.message);
    }
    
    if (SleepRecord) {
      try {
        const sleepData = await SleepRecord.find({ 
          userId, 
          createdAt: { $gte: oneWeekAgo } 
        }).lean();
        
        defaultData.details.sleep = sleepData;
        console.log(`Sleep: ${sleepData.length} records`);
       
        let totalSleepHours = 0;
        let totalSleepQuality = 0;
        let qualityCount = 0;
        
        sleepData.forEach(record => {
          let duration = 0;
          if (record.duration) duration = record.duration;
          else if (record.sleepHours) duration = record.sleepHours;
          else if (record.hours) duration = record.hours;
          else if (record.sleepStart && record.sleepEnd) {
            try {
              const parseTime = (timeStr) => {
                const [hours, minutes] = timeStr.split(':').map(Number);
                return hours + (minutes / 60);
              };
              const start = parseTime(record.sleepStart);
              const end = parseTime(record.sleepEnd);
              let diff = end - start;
              if (diff < 0) diff += 24;
              duration = diff;
            } catch (e) {
              duration = 7; 
            }
          }
          
          totalSleepHours += duration;

          if (record.sleepQuality !== undefined) {
            totalSleepQuality += record.sleepQuality;
            qualityCount++;
          } else if (record.quality !== undefined) {
            totalSleepQuality += record.quality;
            qualityCount++;
          }
        });
        
        defaultData.summary.totalSleepHours = parseFloat(totalSleepHours.toFixed(1));
        defaultData.summary.avgSleepQuality = qualityCount > 0 ? 
          parseFloat((totalSleepQuality / qualityCount).toFixed(1)) : 0;
        
      } catch (sleepError) {
        console.log("Sleep error:", sleepError.message);
      }
    }

    if (Fitness) {
      try {
        const fitnessData = await Fitness.find({ 
          userId, 
          createdAt: { $gte: oneWeekAgo } 
        }).lean();
        
        defaultData.details.fitness = fitnessData;
        defaultData.summary.totalWorkouts = fitnessData.length;
        console.log(`Fitness: ${fitnessData.length} records`);

        if (fitnessData.length > 0) {
          let totalCalories = 0;
          fitnessData.forEach(record => {
            if (record.caloriesBurned) {
              totalCalories += record.caloriesBurned;
            } else if (record.duration) {
              // Rough estimate: 5-10 calories per minute
              totalCalories += record.duration * 7;
            }
          });
          defaultData.summary.avgCaloriesBurned = totalCalories;
        }
        
      } catch (fitnessError) {
        console.log("Fitness error:", fitnessError.message);
      }
    }

    if (Nutrition) {
      try {
        const nutritionData = await Nutrition.find({ 
          userId, 
          createdAt: { $gte: oneWeekAgo } 
        }).lean();
        
        defaultData.details.nutrition = nutritionData;
        console.log(`Nutrition: ${nutritionData.length} records`);
        
      } catch (nutritionError) {
        console.log("Nutrition error:", nutritionError.message);
      }
    }
  
    if (SelfCare) {
      try {
        const selfCareData = await SelfCare.find({ 
          userId, 
          createdAt: { $gte: oneWeekAgo } 
        }).lean();
        
        defaultData.details.selfCare = selfCareData;
        defaultData.summary.totalSelfCare = selfCareData.length;
        console.log(`Self-care: ${selfCareData.length} records`);
        
      } catch (selfCareError) {
        console.log("Self-care error:", selfCareError.message);
      }
    }
    
    if (CommunityPost) {
      try {
        const communityData = await CommunityPost.find({ 
          userId, 
          createdAt: { $gte: oneWeekAgo } 
        }).lean();
        
        defaultData.details.community = communityData;
        defaultData.summary.totalPosts = communityData.length;
        console.log(`Community: ${communityData.length} posts`);
        
      } catch (communityError) {
        console.log("Community error:", communityError.message);
      }
    }
    
    console.log(`\n📦 FINAL DATA SUMMARY:`);
    console.log(`   Sleep: ${defaultData.details.sleep.length} records, ${defaultData.summary.totalSleepHours} hours`);
    console.log(`   Fitness: ${defaultData.details.fitness.length} records`);
    console.log(`   Nutrition: ${defaultData.details.nutrition.length} records`);
    console.log(`   Self-care: ${defaultData.details.selfCare.length} records`);
    console.log(`   Community: ${defaultData.details.community.length} posts`);
    
    return defaultData;
    
  } catch (error) {
    console.error("Error in getUserWeeklyData:", error.message);
    
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
    
    try {
      if (User) {
        const user = await User.findById(userId).select("name email");
        if (user) result.userInfo = user;
        console.log(`User info loaded: ${user?.name || 'N/A'}`);
      }
    } catch (userError) {
      console.log("User error:", userError.message);
    }
    
    if (SleepRecord) {
      try {
        const sleepData = await SleepRecord.find({ userId }).sort({ createdAt: 1 }).lean();
        result.details.sleep = sleepData;
        console.log(`Sleep: ${sleepData.length} records (all time)`);
        
        if (sleepData.length > 0) {
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
          result.summary.totalSleepHours = parseFloat(totalSleepHours.toFixed(1));
          result.summary.avgSleepQuality = qualityCount > 0 ? 
            parseFloat((totalSleepQuality / qualityCount).toFixed(1)) : 0;
          if (!result.timeRange.oldest || sleepData[0].createdAt < result.timeRange.oldest) {
            result.timeRange.oldest = sleepData[0].createdAt;
          }
          if (!result.timeRange.newest || sleepData[sleepData.length - 1].createdAt > result.timeRange.newest) {
            result.timeRange.newest = sleepData[sleepData.length - 1].createdAt;
          }
        }
        
      } catch (sleepError) {
        console.log("Sleep error:", sleepError.message);
      }
    }
    
    if (Fitness) {
      try {
        const fitnessData = await Fitness.find({ userId }).sort({ createdAt: 1 }).lean();
        result.details.fitness = fitnessData;
        result.summary.totalWorkouts = fitnessData.length;
        console.log(`Fitness: ${fitnessData.length} records (all time)`);
        
        if (fitnessData.length > 0) {
          if (!result.timeRange.oldest || fitnessData[0].createdAt < result.timeRange.oldest) {
            result.timeRange.oldest = fitnessData[0].createdAt;
          }
          if (!result.timeRange.newest || fitnessData[fitnessData.length - 1].createdAt > result.timeRange.newest) {
            result.timeRange.newest = fitnessData[fitnessData.length - 1].createdAt;
          }
        }
        
      } catch (fitnessError) {
        console.log("Fitness error:", fitnessError.message);
      }
    }
    
    if (Nutrition) {
      try {
        const nutritionData = await Nutrition.find({ userId }).sort({ createdAt: 1 }).lean();
        result.details.nutrition = nutritionData;
        console.log(`Nutrition: ${nutritionData.length} records (all time)`);
        
        if (nutritionData.length > 0) {
          if (!result.timeRange.oldest || nutritionData[0].createdAt < result.timeRange.oldest) {
            result.timeRange.oldest = nutritionData[0].createdAt;
          }
          if (!result.timeRange.newest || nutritionData[nutritionData.length - 1].createdAt > result.timeRange.newest) {
            result.timeRange.newest = nutritionData[nutritionData.length - 1].createdAt;
          }
        }
        
      } catch (nutritionError) {
        console.log("Nutrition error:", nutritionError.message);
      }
    }

    if (SelfCare) {
      try {
        const selfCareData = await SelfCare.find({ userId }).sort({ createdAt: 1 }).lean();
        result.details.selfCare = selfCareData;
        result.summary.totalSelfCare = selfCareData.length;
        console.log(`Self-care: ${selfCareData.length} records (all time)`);
        
        if (selfCareData.length > 0) {
          if (!result.timeRange.oldest || selfCareData[0].createdAt < result.timeRange.oldest) {
            result.timeRange.oldest = selfCareData[0].createdAt;
          }
          if (!result.timeRange.newest || selfCareData[selfCareData.length - 1].createdAt > result.timeRange.newest) {
            result.timeRange.newest = selfCareData[selfCareData.length - 1].createdAt;
          }
        }
        
      } catch (selfCareError) {
        console.log("Self-care error:", selfCareError.message);
      }
    }

    if (CommunityPost) {
      try {
        const communityData = await CommunityPost.find({ userId }).sort({ createdAt: 1 }).lean();
        result.details.community = communityData;
        result.summary.totalPosts = communityData.length;
        console.log(`Community: ${communityData.length} posts (all time)`);
        
        if (communityData.length > 0) {
          if (!result.timeRange.oldest || communityData[0].createdAt < result.timeRange.oldest) {
            result.timeRange.oldest = communityData[0].createdAt;
          }
          if (!result.timeRange.newest || communityData[communityData.length - 1].createdAt > result.timeRange.newest) {
            result.timeRange.newest = communityData[communityData.length - 1].createdAt;
          }
        }
        
      } catch (communityError) {
        console.log("Community error:", communityError.message);
      }
    }
   
    if (result.timeRange.oldest) {
      result.timeRange.oldest = result.timeRange.oldest.toLocaleDateString();
    }
    if (result.timeRange.newest) {
      result.timeRange.newest = result.timeRange.newest.toLocaleDateString();
    }
    
    console.log(`\n📦 ALL TIME DATA SUMMARY:`);
    console.log(`Sleep: ${result.details.sleep.length} records`);
    console.log(`Fitness: ${result.details.fitness.length} records`);
    console.log(`Nutrition: ${result.details.nutrition.length} records`);
    console.log(`Self-care: ${result.details.selfCare.length} records`);
    console.log(`Community: ${result.details.community.length} posts`);
    console.log(`Time range: ${result.timeRange.oldest || 'N/A'} to ${result.timeRange.newest || 'N/A'}`);
    
    return result;
    
  } catch (error) {
    console.error("Error in getUserAllTimeData:", error.message);
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

async function generateUserWeeklyReport(userId) {
  try {
    console.log(`\n GENERATING REPORT for user: ${userId}`);
    
    const weeklyData = await getUserWeeklyData(userId);
    console.log('Weekly Data for Report:', JSON.stringify(weeklyData.summary, null, 2));
    
    let insights = [];
    if (LabInsights) {
      insights = await LabInsights.find({ userId })
        .sort({ createdAt: -1 })
        .limit(20);
    }
    
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
    
    doc.fontSize(24).fillColor('#2E86C1').text('MyLab Weekly Health Report', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#666')
       .text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' })
       .text(`For: ${weeklyData.userInfo.name || 'User'}`, { align: 'center' });
    doc.moveDown(1);
    
    const summary = weeklyData.summary;
    doc.fontSize(18).fillColor('#2C3E50').text('📊 Weekly Activity Summary', { underline: true });
    doc.moveDown(0.5);
    
    doc.fontSize(12)
       .text(`• Sleep: ${summary.totalSleepHours || 0} hours (Quality: ${summary.avgSleepQuality || 0}/10)`)
       .text(`• Workouts: ${summary.totalWorkouts || 0} sessions`)
       .text(`• Calories Burned: ${summary.avgCaloriesBurned || 0} kcal`)
       .text(`• Meals Logged: ${weeklyData.details.nutrition?.length || 0} meals`)
       .text(`• Self-Care: ${summary.totalSelfCare || 0} activities`)
       .text(`• Community: ${summary.totalPosts || 0} posts`);
    
    if (weeklyData.details.fitness?.length > 0) {
      doc.moveDown(1);
      doc.fontSize(14).fillColor('#2C3E50').text('🏋️ Workout Details', { underline: true });
      doc.moveDown(0.5);
      weeklyData.details.fitness.slice(0, 5).forEach(workout => {
        doc.fontSize(10)
           .text(`• ${workout.activityType || 'Workout'}: ${workout.duration || 0} mins - ${workout.caloriesBurned || workout.duration * 7 || 0} kcal`);
      });
    }
    
    if (weeklyData.details.sleep?.length > 0) {
      doc.moveDown(1);
      doc.fontSize(14).fillColor('#2C3E50').text('Sleep Details', { underline: true });
      doc.moveDown(0.5);
      weeklyData.details.sleep.slice(0, 5).forEach(sleep => {
        doc.fontSize(10)
           .text(`• ${new Date(sleep.createdAt).toLocaleDateString()}: ${sleep.duration || sleep.sleepHours || 0} hours - Quality: ${sleep.sleepQuality || sleep.quality || 0}/10`);
      });
    }
    
    doc.end();
    
    await new Promise((resolve) => writeStream.on('finish', resolve));
    
    return {
      success: true,
      filePath,
      fileName,
      downloadUrl: `/api/labinsights/lab/weekly-report/download/${fileName}`,
      summary: weeklyData.summary
    };
    
  } catch (error) {
    console.error('Error generating user weekly report:', error);
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

module.exports = {
  generateInsight,
  getUserInsights,
  getUserWeeklyData,
  getUserAllTimeData,
  generateUserWeeklyReport,
  generateAllUsersWeeklyReports,
  debugDataSources
};