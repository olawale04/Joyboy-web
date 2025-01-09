'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { formatDistance } from 'date-fns';

export default function FinalPage() {
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const claimReward = async () => {
    setClaiming(true);
    try {
      const { data: participant } = await supabase
        .from('participants')
        .select('*')
        .single();

      const { data: existingWinner } = await supabase
        .from('winners')
        .select('*')
        .single();

      if (existingWinner) {
        const timeDiff = formatDistance(
          new Date(existingWinner.claim_time),
          new Date(participant.start_time)
        );
        router.push(`/challenge/too-late?time=${timeDiff}`);
        return;
      }

      const { error: winnerError } = await supabase
        .from('winners')
        .insert([
          {
            username: participant.username,
            claim_time: new Date().toISOString()
          }
        ]);

      if (winnerError) throw winnerError;

      // Get the reward content
      const { data: reward } = await supabase
        .from('rewards')
        .select('*')
        .single();

      if (reward) {
        // Show the reward content
        document.getElementById('rewardContent')!.innerHTML = reward.content;
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8">Final Destination!</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div id="rewardContent" className="mb-8 text-center"></div>
      <button
        onClick={claimReward}
        disabled={claiming}
        className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:bg-gray-400"
      >
        {claiming ? 'Claiming...' : 'Claim Reward'}
      </button>
    </div>
  );
}