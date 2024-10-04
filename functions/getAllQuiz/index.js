import middy from '@middy/core';
import { sendError, sendResponse } from '../../helpers/responseHelper.js';
import { getAllQuizzes } from '../../helpers/quizHelper/quiz.js';

const getAllQuiz = async (event, context) => {
  console.log('Event:', event);

  try {
    const quizzes = await getAllQuizzes();
    const filteredQuizzes = quizzes.map((quiz) => ({
      Username: quiz.userId,
      QuizName: quiz.name,
      QuizId: quiz.quizId,
    }));

    return sendResponse(200, filteredQuizzes);
  } catch (error) {
    console.log(error.message);
    sendError(500, error.message);
  }
};

export const handler = middy(getAllQuiz, {
  timeoutEarlyInMillis: 0,
  timeoutEarlyResponse: () => {
    return { statusCode: 408 };
  },
});
