const express = require("express");
const router = express.Router();

const {
  ensureAuthenticated,
  addUserData,
} = require("../middlewares/auth.middleware");

const {
  getPC,
  postPC,
  getTeamList,
  deleteTeam,
  paymentDoneTeam,
  selectTeam,
  getEditTeam,
  postEditTeam
} = require("../controllers/programmingContest.controller");

router.get("/register", ensureAuthenticated, addUserData, getPC);
router.post("/register", ensureAuthenticated, addUserData, postPC);

router.get("/list", ensureAuthenticated, addUserData, getTeamList);
router.get("/delete/:id", ensureAuthenticated, addUserData, deleteTeam);
router.get("/paymentDone/:id", ensureAuthenticated, addUserData, paymentDoneTeam);
router.get("/select/:id", ensureAuthenticated, addUserData, selectTeam);
router.get("/:id", ensureAuthenticated, addUserData, getEditTeam);
router.post("/:id", ensureAuthenticated, addUserData, postEditTeam);

module.exports = router;
