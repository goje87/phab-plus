import { useQuery } from '@apollo/client';
import { ExpandMoreIcon, ErrorOutline } from '@mui/icons-material';
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
import {
  DifferentialListItem,
  DiffStates,
  SlaBridgeStatus,
} from './DifferentialListItem';
import { PageWrapper } from './PageWrapper';

const needReview = ['D12345', 'D47567', 'D58048'];

export const NeedMyReviewDiffs = (): JSX.Element => {
  const auth = useAuth();
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const redirect = (path: string) => (window.location.href = path);
  const { loading, error, data } = useQuery(GET_DIFFERENTIALS, {
    variables: {
      differentialType: 'NEED_MY_REVIEW',
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
            flexDirection: 'column',
          }}
        >
          <ErrorOutline /> Something Went Wrong
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper showHeader>
      <Accordion expanded>
        <AccordionSummary aria-controls='panel1a-content' id='panel1a-header'>
          <Typography>Need My Review</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <List>
              {data.getDifferentials.map((diff, index) => {
                console.log(
                  index,
                  index < 2
                    ? SlaBridgeStatus.ERROR
                    : index < 5
                    ? SlaBridgeStatus.WARNING
                    : undefined
                );
                return (
                  <DifferentialListItem
                    key={diff}
                    diff={diff}
                    status={DiffStates.UP_FOR_REVIEW}
                    nextStates={[
                      DiffStates.CHANGES_REQUESTED,
                      DiffStates.ACCEPTED,
                    ]}
                    slaBridgeStatus={
                      index < 2
                        ? SlaBridgeStatus.ERROR
                        : index < 5
                        ? SlaBridgeStatus.WARNING
                        : undefined
                    }
                  />
                );
              })}
            </List>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </PageWrapper>
  );
};
