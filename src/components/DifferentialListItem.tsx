import {
  ListItem,
  FormControl,
  Select,
  MenuItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  CircularProgress,
  Link,
} from '@mui/material';
import React from 'react';
import { FolderCopyOutlined } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { CHANGE_DIFF_STATUS } from '../graphql/mutations';
import { GET_DIFFERENTIALS } from '../graphql/queries';
import { getOperationName } from '@apollo/client/utilities';

export enum DiffStates {
  DRAFT = 'DRAFT',
  UP_FOR_REVIEW = 'UP_FOR_REVIEW',
  CHANGES_REQUESTED = 'CHANGES_REQUESTED',
  READY_TO_SAIL = 'READY_TO_SAIL',
  ACCEPTED = 'ACCEPTED',
}

const diffStatesText = {
  [DiffStates.DRAFT]: 'Draft',
  [DiffStates.UP_FOR_REVIEW]: 'Ready for Review',
  [DiffStates.CHANGES_REQUESTED]: 'Changes Requested / Commented',
  [DiffStates.READY_TO_SAIL]: 'Ready to sail',
  [DiffStates.ACCEPTED]: 'Accepted',
};

export enum SlaBridgeStatus {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
}

const slaBridgeStatusMap = {
  [SlaBridgeStatus.ERROR]: {
    label: 'SLA Breached',
    color: 'error',
  },
  [SlaBridgeStatus.WARNING]: {
    label: 'nearing SLA',
    color: 'warning',
  },
};

export const DifferentialListItem = ({
  diff,
  status,
  nextStates,
  slaBridgeStatus,
}: {
  diff: {
    diffId: string;
    url: string;
    title: string;
  };
  status: DiffStates;
  slaBridgeStatus?: SlaBridgeStatus;
  nextStates: ReadonlyArray<DiffStates>;
}): JSX.Element => {
  const [changeStatus, { loading }] = useMutation(CHANGE_DIFF_STATUS, {
    refetchQueries: [getOperationName(GET_DIFFERENTIALS)],
    awaitRefetchQueries: true,
  });
  return (
    <ListItem
      secondaryAction={
        <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
          <Select
            labelId='demo-select-small'
            id='demo-select-small'
            value={status}
            onChange={(event: any) => {
              changeStatus({
                variables: {
                  input: {
                    diffId: diff.diffId,
                    status: event.target.value,
                  },
                },
              });
            }}
          >
            <MenuItem value={status} disabled>
              <em>{diffStatesText[status]}</em>
            </MenuItem>
            {nextStates.map(nextState => (
              <MenuItem key={nextState} value={nextState}>
                {diffStatesText[nextState]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }
    >
      <ListItemAvatar>
        {loading ? (
          <CircularProgress size='small' />
        ) : (
          <Avatar>
            <FolderCopyOutlined />
          </Avatar>
        )}
      </ListItemAvatar>

      <ListItemText
        primary={
          <div>
            {diff.title}
            {slaBridgeStatus && (
              <Chip
                label={slaBridgeStatusMap[slaBridgeStatus].label}
                size='small'
                style={{ marginLeft: '10px' }}
                color={
                  slaBridgeStatusMap[slaBridgeStatus].color as
                    | 'error'
                    | 'warning'
                }
              />
            )}
          </div>
        }
        secondary={
          <Link target='_blank' href={diff.url}>
            {diff.url}
          </Link>
        }
      />
    </ListItem>
  );
};
