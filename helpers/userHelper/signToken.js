import JWT from 'jsonwebtoken';

export function signToken(user) {
  try {
    const token = JWT.sign(
      { userId: user.userId, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: 36000,
      }
    );
    return token;
  } catch (error) {
    console.error('Error signing token:', error);
    throw error;
  }
}
