import middy from '@middy/core';
import { db } from '../../db.js';
import { v4 as uuidv4 } from 'uuid';
import { sendError, sendResponse } from '../../helpers/responseHelper.js';
import { tokenValidator } from '../../utils/auth.js';
import { checkIfQuizNameExists } from '../../helpers/quizHelper/quiz.js';

const postQuiz = async (event, context) => {
  const userId = event.userId;
  const { name } = JSON.parse(event.body);

  const quizId = uuidv4();
  const createdAt = new Date().toISOString();

  const params = {
    TableName: 'quizTable',
    Item: {
      name,
      quizId,
      userId,
      questions: [],
      type: 'quiz',
      createdAt,
    },
  };

  try {
    const existingQuiz = await checkIfQuizNameExists(name);

    if (existingQuiz) {
      console.log('Quiz already exists with this name:', existingQuiz);
      return sendError(
        400,
        `Quiz with name ${existingQuiz.name} already exists`
      );
    }

    console.log('Putting item into DB:', params);
    await db.put(params);
    console.log('Item successfully put into DB');
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
