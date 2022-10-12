import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { SIGN_IN_USER } from '../graphql/mutations';
import { IEnterUserName } from '../common/interfaces/form.interface';

import {
  Form,
  NextButton,
  ButtonWrap,
  Heading,
  Container,
  InputField,
  HeadingWrap,
  EmailError,
} from '../styles/Authenticate.style';

export const SignIn = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const [signInUser] = useMutation(SIGN_IN_USER, {
    onCompleted: (res: any) => {
      if (res?.signInUser.isAuthenticated) {
        window.location.href = '/dashboard';
      }
    },
    onError: (err: any) => {
      console.log('sign in error', err.message);
      setError('userName', err.message);
    },
  });

  const onSubmit = ({ userName }: IEnterUserName) => {
    signInUser({ variables: { userName } });
  };

  return (
    <Container>
      <>
        <HeadingWrap>
          <Heading isWelcome={true}>Welcome to Phabricator++</Heading>
          <Heading isWelcome={false}>Enter your Phabricator username</Heading>
        </HeadingWrap>
        <Form>
          <InputField
            type='text'
            pushDown={true}
            placeholder='Enter username'
            {...register('userName', { required: true })}
          />
          {errors.userName && (
            <EmailError>Enter correct phabricator userName</EmailError>
          )}
        </Form>
        <ButtonWrap>
          <NextButton onClick={handleSubmit(onSubmit)}>Sign In</NextButton>
        </ButtonWrap>
      </>
    </Container>
  );
};
