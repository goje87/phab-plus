import { useQuery } from '@apollo/client';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ErrorOutline } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  Typography,
  CircularProgress,
} from '@mui/material';
import * as React from 'react';
import { GET_DIFFERENTIALS } from '../graphql/queries';
import { useAuth } from '../hooks/useAuth';
import { DifferentialListItem, DiffStates } from './DifferentialListItem';
import { PageWrapper } from './PageWrapper';
import { ContainerWithCenter } from '../App.style';
import { DifferentialStatus } from '../App.types';

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

  if (loading) {
    return (
      <PageWrapper showHeader>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </div>
      </PageWrapper>
    );
  }

  if (error || !data) {
    return (
      <PageWrapper showHeader>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ErrorOutline /> Something Went Wrong
        </div>
      </PageWrapper>
    );
  }

  const draftDiffs = data.getDifferentials.filter(
    diff => diff.status === DifferentialStatus.DRAFT
  );
  const reviewDiffs = data.getDifferentials.filter(
    diff => diff.status === DifferentialStatus.UP_FOR_REVIEW
  );
  const commentedDiffs = data.getDifferentials.filter(
    diff => diff.status === DifferentialStatus.CHANGES_REQUESTED
  );
  const sailDiffs = data.getDifferentials.filter(
    diff => diff.status === DifferentialStatus.ACCEPTED
  );

  return (
    <PageWrapper showHeader>
      <Accordion defaultExpanded>
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
                  diff={diff}
                  status={DiffStates.DRAFT}
                  nextStates={[DiffStates.UP_FOR_REVIEW]}
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
                diff={diff}
                status={DiffStates.UP_FOR_REVIEW}
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
                diff={diff}
                status={DiffStates.CHANGES_REQUESTED}
                nextStates={[DiffStates.UP_FOR_REVIEW, DiffStates.DRAFT]}
              />
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion disabled={sailDiffs.length === 0}>
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
                diff={diff}
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
