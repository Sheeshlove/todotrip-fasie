
import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import TripPlanner from '@/components/TripPlanner';

const AITrip = () => {
  return (
    <PageLayout title="ToDoTrip - AI Trip Planner" description="Нейросеть сама составит тебе маршрут!">
      <TripPlanner />
    </PageLayout>
  );
};

export default AITrip;
