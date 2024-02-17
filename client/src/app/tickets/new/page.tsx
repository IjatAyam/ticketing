'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import useRequest from '@/hooks/use-request';
import serverRevalidateTag from '@/actions/server-revalidate-tag';

export default function NewTicket() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    async onSuccess() {
      await serverRevalidateTag('tickets');
      router.push('/');
    },
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await doRequest();
  }

  function onBlur() {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  }

  return (
    <form className="flex flex-col gap-6 p-10 items-start" onSubmit={onSubmit}>
      <h1 className="text-2xl font-bold">Create a Ticket</h1>
      <div className="flex flex-col gap-2 w-1/2">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          className="rounded px-2 py-1"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 w-1/2">
        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          className="rounded px-2 py-1"
          value={price}
          onChange={e => setPrice(e.target.value)}
          onBlur={onBlur}
        />
      </div>
      {errors}
      <div>
        <button className="bg-blue-500 py-2 px-4 rounded font-bold" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}
