import middy from '@middy/core';
import { sendError, sendResponse } from '../../../helpers/responseHelper.js';
import { getQuizById } from '../../../helpers/quizHelper/quiz.js';
import { getUser } from '../../../utils/getUser.js';
import { createLeaderboard } from '../../../helpers/leaderboardHelper/leaderboard.js';
import { tokenValidator } from '../../../utils/auth.js';

// Haffa dessa jao
// HASHKEY: quizId;
// RANGEKEY: username;

// Det finns en "leaderboard" över vilka spelare som fått flest poäng på varje quiz. Här kommer man behöva ha två endpoints, en för att registrera poäng för en användare och en endpoint för att hämta topplista över poäng och användare för ett quiz.

const addLeaderboard = async (event, context) => {
  console.log('EVENT', event);

  const { id } = event.pathParameters;
  const { score, username } = JSON.parse(event.body);
  const userId = event.userId;
  try {
    const [quiz, user] = await Promise.all([
      getQuizById(id),
      getUser(username),
    ]);
    console.log('USER:', user);
    console.log('QUIZ:', quiz);

    if (!user) {
      return sendError(404, { error: 'Not existing user' });
    }

    if (quiz.userId !== userId) {
      return sendError(403, 'Unauthorized to post score to this quiz');
    }

    const scoreLimit = quiz.questions.length;
    if (scoreLimit < score) {
      return sendError(
        400,
        'You cannot enter a score higher than the number of questions'
      );
    }

    const Item = {
      username: username,
      score: score,
      quizId: id,
    };
    await createLeaderboard(Item);

    return sendResponse(200, Item);
  } catch (error) {
    console.log(error.message);
    sendError(500, error.message);
  }
};

export const handler = middy(addLeaderboard, {
  timeoutEarlyInMillis: 0,
  timeoutEarlyResponse: () => {
    return { statusCode: 408 };
  },
}).use(tokenValidator);
