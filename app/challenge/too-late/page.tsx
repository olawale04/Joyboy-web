'use client';

import { useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export default function TooLatePage() {
  const searchParams = useSearchParams();
  const timeDiff = searchParams.get('time');
  const [winner, setWinner] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const getWinner = async () => {
      const supabase = createClientComponentClient();
      const { data } = await supabase
        .from('winners')
        .select('username')
        .single();
      if (data) setWinner(data);
    };
    getWinner();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold mb-8">Sorry, you were too late!</h1>
      {winner && (
        <p className="text-xl mb-4">
          The reward was already claimed by <strong>{winner.username}</strong>
        </p>
      )}
      {timeDiff && (
        <p className="text-lg">
          You were {timeDiff} late to claim the reward.
        </p>
      )}
    </div>
  );
}