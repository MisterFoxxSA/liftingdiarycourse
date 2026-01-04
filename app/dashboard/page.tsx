import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserWorkoutsByDate } from "@/data/workouts";
import DashboardClient from "./DashboardClient";

type PageProps = {
  searchParams: Promise<{ date?: string }>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  // Get the current user session
  const { userId } = await auth();

  // Redirect to sign-in if not authenticated
  if (!userId) {
    redirect("/sign-in");
  }

  // Get the date from searchParams or use today
  const params = await searchParams;
  const dateParam = params.date;
  // Parse date as local time to avoid timezone issues
  const selectedDate = dateParam
    ? new Date(dateParam + 'T00:00:00') // Force local timezone
    : new Date();

  // Fetch workouts for the selected date
  const workouts = await getUserWorkoutsByDate(userId, selectedDate);

  return (
    <DashboardClient
      key={selectedDate.toISOString()}
      initialDate={selectedDate}
      initialWorkouts={workouts}
    />
  );
}
