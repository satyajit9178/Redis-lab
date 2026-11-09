const express = require("express");

const leaderboardRoutes = require("./routes/leaderboard.routes");

const app = express();

app.use(express.json());

app.use("/leaderboard", leaderboardRoutes);

app.get("/", (req, res) => {
    res.send("Leaderboard API is running");
});

module.exports = app;