import { Schema, model, models } from 'mongoose';

export enum DifferentialStatus {
  DRAFT = 'DRAFT',
  UP_FOR_REVIEW = 'UP_FOR_REVIEW',
  CHANGES_REQUESTED = 'CHANGES_REQUESTED',
  ACCEPTED = 'ACCEPTED',
  CLOSED = 'CLOSED',
}

export enum DifferentialType {
  AUTHORED = 'AUTHORED',
  NEED_MY_REVIEW = 'NEED_MY_REVIEW',
}

export enum PhabricatorDiffStatusId {
  ACCEPTED = '2',
  NEED_REVIEW = '0',
  CLOSED = '3',
  NEEDS_REVISION = '1',
  OPEN = '0',
  ABOUNDED = '4',
}

export const phabStatusIdToDiffStatus = [
  DifferentialStatus.DRAFT,
  DifferentialStatus.CHANGES_REQUESTED,
  DifferentialStatus.ACCEPTED,
  DifferentialStatus.CLOSED,
  DifferentialStatus.CLOSED,
];

export enum PhabricatorDiffStatusName {
  ACCEPTED = 'status-accepted',
  NEED_REVIEW = 'status-needs-review',
  CLOSED = 'status-closed',
  NEEDS_REVISION = 'status-needs-revision',
  OPEN = 'status-open',
  ABOUNDED = 'status-abounded',
}

export interface IDifferential {
  diffId: string;
  title: string;
  url: string;
  status: DifferentialStatus;
  diffType: DifferentialType;
  authoredBy: string;
}

const differentialSchema = new Schema<IDifferential>(
  {
    diffId: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    authoredBy: {
      type: String,
      required: true,
    },
    diffType: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Differential =
  models.differential ||
  model<IDifferential>('differential', differentialSchema);

export default Differential;

// authored tab
// all diff draft, commneted, up for review
// draft  - open, need review
// changes requested- need revision
// ready to sail - manual
// Sailing - accepted,
// closed - closed, abdonded
// getDiff - fetch open, need review, need revision, accepted
// changeState - mutation
