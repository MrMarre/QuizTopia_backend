import middy from '@middy/core';
import { sendError, sendResponse } from '../../../helpers/responseHelper.js';
import { tokenValidator } from '../../../utils/auth.js';
import { fetchLeaderboard } from '../../../helpers/leaderboardHelper/leaderboard.js';

const getLeaderboard = async (event, context) => {
  console.log('EVENT:', event);

  const { id } = event.pathParameters;

  try {
    const items = await fetchLeaderboard(id);

    const itemsByAscOrder = items.sort((a, b) => b.score - a.score);

    console.log('Items to return:', itemsByAscOrder);

    return sendResponse(200, items);
  } catch (error) {
    return sendError(500, { error: error.message });
  }
};

export const handler = getLeaderboard;
