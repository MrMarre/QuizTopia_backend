const sendResponse = (statusCode, data = null) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      ...(data && { data }),
    }),
  };
};

const sendError = (statusCode, errorMessage) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({ error: errorMessage }),
  };
};

export { sendResponse, sendError };

// Fan, är det här mycket mer gött eller?

// function sendResponse(response) {
//   return {
//     statusCode: 200,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(response),
//   };
// }

// function sendError(statusCode, message) {
//   return {
//     statusCode,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(message),
//   };
// }

// module.exports = { sendResponse, sendError };
