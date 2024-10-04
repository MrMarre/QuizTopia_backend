import {
  getQuizById,
  updateQuizQuestions,
} from '../../helpers/quizHelper/quiz.js';
import { sendError, sendResponse } from '../../helpers/responseHelper.js';
import middy from '@middy/core';
import { tokenValidator } from '../../utils/auth.js';

const addQuestion = async (event, context) => {
  const { id } = event.pathParameters;
  const { question, answer, longitude, latitude } = JSON.parse(event.body);
  const userId = event.userId;

  const newQuestion = {
    question: question,
    answer: answer,
    location: {
      longitude: longitude,
      latitude: latitude,
    },
  };
  console.log(newQuestion);

  try {
    const quizData = await getQuizById(id);

    if (quizData.userId !== userId) {
      return sendError(403, 'Unauthorized to post question to this quiz');
    }

    const updatedQuestions = quizData.questions || [];
    updatedQuestions.push(newQuestion);

    await updateQuizQuestions(id, updatedQuestions);

    return sendResponse(200, updatedQuestions);
  } catch (error) {
    console.log(error.message);
    sendError(500, error.message);
  }
};

export const handler = middy(addQuestion, {
  timeoutEarlyInMillis: 0,
  timeoutEarlyResponse: () => {
    return { statusCode: 408 };
  },
}).use(tokenValidator);
