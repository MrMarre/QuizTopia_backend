import middy from '@middy/core';
import { db } from '../../db.js';
import { v4 as uuidv4 } from 'uuid';
import { sendError, sendResponse } from '../../helpers/responseHelper.js';
import { tokenValidator } from '../../utils/auth.js';

const postQuiz = async (event, context) => {
  console.log('Event:', event);
  const userId = event.userId;
  const { name } = JSON.parse(event.body);

  const quizId = uuidv4();
  const createdAt = new Date().toISOString();
  console.log('Generated Quiz ID:', quizId);

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
    console.log('Checking for existing quiz...');
    const existingQuiz = await db.get({
      TableName: 'quizTable',
      Key: { quizId },
    });

    if (existingQuiz.Item) {
      console.log('Quiz already exists:', existingQuiz.Item);
      return sendError(400, 'Quiz with this ID already exists');
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
