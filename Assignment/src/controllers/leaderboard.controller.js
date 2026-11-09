const {
    incrementProfileViews,
        incrementUserScore,
        getLeaderBoard:fetchLeaderBoard,
        getUserRank:fetchUserRank,
} = require("../services/leaderboard.service");

async function recordProfileView(req, res) {

    try {

        const { id } = req.params;

        // Validate user ID
        if (!/^[a-zA-Z0-9_-]{1,64}$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const totalViews = await incrementProfileViews(id);

        return res.status(200).json({
            success: true,
            userId: id,
            totalViews
        });

    } catch (error) {

        console.error("View tracking error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to record profile view"
        });
    }
}

async function awardScore(req,res){

    try{
        const {userId,points} = req.body;
                if (
            !Number.isSafeInteger(points) ||
            points <= 0 ||
            points > 1000000
        ) {
            return res.status(400).json({
                success: false,
                message: "Points must be a positive integer up to 1000000"
            });
        }


        const newScore = await incrementUserScore(
            userId,
            points
        );

        return res.status(200).json({
            success: true,
            userId,
            newScore
        });
    }
    catch(error){
        console.error("Score update error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update score"
        });
    }
}

async function getLeaderBoard(req,res){

    try{
        const rawLimit = req.query.limit ?? "10";
    const limit  = Number(rawLimit);

    if(!Number.isInteger(limit) || limit<=0 || limit >100){
        return res.status(400).json({
            success:false,
            message:"Limit must be an integer and in between 1 to 100",
        })
    }

    const leaderboard = await fetchLeaderBoard(limit);
    return res.status(200).json({
        success:true,
        totalUser:leaderboard.length,
        leaderboard,
    })
    }catch(error){
        console.log("Leaderboard fetch error",error);
        return res.status(400).json({
            success:falas,
            message:"Unable to fetch leaderboard",
        });
    }
}

async function getUserRank(req, res) {

    try {

        const { userid } = req.params;

        // Validate user ID
        if (!/^[a-zA-Z0-9_-]{1,64}$/.test(userid)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const result = await fetchUserRank(userid);

        // User has no leaderboard score
        if (result === null) {
            return res.status(404).json({
                success: false,
                message: "User not found in leaderboard"
            });
        }

        return res.status(200).json({
            success: true,
            userId: userid,
            rank: result.rank,
            score: result.score
        });

    } catch (error) {

        console.error("Rank fetch error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch user rank"
        });
    }
}
module.exports = {
    recordProfileView,
    awardScore,
    getLeaderBoard,
    getUserRank,
};