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
import FolderIcon from '@mui/icons-material/Folder';

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

export const DifferentialListItem = ({
  diffId,
  status,
  nextStates,
}: {
  diffId: string;
  status: DiffStates;
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
        <Avatar>
          <FolderIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={diffId}
        secondary={`https://phabricator.rubrik.com/${diffId}`}
      />
    </ListItem>
  );
};
