import { useQuery } from '@apollo/client';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import * as React from 'react';
import { GET_DIFFERENTIALS } from '../graphql/queries';
import { useAuth } from '../hooks/useAuth';
import { PageWrapper } from './PageWrapper';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DifferentialListItem, DiffStates } from './DifferentialListItem';

const draftDiffs = ['D12345', 'D47567', 'D58048'];
const reviewDiffs = ['D80960', 'D48394', 'D79274'];
const commentedDiffs = ['D13455', 'D75947', 'D70135'];
const sailDiffs = ['D88008', 'D75557', 'D24057'];

export const MyDiffs = (): JSX.Element => {
  const auth = useAuth();
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const redirect = (path: string) => (window.location.href = path);
  const { loading, error, data } = useQuery(GET_DIFFERENTIALS, {
    variables: {
      differentialType: 'AUTHORED',
    },
  });

  React.useEffect(() => {
    if (auth.isFetched && auth.isAuthenticated) {
      setIsLoaded(true);
    } else if (auth.isFetched) {
      redirect('/');
    }
  }, [auth]);

  if (!isLoaded) {
    return null;
  }

  return (
    <PageWrapper showHeader>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography>Drafts</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <List>
              {draftDiffs.map(diff => (
                <DifferentialListItem
                  key={diff}
                  diffId={diff}
                  status={DiffStates.DRAFT}
                  nextStates={[DiffStates.READY_FOR_REVIEW]}
                />
              ))}
            </List>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography>Ready for Review</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {reviewDiffs.map(diff => (
              <DifferentialListItem
                key={diff}
                diffId={diff}
                status={DiffStates.READY_FOR_REVIEW}
                nextStates={[DiffStates.DRAFT]}
              />
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography>Changes Requested / Commented</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {commentedDiffs.map(diff => (
              <DifferentialListItem
                key={diff}
                diffId={diff}
                status={DiffStates.CHANGES_REQUESTED}
                nextStates={[DiffStates.READY_FOR_REVIEW, DiffStates.DRAFT]}
              />
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography>Ready to sail</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {sailDiffs.map(diff => (
              <DifferentialListItem
                key={diff}
                diffId={diff}
                status={DiffStates.READY_TO_SAIL}
                nextStates={[DiffStates.DRAFT]}
              />
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </PageWrapper>
  );
};
