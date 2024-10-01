import middy from '@middy/core';
import { db } from '../../db.js';
import { v4 as uuidv4 } from 'uuid';
import { sendError, sendResponse } from '../../helpers/responseHelper.js';
import { tokenValidator } from '../../utils/auth.js';

const postQuiz = async (event, context) => {
  console.log(event);
  const userId = event.userId;
  const { name } = JSON.parse(event.body);

  const quizId = uuidv4();

  const params = {
    TableName: 'quizTable',
    Item: {
      name,
      quizId,
      userId,
      questions: [],
      type: 'quiz',
    },
  };

  try {
    await db.put(params);
    return sendResponse(200, params);
  } catch (error) {
    console.log(error.message);
    sendError(500, error.message);
  }
};

export const handler = middy(postQuiz, {
  timeoutEarlyInMillis: 0,
  timeoutEarlyResponse: () => {
    return { statusCode: 408 };
  },
}).use(tokenValidator);
