'use server';

import { revalidateTag } from 'next/cache';

export default async function serverRevalidateTag(tag: string) {
  console.log('Revalidating tag:', tag);
  revalidateTag(tag);
}
