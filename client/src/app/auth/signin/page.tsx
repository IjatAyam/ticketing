'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import useRequest from '@/hooks/use-request';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password,
    },
    async onSuccess() {
      router.push('/');
      router.refresh();
    },
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await doRequest();
  }

  return (
    <form className="flex flex-col gap-6 p-10 items-start" onSubmit={onSubmit}>
      <h1 className="text-2xl font-bold">Sign In</h1>
      <div className="flex flex-col gap-2 w-1/2">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          className="rounded px-2 py-1"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 w-1/2">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className="rounded px-2 py-1"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      {errors}
      <div>
        <button className="bg-blue-500 py-2 px-4 rounded font-bold" type="submit">
          Sign In
        </button>
        <Link href="/auth/signup" className="ml-4 text-gray-300">
          Sign Up
        </Link>
      </div>
    </form>
  );
}
