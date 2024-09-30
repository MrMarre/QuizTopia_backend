// req.body = {
//     "name": "string",
//     "question": "string",
//     "answer": "string",
//     "location": {
//       "longitude": "string",
//       "latitude": "string"
//     }
//   }

// res.body = {
//   "success": true,
//   "quiz": {
//     "Attributes": {
//       "questions": [
//         {
//           "question": "string",
//           "answer": "string",
//           "location": {
//             "longitude": "string",
//             "latitude": "string"
//           }
//         }
//       ],
//       "userId": "string",
//       "quizId": "string"
//     }
//   }
// }

const postQuestionToQuiz = async (event, context) => {
  console.log(event);
  const userId = event.userId;
  const { name, question, answer, longitude, latitude } = JSON.parse(
    event.body
  );

  const quizId = uuidv4();

  const params = {
    TableName: 'quizTable',
    Item: {
      userId,
      quizId,
      name,
    },
  };

  try {
    await db.put(params);
    return sendResponse(200, { success: true }, quizId);
  } catch (error) {
    console.log(error.message);
    sendError(500, error.message);
  }
};

export const handler = middy(postQuestionToQuiz, {
  timeoutEarlyInMillis: 0,
  timeoutEarlyResponse: () => {
    return { statusCode: 408 };
  },
}).use(tokenValidator);
