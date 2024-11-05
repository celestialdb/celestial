import { catchErrors, InvalidTokenError } from 'errors';
import { User } from 'entities';
import { verifyToken } from '../utils/authToken';

export const authenticateUser = catchErrors(async (req, _res, next) => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjksImlhdCI6MTcyNTAzNzQ5NywiZXhwIjoxNzQwNTg5NDk3fQ.uj8Edcda52PVczeJn0KLXDu-XjzKMFMWJ2rH1uBThE4'; // getAuthTokenFromRequest(req);
  if (!token) {
    throw new InvalidTokenError('Authentication token not found.');
  }
  const userId = verifyToken(token).sub;
  if (!userId) {
    throw new InvalidTokenError('Authentication token is invalid.');
  }

  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    throw new InvalidTokenError('Authentication token is invalid: User not found.');
  }
  req.currentUser = user;
  next();
});

/*
const getAuthTokenFromRequest = (req: Request): string | null => {
  const header = req.get('Authorization') || '';
  const [bearer, token] = header.split(' ');
  return bearer === 'Bearer' && token ? token : null;
}; */
