import { sendError, sendResponse } from '../../../helpers/responseHelper.js';
import { fetchLeaderboard } from '../../../helpers/leaderboardHelper/leaderboard.js';

const getLeaderboard = async (event, context) => {
  const { id } = event.pathParameters;

  try {
    const items = await fetchLeaderboard(id);

    const itemsByAscOrder = items.sort((a, b) => b.score - a.score);

    return sendResponse(200, itemsByAscOrder);
  } catch (error) {
    return sendError(500, { error: error.message });
  }
};

export const handler = getLeaderboard;
