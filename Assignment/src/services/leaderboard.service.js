const redis = require("../config/redis");

const { VIEW_KEY,SCORE_KEY } = require("../config/keys");

async function incrementProfileViews(userId) {

    const key = VIEW_KEY(userId);

    const totalViews = await redis.incr(key);

    return totalViews;
}

async function incrementUserScore(userId,points){

    const newScore = await redis.zincrby(
        SCORE_KEY,
        points,
        userId
    )

    return Number(newScore);
}

async function getLeaderBoard(limit=10){

    const result = await redis.zrevrange(
        SCORE_KEY,
        0,
        limit-1,
        "WITHSCORES"
    );

    const leaderboard = [];

    for(let i=0;i<result.length;i+=2){
        leaderboard.push({
            userId:result[i],
            score:Number(result[i+1]),
            rank:leaderboard.length+1,
        })
    }

    return leaderboard;
}

async function getUserRank(userId) {

    // Get zero-based rank
    const redisRank = await redis.zrevrank(
        SCORE_KEY,
        userId
    );

    // User doesn't exist in the leaderboard
    if (redisRank === null) {
        return null;
    }

    // Get actual score
    const score = await redis.zscore(
        SCORE_KEY,
        userId
    );

    return {
        rank: redisRank + 1,
        score: Number(score)
    };
}
module.exports = {
    incrementProfileViews,
    incrementUserScore,
    getLeaderBoard,
    getUserRank,
};