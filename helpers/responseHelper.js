const sendResponse = (statusCode, data) => {
  return {
    statusCode: statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
};

const sendError = (statusCode, errorMessage) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({ error: errorMessage }),
  };
};

export { sendResponse, sendError };
