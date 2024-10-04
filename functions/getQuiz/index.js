import middy from '@middy/core';
import { sendError, sendResponse } from '../../helpers/responseHelper.js';
import { getQuizById } from '../../helpers/quizHelper/quiz.js';
import { tokenValidator } from '../../utils/auth.js';

const getQuiz = async (event, context) => {
  const { quizId } = event.pathParameters;
  const userId = event.userId;
  try {
    const quiz = await getQuizById(quizId);

    if (quiz.userId !== userId) {
      const filteredQuizzes = quiz.questions.map((question) => ({
        question: question.question,
        location: question.location,
      }));
      return sendResponse(200, filteredQuizzes);
    }

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
}).use(tokenValidator);
