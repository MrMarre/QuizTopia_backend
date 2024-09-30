import bcrypt from 'bcryptjs';

export async function passwordCheck(password, user) {
  try {
    const isCorrect = await bcrypt.compare(password, user.password);

    return isCorrect;
  } catch (error) {
    console.error('Error comparing password', error);
    throw error;
  }
}
