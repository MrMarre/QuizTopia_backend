import { getQuizById } from '../../helpers/quizHelper/quiz.js';
import { tokenValidator } from '../../utils/auth.js';
import { sendError, sendResponse } from '../../helpers/responseHelper.js';
import middy from '@middy/core';
import { db } from '../../db.js';

const deleteQuiz = async (event, context) => {
  const { quizId } = event.pathParameters;
  const userId = event.userId;

  try {
    const quizData = await getQuizById(quizId);

    if (!quizData) {
      return sendError(404, `No quiz with quizId ${quizId} was found`);
    }

    if (quizData.userId !== userId) {
      return sendError(403, 'Unauthorized to delete this quiz');
    }

    const deleteParams = {
      TableName: 'quizTable',
      Key: {
        quizId: quizData.quizId,
      },
    };

    await db.delete(deleteParams);

    return sendResponse(200, {
      message: 'Quiz deleted successfully',
      quizId: quizId,
      name: quizData.name,
      deletedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.log(error.message);
    sendError(500, error.message);
  }
};

export const handler = middy(deleteQuiz, {
  timeoutEarlyInMillis: 0,
  timeoutEarlyResponse: () => {
    return { statusCode: 408 };
  },
}).use(tokenValidator);
