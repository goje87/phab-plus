import jwt from 'jsonwebtoken';
import User from '../database/models/user';
import { exec } from '../conduit';

const TOKEN_KEY = 'x-access-token';
const cookieOpts = {
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
};

const generateToken = (str: string): string | null => {
  if (str) {
    try {
      const token = JSON.parse(str);
      return token;
    } catch (err) {
      return null;
    }
  }
  return null;
};



const getUserDetailsFromPhabricator = async (userName: string) => {
  const { result, error_code } = await exec('user.query', {
    usernames: [userName],
  });

  if (!error_code) return result[0];

  throw error_code;
};

const addUser = async (userName: string) => {
  const userData = await getUserDetailsFromPhabricator(userName);
  if (userData) {
    await User.create(userData);
  } else {
    throw new Error('UserName not found in Phabricator');
  }
};

const resolvers = {
  Query: {
    async getUserByUserName(_: any, args: any): Promise<object> {
      const {
        input: { userName },
      } = args;
      return User.findOne({ userName });
    },
    async isAuthenticated(_: any, _args: any, ctx: any): Promise<object> {
      const token: string = ctx.req.cookies[TOKEN_KEY];
      const status: number = token ? 200 : 401;
      return {
        status,
      };
    },
  },
  Mutation: {
    signInUser: async (_: any, args: any, ctx: any): Promise<object> => {
      const {
        input: { userName },
      } = args;

      try {
        let user = await User.findOne({
          userName,
        });
        if (!user) {
          await addUser(userName);
          user = await User.findOne({
            userName,
          });
        }
        ctx.res.cookie(TOKEN_KEY, JSON.stringify(user), cookieOpts);

        return {
          isAuthenticated: true,
        };
      } catch (error) {
        console.log('ERRRRRRR: ', error.message);
        throw new Error(error.message);
      }
    },
    signOutUser: async (_: any, _args: any, ctx: any): Promise<object> => {
      ctx.res.clearCookie(TOKEN_KEY);
      return {
        status: 200,
      };
    },
  },
};

export default resolvers;
