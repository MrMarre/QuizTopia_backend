import middy from '@middy/core';
import { sendError, sendResponse } from '../../helpers/responseHelper.js';
import { getQuizById } from '../../helpers/quizHelper/quiz.js';

// !DU BÖRJAR HÄR IMORGON; FORMATERA DITT SVAR

const getQuiz = async (event, context) => {
  console.log('Event:', event);
  const { quizId } = event.pathParameters;

  try {
    const quiz = await getQuizById(quizId);

    return sendResponse(200, quiz);
  } catch (error) {
    console.log(error.message);
    sendError(500, error.message);
  }
};

export const handler = middy(getQuiz, {
  timeoutEarlyInMillis: 0,
  timeoutEarlyResponse: () => {
    return { statusCode: 408 };
  },
});
