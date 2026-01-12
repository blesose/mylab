const express = require("express");
const labinsightRouter = express.Router();
const { authMiddleware } = require("../../../middleware/auth.middleware");
const { 
  createInsight, 
  fetchInsights, 
  getDashboardInsights, 
  downloadWeeklyReport,
  fetchAInsights,
  generateWeeklyReport
} = require("../controllers/labInsights.controller");

// ====== CORE ROUTES ======
labinsightRouter.post("/create", authMiddleware, createInsight);
labinsightRouter.get("/all", authMiddleware, fetchInsights);
labinsightRouter.get("/a/:insightId", authMiddleware, fetchAInsights);
labinsightRouter.get("/dashboard", authMiddleware, getDashboardInsights);
labinsightRouter.post("/weekly-report/generate", authMiddleware, generateWeeklyReport);
labinsightRouter.get("/weekly-report/download", authMiddleware, downloadWeeklyReport);
labinsightRouter.get("/weekly-report/download/:filename", authMiddleware, downloadWeeklyReport);

// ====== REAL DATA COLLECTION ======
labinsightRouter.post("/collect-real-data", authMiddleware, async (req, res) => {
  try {
    const { generateInsight, getUserWeeklyData } = require("../services/labInsights.service");
    
    const userId = req.userId;
    const { category } = req.body;
    
    if (!category) {
      return res.status(400).json({ 
        success: false,
        error: "Category is required. Options: sleepRecovery, fitness, nutrition, selfCare, community" 
      });
    }
    
    console.log(`\n📊 [collect-real-data] Starting for user ${userId}, category: ${category}`);
    
    // Get weekly data
    const weeklyData = await getUserWeeklyData(userId);
    
    let realData = [];
    let recordCount = 0;
    
    // Extract data based on category
    switch (category) {
      case 'sleepRecovery':
        recordCount = weeklyData.details.sleep?.length || 0;
        if (recordCount > 0) {
          realData = weeklyData.details.sleep.map(record => 
            record.sleepQuality || record.quality || 5
          );
          console.log(`✅ Extracted ${recordCount} sleep quality values:`, realData);
        }
        break;
        
      case 'fitness':
        recordCount = weeklyData.details.fitness?.length || 0;
        if (recordCount > 0) {
          // Use duration from fitness model
          realData = weeklyData.details.fitness.map(record => 
            record.duration || record.intensityValue || 0
          );
        }
        break;
        
      case 'nutrition':
        recordCount = weeklyData.details.nutrition?.length || 0;
        if (recordCount > 0) {
          realData = weeklyData.details.nutrition.map(record => 
            record.calories || record.nutritionScore || record.rating || 0
          );
        }
        break;
        
      case 'selfCare':
        recordCount = weeklyData.details.selfCare?.length || 0;
        if (recordCount > 0) {
          realData = weeklyData.details.selfCare.map(record => 
            record.moodScore || record.duration || 0
          );
        }
        break;
        
      case 'community':
        recordCount = weeklyData.details.community?.length || 0;
        if (recordCount > 0) {
          realData = Array(recordCount).fill(1);
        }
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: `Unsupported category: ${category}`
        });
    }
    
    // Check if we have data
    if (recordCount === 0) {
      return res.status(404).json({
        success: false,
        message: `No ${category} records found for this user.`,
        suggestion: `Create ${category} records first.`
      });
    }
    
    // Generate insight
    const insight = await generateInsight(userId, category, realData);
    
    res.json({
      success: true,
      message: `Created insight from ${recordCount} real ${category} records`,
      insight: {
        id: insight._id,
        category: insight.category,
        summary: insight.summary,
        aiGeneratedTips: insight.aiGeneratedTips,
        createdAt: insight.createdAt
      },
      dataSummary: {
        recordCount,
        average: (realData.reduce((a, b) => a + b, 0) / realData.length).toFixed(2),
        dataSample: realData.slice(0, 5)
      }
    });
    
  } catch (error) {
    console.error("❌ Error in collect-real-data:", error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add this new endpoint to your routes file
labinsightRouter.post("/collect-alltime-data", authMiddleware, async (req, res) => {
  try {
    const { generateInsight, getUserAllTimeData } = require("../services/labInsights.service");
    
    const userId = req.userId;
    const { category } = req.body;
    
    if (!category) {
      return res.status(400).json({ 
        success: false,
        error: "Category is required. Options: sleepRecovery, fitness, nutrition, selfCare, community" 
      });
    }
    
    console.log(`\n📊 [collect-alltime-data] Starting for user ${userId}, category: ${category}`);
    
    // Get ALL TIME data (not just 7 days)
    const allTimeData = await getUserAllTimeData(userId);
    
    let realData = [];
    let recordCount = 0;
    
    // Extract data based on category
    switch (category) {
      case 'sleepRecovery':
        recordCount = allTimeData.details.sleep?.length || 0;
        if (recordCount > 0) {
          realData = allTimeData.details.sleep.map(record => 
            record.sleepQuality || record.quality || 5
          );
          console.log(`✅ Extracted ${recordCount} sleep quality values from all time`);
        }
        break;
        
      case 'fitness':
        recordCount = allTimeData.details.fitness?.length || 0;
        if (recordCount > 0) {
          realData = allTimeData.details.fitness.map(record => 
            record.duration || record.intensityValue || 0
          );
        }
        break;
        
      case 'nutrition':
        recordCount = allTimeData.details.nutrition?.length || 0;
        if (recordCount > 0) {
          realData = allTimeData.details.nutrition.map(record => 
            record.calories || record.nutritionScore || record.rating || 0
          );
        }
        break;
        
      case 'selfCare':
        recordCount = allTimeData.details.selfCare?.length || 0;
        if (recordCount > 0) {
          realData = allTimeData.details.selfCare.map(record => 
            record.moodScore || record.duration || 0
          );
        }
        break;
        
      case 'community':
        recordCount = allTimeData.details.community?.length || 0;
        if (recordCount > 0) {
          realData = allTimeData.details.community.map(record => 
            record.likes || record.comments || 1
          );
        }
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: `Unsupported category: ${category}`
        });
    }
    
    // Check if we have data
    if (recordCount === 0) {
      return res.status(404).json({
        success: false,
        message: `No ${category} records found for this user in your entire history.`,
        suggestion: `Start tracking ${category} activities to build your history.`
      });
    }
    
    // Generate insight from ALL TIME data
    const insight = await generateInsight(userId, category, realData);
    
    res.json({
      success: true,
      message: `Created insight from ${recordCount} ${category} records (ALL TIME)`,
      timePeriod: "All time (entire history)",
      insight: {
        id: insight._id,
        category: insight.category,
        summary: insight.summary,
        aiGeneratedTips: insight.aiGeneratedTips,
        createdAt: insight.createdAt
      },
      dataSummary: {
        recordCount,
        timeRange: `From ${allTimeData.timeRange?.oldest || 'unknown'} to ${allTimeData.timeRange?.newest || 'now'}`,
        average: (realData.reduce((a, b) => a + b, 0) / realData.length).toFixed(2),
        min: Math.min(...realData),
        max: Math.max(...realData),
        dataSample: realData.slice(0, 5)
      }
    });
    
  } catch (error) {
    console.error("❌ Error in collect-alltime-data:", error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ====== VERIFICATION ROUTES ======
labinsightRouter.get("/verify-insights", authMiddleware, async (req, res) => {
  try {
    const { getUserInsights, getUserWeeklyData } = require("../services/labInsights.service");
    
    const userId = req.userId;
    const insights = await getUserInsights(userId);
    const weeklyData = await getUserWeeklyData(userId);
    
    const verifiedInsights = insights.map(insight => {
      let actualRecordCount = 0;
      
      switch(insight.category) {
        case 'sleepRecovery':
          actualRecordCount = weeklyData.details.sleep?.length || 0;
          break;
        case 'fitness':
          actualRecordCount = weeklyData.details.fitness?.length || 0;
          break;
        case 'nutrition':
          actualRecordCount = weeklyData.details.nutrition?.length || 0;
          break;
        case 'selfCare':
          actualRecordCount = weeklyData.details.selfCare?.length || 0;
          break;
        case 'community':
          actualRecordCount = weeklyData.details.community?.length || 0;
          break;
      }
      
      const match = insight.summary.match(/based on (\d+) records?/);
      const claimedRecords = match ? parseInt(match[1]) : 0;
      
      return {
        insightId: insight._id,
        category: insight.category,
        summary: insight.summary,
        claimedRecords,
        actualRecords: actualRecordCount,
        hasRealData: actualRecordCount > 0,
        isAccurate: claimedRecords <= actualRecordCount
      };
    });
    
    res.json({
      success: true,
      userId,
      insights: verifiedInsights
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ====== DEBUG ROUTES ======
labinsightRouter.get("/debug/data-sources", authMiddleware, async (req, res) => {
  try {
    const { debugDataSources } = require("../services/labInsights.service");
    await debugDataSources(req.userId);
    
    res.json({
      success: true,
      userId: req.userId,
      message: "Debug info logged to console"
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ====== ACTIVITY STATS ======
labinsightRouter.get("/activity-stats", authMiddleware, async (req, res) => {
  try {
    const { getUserWeeklyData } = require("../services/labInsights.service");
    const weeklyData = await getUserWeeklyData(req.userId);
    
    res.json({
      success: true,
      userId: req.userId,
      period: "Last 7 days",
      summary: weeklyData.summary,
      recordCounts: {
        sleep: weeklyData.details.sleep?.length || 0,
        fitness: weeklyData.details.fitness?.length || 0,
        nutrition: weeklyData.details.nutrition?.length || 0,
        selfCare: weeklyData.details.selfCare?.length || 0,
        community: weeklyData.details.community?.length || 0
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ====== TEST ENDPOINTS ======
labinsightRouter.get("/test", (req, res) => {
  res.json({ 
    success: true,
    status: "ok", 
    message: "LabInsights API v3",
    timestamp: new Date().toISOString()
  });
});

labinsightRouter.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "labinsights",
    timestamp: new Date().toISOString()
  });
});

module.exports = { labinsightRouter };