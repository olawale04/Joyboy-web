'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AdminDashboard() {
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [participants, setParticipants] = useState([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = async () => {
    const { data } = await supabase
      .from('participants')
      .select('*')
      .order('start_time', { ascending: false });
    if (data) setParticipants(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Update reward content
      const { error: rewardError } = await supabase
        .from('rewards')
        .upsert([{ id: 1, content }]);

      // Create challenge password
      const { error: passwordError } = await supabase
        .from('challenge_users')
        .upsert([{ id: 1, password }]);

      if (rewardError || passwordError) throw rewardError || passwordError;
      
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Challenge Password
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reward Content (HTML supported)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded h-32"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Save Changes
          </button>
        </form>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Participants</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Start Time</th>
                  <th className="px-4 py-2">Current Page</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p: any) => (
                  <tr key={p.id}>
                    <td className="border px-4 py-2">{p.username}</td>
                    <td className="border px-4 py-2">
                      {new Date(p.start_time).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2">{p.current_page}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}