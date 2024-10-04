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

export const checkIfQuizNameExists = async (name) => {
  const params = {
    TableName: 'quizTable',
    IndexName: 'AllQuizIndex',
    KeyConditionExpression: '#type = :type',
    FilterExpression: '#name = :name',
    ExpressionAttributeNames: {
      '#type': 'type',
      '#name': 'name',
    },
    ExpressionAttributeValues: {
      ':type': 'quiz',
      ':name': name,
    },
  };

  const result = await db.query(params);

  return result.Items.length > 0 ? result.Items[0] : null;
};

export const getAllQuizzes = async () => {
  const params = {
    TableName: 'quizTable',
    IndexName: 'AllQuizIndex',
    KeyConditionExpression: '#type = :type',
    ExpressionAttributeNames: {
      '#type': 'type',
    },
    ExpressionAttributeValues: {
      ':type': 'quiz',
    },
  };

  try {
    const result = await db.query(params);
    return result.Items;
  } catch (error) {
    console.log(error.message);
    sendError(500, error.message);
  }
};
