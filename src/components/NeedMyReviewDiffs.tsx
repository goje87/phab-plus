import { useQuery } from '@apollo/client';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { GET_DIFFERENTIALS } from '../graphql/queries';
import { useAuth } from '../hooks/useAuth';
import { DifferentialListItem, DiffStates } from './DifferentialListItem';
import { PageWrapper } from './PageWrapper';

const needReview = ['D12345', 'D47567', 'D58048'];

export const NeedMyReviewDiffs = (): JSX.Element => {
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
      <Accordion expanded>
        <AccordionSummary aria-controls='panel1a-content' id='panel1a-header'>
          <Typography>Need My Review</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <List>
              {needReview.map(diff => (
                <DifferentialListItem
                  key={diff}
                  diffId={diff}
                  status={DiffStates.READY_FOR_REVIEW}
                  nextStates={[
                    DiffStates.CHANGES_REQUESTED,
                    DiffStates.ACCEPTED,
                  ]}
                />
              ))}
            </List>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </PageWrapper>
  );
};
