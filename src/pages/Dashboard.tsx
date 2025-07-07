import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import MoodLogger from '@/components/MoodLogger';
import MoodHistory from '@/components/MoodHistory';
import { supabase } from '@/integrations/supabase/client';
import { LogOut } from 'lucide-react';

type TodaysMoodEntry = {
  mood: 'Happy' | 'Sad' | 'Angry' | 'Neutral';
  note: string;
};

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [todaysMood, setTodaysMood] = useState<TodaysMoodEntry | null>(null);
  const [refreshHistory, setRefreshHistory] = useState(0);

  useEffect(() => {
    fetchTodaysMood();
  }, [user, refreshHistory]);

  const fetchTodaysMood = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('mood_entries')
        .select('mood, note')
        .eq('user_id', user.id)
        .eq('entry_date', today)
        .maybeSingle();

      if (error) throw error;
      setTodaysMood(data as TodaysMoodEntry | null);
    } catch (error) {
      console.error('Error fetching today\'s mood:', error);
    }
  };

  const handleMoodLogged = () => {
    setRefreshHistory(prev => prev + 1);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              🌸 Mood Diary
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.email?.split('@')[0]}!
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Mood Logger */}
          <div>
            <MoodLogger 
              onMoodLogged={handleMoodLogged}
              existingEntry={todaysMood}
            />
          </div>

          {/* Mood History */}
          <div>
            <MoodHistory key={refreshHistory} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;