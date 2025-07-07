import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

type MoodEntry = {
  id: string;
  mood: 'Happy' | 'Sad' | 'Angry' | 'Neutral';
  note: string;
  entry_date: string;
  created_at: string;
};

const moodEmojis = {
  Happy: '😊',
  Sad: '😢',
  Angry: '😠',
  Neutral: '😐',
};

const moodColors = {
  Happy: 'bg-mood-happy',
  Sad: 'bg-mood-sad',
  Angry: 'bg-mood-angry',
  Neutral: 'bg-mood-neutral',
};

const MoodHistory: React.FC = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchMoodEntries();
  }, [user]);

  const fetchMoodEntries = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false })
        .limit(30);

      if (error) throw error;
      setEntries((data || []) as MoodEntry[]);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Mood History</CardTitle>
          <CardDescription>Loading your mood entries...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Mood History</CardTitle>
          <CardDescription>No mood entries yet. Start by logging your first mood!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Mood History</CardTitle>
        <CardDescription>Your recent mood entries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`p-4 rounded-lg border ${moodColors[entry.mood]} transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{moodEmojis[entry.mood]}</span>
                  <span className="font-medium">{entry.mood}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(entry.entry_date), 'MMM dd, yyyy')}
                </span>
              </div>
              {entry.note && (
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {entry.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodHistory;