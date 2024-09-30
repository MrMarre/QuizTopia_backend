import { hashPassword } from '../../helpers/hashPassword.js';
import { db } from '../../db.js';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { getUser } from '../../utils/getUser.js';
import { sendError, sendResponse } from '../../helpers/responseHelper.js';
import middy from '@middy/core';
// Denna behöver modifieras för att inte ta in en massa onödigt strunt
const signUp = async (event, context) => {
  console.log('Received event:', event);

  try {
    const { username, password } = JSON.parse(event.body);
    if (!username || !password) {
      return sendError(400, 'Missing required fields');
    }
    const existingUser = await getUser(username);
    if (existingUser) {
      return sendError(403, 'Username is unavailable');
    }

    const hashedPassword = await hashPassword(password);

    const newUser = {
      username: username,
      password: hashedPassword,
    };

    await db.put({
      TableName: 'usersTable',
      Item: newUser,
    });

    console.log('USER SUCCESSFULLY CREATED');

    return sendResponse(200, 'success', newUser);
  } catch (error) {
    console.log(error);
    return sendError(500, error.message);
  }
};

export const handler = signUp;
// // En fungerande timeout för att motverka abortController
// export const handler = middy(signUp, {
//   timeoutEarlyInMillis: 0,
//   timeoutEarlyResponse: () => {
//     return { statusCode: 408 };
//   },
// });
