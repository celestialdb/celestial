import { catchErrors } from 'errors';
import { User } from '../entities';

export const getCurrentUser = catchErrors((req, res) => {
  res.respond({ currentUser: req.currentUser });
});

export const getUsers = catchErrors(async (_req, res) => {
  const users = await User.createQueryBuilder('user')
    .select()
    .getMany();

  res.respond({ users });
});
