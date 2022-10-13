import {
  ListItem,
  FormControl,
  Select,
  MenuItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material';
import React from 'react';
import {
  FolderCopyOutlined,
  RunningWithErrorsOutlined,
} from '@mui/icons-material';

export enum DiffStates {
  DRAFT = 'DRAFT',
  READY_FOR_REVIEW = 'READY_FOR_REVIEW',
  CHANGES_REQUESTED = 'CHANGES_REQUESTED',
  READY_TO_SAIL = 'READY_TO_SAIL',
  ACCEPTED = 'ACCEPTED',
}

const diffStatesText = {
  [DiffStates.DRAFT]: 'Draft',
  [DiffStates.READY_FOR_REVIEW]: 'Ready for Review',
  [DiffStates.CHANGES_REQUESTED]: 'Changes Requested / Commented',
  [DiffStates.READY_TO_SAIL]: 'Ready to sail',
  [DiffStates.ACCEPTED]: 'Accepted',
};

export enum SlaBridgeStatus {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
}

const statusIcon = {
  [SlaBridgeStatus.ERROR]: <RunningWithErrorsOutlined color='error' />,
  [SlaBridgeStatus.WARNING]: <RunningWithErrorsOutlined color='info' />,
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
  return (
    <ListItem
      secondaryAction={
        <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
          <Select
            labelId='demo-select-small'
            id='demo-select-small'
            value={status}
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
        {slaBridgeStatus ? (
          statusIcon[slaBridgeStatus]
        ) : (
          <Avatar>
            <FolderCopyOutlined />
          </Avatar>
        )}
      </ListItemAvatar>

      <ListItemText
        primary={diff.title}
        secondary={`https://phabricator.rubrik.com/${diff.diffId}`}
      />
    </ListItem>
  );
};
