import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-600">Welcome to your dashboard!</p>
    </div>
  );
} 