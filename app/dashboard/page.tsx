"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

// Mock workout data type
type Workout = {
  id: string;
  name: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
  }[];
  duration: string;
  completedAt: string;
};

// Mock workouts for UI display
const mockWorkouts: Workout[] = [
  {
    id: "1",
    name: "Upper Body Strength",
    exercises: [
      { name: "Bench Press", sets: 4, reps: 8, weight: 185 },
      { name: "Overhead Press", sets: 3, reps: 10, weight: 95 },
      { name: "Pull-ups", sets: 3, reps: 12 },
    ],
    duration: "45 min",
    completedAt: "10:30 AM",
  },
  {
    id: "2",
    name: "Core & Cardio",
    exercises: [
      { name: "Plank", sets: 3, reps: 1 },
      { name: "Russian Twists", sets: 3, reps: 20 },
      { name: "Running", sets: 1, reps: 1 },
    ],
    duration: "30 min",
    completedAt: "6:00 PM",
  },
];

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Track your workouts and progress
          </p>
        </div>

        {/* Date Picker Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
              <CardDescription>
                Choose a date to view your workouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full bg-blue-600 justify-start text-left font-normal sm:w-[280px]"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "do MMM yyyy")}
                </Button>

                {showCalendar && (
                  <div className="rounded-md border p-3">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date);
                          setShowCalendar(false);
                        }
                      }}
                      initialFocus
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workouts List Section */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Workouts for {format(selectedDate, "do MMM yyyy")}
          </h2>

          {mockWorkouts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-center text-zinc-500 dark:text-zinc-400">
                  No workouts logged for this date
                </p>
                <Button className="mt-4">Log Workout</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {mockWorkouts.map((workout) => (
                <Card key={workout.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{workout.name}</CardTitle>
                        <CardDescription>
                          Completed at {workout.completedAt} • {workout.duration}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {workout.exercises.map((exercise, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-zinc-900 dark:text-zinc-50">
                              {exercise.name}
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              {exercise.sets} sets × {exercise.reps} reps
                              {exercise.weight && ` @ ${exercise.weight} lbs`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
