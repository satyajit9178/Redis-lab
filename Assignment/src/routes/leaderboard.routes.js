const express = require("express");

const router = express.Router();

const {
    recordProfileView,
    awardScore,
    getLeaderBoard,
    getUserRank
} = require("../controllers/leaderboard.controller");

router.post("/:id/view", recordProfileView);
router.post("/score", awardScore);
router.get("/",getLeaderBoard);
router.get("/:userid/rank",getUserRank);



module.exports = router;