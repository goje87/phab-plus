import { exec } from '../conduit';
import Differential, {
  DifferentialStatus,
  DifferentialType,
  IDifferential,
  PhabricatorDiffStatusName,
  phabStatusIdToDiffStatus,
} from '../database/models/Differential';
import User from '../database/models/user';

const TOKEN_KEY = 'x-access-token';
const cookieOpts = {
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
};

const getUserDetailsFromPhabricator = async (userName: string) => {
  const { result, error_code } = await exec('user.query', {
    usernames: [userName],
  });

  if (!error_code) return result[0];

  throw error_code;
};

const getAuthoredDiffsFromPhabricator = async (phid: string) => {
  const { result: needRevisionDiffs, error_code: needRevisionErrorCode } =
    await exec('differential.query', {
      authors: [phid],
      status: PhabricatorDiffStatusName.NEEDS_REVISION,
    });

  const { result: needReviewDiffs, error_code: needReviewErrorCode } =
    await exec('differential.query', {
      authors: [phid],
      status: PhabricatorDiffStatusName.NEED_REVIEW,
    });

  console.log(
    needRevisionDiffs,
    needReviewDiffs,
    needRevisionErrorCode,
    needReviewErrorCode
  );

  if (!needReviewErrorCode && !needRevisionErrorCode)
    return [...needReviewDiffs, ...needRevisionDiffs];

  throw needReviewErrorCode ?? needRevisionErrorCode;
};

const getNeedMyReviewDiffsFromPhabricator = async (phid: string) => {
  const { result: needRevisionDiffs, error_code: needRevisionErrorCode } =
    await exec('differential.query', {
      responsibleUsers: [phid],
      status: PhabricatorDiffStatusName.NEEDS_REVISION,
    });

  const { result: needReviewDiffs, error_code: needReviewErrorCode } =
    await exec('differential.query', {
      responsibleUsers: [phid],
      status: PhabricatorDiffStatusName.NEED_REVIEW,
    });

  if (!needReviewErrorCode && !needRevisionErrorCode)
    return [...needReviewDiffs, ...needRevisionDiffs];

  throw needReviewErrorCode ?? needRevisionErrorCode;
};

const transformPhabricatorDiff = (
  diffs: Array<any>,
  diffType: DifferentialType
): Array<IDifferential> => {
  return diffs.map(diff => ({
    diffId: diff.id,
    diffType: diffType,
    status: phabStatusIdToDiffStatus[diff.status],
    title: diff.title,
    url: diff.uri,
    authoredBy: diff.authorPHID,
  }));
};

const addUser = async (userName: string) => {
  const userData = await getUserDetailsFromPhabricator(userName);
  if (userData) {
    return await User.create({
      phId: userData.phid,
      userName: userData.userName,
    });
  } else {
    throw new Error('UserName not found in Phabricator');
  }
};

const getUserPhId = (token: string) => {
  try {
    const userData = JSON.parse(token);
    return userData.phId;
  } catch (error) {
    throw new Error(error.message);
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
    async getDifferentials(_: any, args: any, ctx: any): Promise<object> {
      const { differentialType } = args;
      try {
        const userData: string = ctx.req.cookies['x-access-token'];
        const phid = getUserPhId(userData);
        switch (differentialType) {
          case DifferentialType.AUTHORED: {
            const authoredDiffs = await getAuthoredDiffsFromPhabricator(phid);
            const formattedDiffs = transformPhabricatorDiff(
              authoredDiffs,
              differentialType
            );
            console.log(formattedDiffs);
            await Differential.updateMany(formattedDiffs);
            return Differential.find({
              authoredBy: phid,
              diffType: differentialType,
            });
          }
          case DifferentialType.NEED_MY_REVIEW: {
            const authoredDiffs = await getNeedMyReviewDiffsFromPhabricator(
              phid
            );
            const formattedDiffs = transformPhabricatorDiff(
              authoredDiffs,
              differentialType
            );
            await Differential.updateMany(formattedDiffs);
            return Differential.find({
              $or: [{ status: DifferentialStatus.UP_FOR_REVIEW }],
              authoredBy: phid,
              diffType: differentialType,
            });
          }
        }
      } catch (error) {
        throw new Error(error.message);
      }
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
          user = await addUser(userName);
        }
        ctx.res.cookie(TOKEN_KEY, JSON.stringify(user), cookieOpts);

        return {
          isAuthenticated: true,
        };
      } catch (error) {
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
