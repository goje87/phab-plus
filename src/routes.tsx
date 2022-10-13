import { MyDiffs } from './components/MyDiffs';
import { NeedMyReviewDiffs } from './components/NeedMyReviewDiffs';

export const ROUTES = {
  MY_DIFFS: 'MY_DIFFS',
  NEED_MY_REVIEW: 'NEED_MY_REVIEW',
};

export const routes = {
  [ROUTES.MY_DIFFS]: {
    component: MyDiffs,
    path: '/my-diffs',
    title: 'My Diffs',
  },
  [ROUTES.NEED_MY_REVIEW]: {
    component: NeedMyReviewDiffs,
    path: '/need-my-review',
    title: 'Need My Review',
  },
};
