// deleteQuiz:
//     handler: functions/deleteQuiz/index.handler
//     events:
//       - httpApi:
//           path: /quiz/{quizId}
//           method: DELETE

import { sendError } from '../../helpers/responseHelper.js';

const deleteQuiz = async (event, context) => {
  const { quizId } = event.pathParameters;
  const userId = event.userId;

  try {
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
