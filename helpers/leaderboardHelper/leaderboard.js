import { db } from '../../db.js';
import { sendError } from '../responseHelper.js';

export const createLeaderboard = async (table) => {
  const item = {
    username: table.username,
    quizId: table.quizId,
    createdAt: new Date().toISOString(),
    score: table.score,
  };

  try {
    await db.put({
      TableName: 'leaderboardTable',
      Item: item,
    });

    return;
  } catch (error) {
    return sendError(500, error.message);
  }
};

export const fetchLeaderboard = async (quizId) => {
  const params = {
    TableName: 'leaderboardTable',
    KeyConditionExpression: 'quizId = :quizId',
    ExpressionAttributeValues: {
      ':quizId': quizId,
    },
  };

  try {
    const result = await db.query(params);

    return result.Items || [];
  } catch (error) {
    console.log(error.message);
    return sendError(500, error.message);
  }
};
