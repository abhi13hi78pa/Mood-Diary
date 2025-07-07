import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      // Show landing page for non-authenticated users
    }
  }, [user, loading, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if user is authenticated
  if (user) {
    return <Dashboard />;
  }

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-5xl mb-4">🌸</h1>
          <h2 className="text-4xl font-bold mb-4 text-primary">Mood Diary</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Track your daily emotions and reflect on your journey
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/auth')}
            size="lg"
            className="w-full"
          >
            Get Started
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Start logging your moods and discover patterns in your emotional well-being
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
