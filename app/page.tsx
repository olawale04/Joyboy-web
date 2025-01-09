import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-white">
      <h1 className="text-6xl font-bold mb-8">Welcome to Joy Tips</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Complete the challenge and be the first to claim your reward!
      </p>
      <div className="space-y-4">
        <Link 
          href="/admin/login" 
          className="block px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Admin Login
        </Link>
        <Link 
          href="/challenge/start" 
          className="block px-8 py-3 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition"
        >
          Start Challenge
        </Link>
      </div>
    </main>
  );
}