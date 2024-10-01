import { v4 as uuid } from 'uuid';
import { db } from '../../db.js';
import { sendError, sendResponse } from '../responseHelper.js';

export const getQuizById = async (quizId) => {
  try {
    const params = {
      TableName: 'quizTable',
      Key: {
        quizId: quizId,
      },
    };

    const result = await db.get(params);
    if (!result.Item) {
      throw new Error();
    }

    return result.Item;
  } catch (error) {
    console.log(error.message);
    sendError(500, error.message);
  }
};

export const updateQuizQuestions = async (quizId, questions) => {
  const updateParams = {
    TableName: 'quizTable',
    Key: { quizId },
    UpdateExpression: 'set questions = :questions',
    ExpressionAttributeValues: { ':questions': questions },
  };
  return db.update(updateParams);
};
