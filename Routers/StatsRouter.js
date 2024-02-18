const { user,orders, Earnings, WeekEarnings, recentTranscations } = require("../Controllers/StatsController");
const {isAdmin}=require('../Middleware/auth');
const router = require("express").Router();
router.get('/userstats',isAdmin,user)
router.get('/orderstats',isAdmin,orders)
router.get('/earningstats',isAdmin,Earnings)
router.get('/week-sales',isAdmin,WeekEarnings)
router.get('/',isAdmin,recentTranscations)

module.exports = router;