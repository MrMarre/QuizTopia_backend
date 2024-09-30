import middy from '@middy/core';
import { passwordCheck } from '../../helpers/passwordCheck.js';
import { signToken } from '../../helpers/signToken.js';
import { getUser } from '../../utils/getUser.js';
import { sendError, sendResponse } from '../../helpers/responseHelper.js';
import { tokenValidator } from '../../utils/auth.js';

const logIn = async (event, context) => {
  console.log(event);

  try {
    const { username, password } = JSON.parse(event.body);

    const user = await getUser(username);

    if (!user) return sendError(401, 'Wrong username or password');

    const pwVerifier = await passwordCheck(password, user);

    console.log('Password verification result:', pwVerifier);

    if (!pwVerifier) return sendError(401, 'Wrong username or password');

    const token = signToken(user);
    console.log('Generated token:', token);

    return sendResponse(200, 'success', token);
  } catch (error) {
    console.log('Error:', error);
    return sendError(500, error.message);
  }
};

export const handler = logIn;
