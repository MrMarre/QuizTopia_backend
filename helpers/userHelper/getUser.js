import { db } from '../db.js';

export const getUser = async (username) => {
  try {
    const user = await db.get({
      TableName: 'usersTable',
      Key: {
        username: username,
      },
    });
    return user.Item;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};
