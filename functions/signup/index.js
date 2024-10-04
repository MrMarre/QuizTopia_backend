import { hashPassword } from '../../helpers/userHelper/hashPassword.js';
import { db } from '../../db.js';
import { getUser } from '../../utils/getUser.js';
import { sendError, sendResponse } from '../../helpers/responseHelper.js';

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

    return sendResponse(200, 'success', newUser);
  } catch (error) {
    console.log(error);
    return sendError(500, error.message);
  }
};

export const handler = signUp;
