import jwt from 'jsonwebtoken';
import User from '../database/models/user';
import Token from '../database/models/token';

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

const isValidToken = (str: string): boolean => {
  if (str) {
    try {
      const token = generateToken(str);
      return !!jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return false;
    }
  }
  return false;
};

const getStatus = (token: string, tokens: string[]): number => {
  return isValidToken(token) && tokens.length === 0 ? 200 : 401;
};

const verifyUserName = async (userName: string) => {
  return userName === 'Random' ? false : true;
};

const addUser = async (userName: string) => {
  const isValidUsername = await verifyUserName(userName); // add Phabricator check here
  if (isValidUsername) {
    await User.create({
      userName: userName,
    });
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
      const isValidUsername = await verifyUserName(userName);
      if (!isValidUsername) {
        return {};
      }
      try {
        const user = await User.findOne({
          userName,
        });
        if (!user) {
          await User.create({
            userName: userName,
          });
        }
      } catch (error) {
        throw new Error(error.message);
      }
      return User.findOne({ userName });
    },
    async isAuthenticated(_: any, _args: any, ctx: any): Promise<object> {
      const token: string = ctx.req.cookies['x-access-token'];
      const tokens: string[] = await Token.find({ tags: token });
      const status: number = getStatus(
        ctx.req.cookies['x-access-token'],
        tokens
      );
      if (status === 401) {
        if (token) {
          const newToken = new Token();
          newToken.tags.push(token);
          newToken.save();
        }
        ctx.res.clearCookie(TOKEN_KEY);
      }
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
        const token = jwt.sign(
          { _id: user._id, email: user.userName },
          process.env.JWT_SECRET,
          {
            expiresIn: '1d',
          }
        );
        ctx.res.cookie(TOKEN_KEY, JSON.stringify(token), cookieOpts);

        return {
          isAuthenticated: true,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    signOutUser: async (_: any, _args: any, ctx: any): Promise<object> => {
      const token: string = ctx.req.cookies['x-access-token'];
      if (token) {
        const newToken = new Token();
        newToken.tags.push(token);
        newToken.save();
      }
      ctx.res.clearCookie(TOKEN_KEY);
      return {
        status: 200,
      };
    },
  },
};

export default resolvers;
