import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

type MoodType = 'Happy' | 'Sad' | 'Angry' | 'Neutral';

const moodOptions: { value: MoodType; emoji: string; color: string }[] = [
  { value: 'Happy', emoji: '😊', color: 'bg-mood-happy' },
  { value: 'Sad', emoji: '😢', color: 'bg-mood-sad' },
  { value: 'Angry', emoji: '😠', color: 'bg-mood-angry' },
  { value: 'Neutral', emoji: '😐', color: 'bg-mood-neutral' },
];

interface MoodLoggerProps {
  onMoodLogged: () => void;
  existingEntry?: {
    mood: MoodType;
    note: string;
  };
}

const MoodLogger: React.FC<MoodLoggerProps> = ({ onMoodLogged, existingEntry }) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(existingEntry?.mood || null);
  const [note, setNote] = useState(existingEntry?.note || '');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood || !user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('mood_entries')
        .upsert({
          user_id: user.id,
          mood: selectedMood,
          note: note.trim(),
          entry_date: new Date().toISOString().split('T')[0],
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Your ${selectedMood.toLowerCase()} mood has been logged.`,
      });

      if (!existingEntry) {
        setSelectedMood(null);
        setNote('');
      }
      
      onMoodLogged();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>How are you feeling today?</CardTitle>
        <CardDescription>
          {existingEntry ? 'Update your mood for today' : 'Log your mood and add a note if you like'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>Select your mood</Label>
            <div className="grid grid-cols-2 gap-3">
              {moodOptions.map((mood) => (
                <Button
                  key={mood.value}
                  type="button"
                  variant={selectedMood === mood.value ? "default" : "outline"}
                  className={`h-16 flex flex-col gap-1 ${
                    selectedMood === mood.value ? mood.color : ''
                  }`}
                  onClick={() => setSelectedMood(mood.value)}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-sm">{mood.value}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Add a note (optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How was your day? What made you feel this way?"
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!selectedMood || loading}
          >
            {loading ? 'Saving...' : (existingEntry ? 'Update Mood' : 'Log Mood')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MoodLogger;