import Link from 'next/link';
import getCurrentUser from '@/actions/get-current-user';

export default async function Header() {
  const currentUser = await getCurrentUser();

  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    !!currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    !!currentUser && { label: 'My Orders', href: '/orders' },
    !!currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ].filter(linkConfig => linkConfig) as { label: string; href: string }[];

  const getLinks = links.map(({ label, href }) => (
    <li key={href}>
      <Link href={href}>{label}</Link>
    </li>
  ));

  return (
    <nav className="flex items-center justify-between flex-wrap bg-blue-500 p-6">
      <Link href="/">GitTix</Link>
      <ul className="flex items-center flex-shrink-0 text-white mr-6 gap-6">{getLinks}</ul>
    </nav>
  );
}
