import Link from 'next/link';
import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import { useForm } from 'react-hook-form';
import { signIn, useSession } from 'next-auth/react';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import axios from 'axios';
const loginScreen = () => {
  const { status, data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;
  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);
  console.log(session);
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      });
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(getError(error));
    }
  };
  return (
    <Layout title="login">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Create an acoount</h1>
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            type="name"
            {...register('name', {
              required: 'please enter name',
            })}
            className="w-full"
            id="name"
          ></input>
          {errors.name && (
            <div className="text-red-500">{errors.name.message} </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'please enter email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Please enter valid email',
              },
            })}
            className="w-full"
            id="email"
            autoFocus
          ></input>
          {errors.email && (
            <div className="text-red-500">{errors.email.message} </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            {...register('password', {
              required: 'please enter password ',
              minLength: {
                value: 6,
                message: 'password is more than 5 characters',
              },
            })}
            type="password"
            className="w-full"
            id="password"
            autoFocus
          ></input>
          {errors.password && (
            <div className="text-red-500">{errors.password.message} </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            {...register('confirmPassword', {
              required: 'please enter confirm password ',
              validate: (value) => value === getValues('password'),
              minLength: {
                value: 6,
                message: 'confirm password is more than 5 chars',
              },
            })}
            type="password"
            className="w-full"
            id="confirmPassword"
            autoFocus
          ></input>
          {errors.confirmPassword && (
            <div className="text-red-500">
              {errors.confirmPassword.message}{' '}
            </div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === 'validate' && (
              <div className="text-red-500"> Password dont&apos;t match</div>
            )}
        </div>
        <div className="mb-4">
          <button className="primary-button">Register</button>
        </div>
        <div className="mb-4">
          Already have an account? &nbsp;{' '}
          <Link href={`/register?redirect=${redirect || '/'}`}> Login</Link>
        </div>
      </form>
    </Layout>
  );
};

export default loginScreen;
