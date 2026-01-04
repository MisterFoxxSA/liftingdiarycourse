import { db } from '@/src/db';
import { workouts, workoutExercises, exercises, sets } from '@/src/db/schema';
import { eq, and, gte, lt } from 'drizzle-orm';

/**
 * Get all workouts for a specific user on a specific date
 *
 * @param userId - The Clerk user ID
 * @param date - The date to filter workouts by
 * @returns Array of workouts with their exercises and sets
 */
export async function getUserWorkoutsByDate(userId: string, date: Date) {
  // Create date range for the entire day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Fetch workouts with all related data
  const userWorkouts = await db.query.workouts.findMany({
    where: and(
      eq(workouts.userId, userId),
      gte(workouts.workoutDate, startOfDay),
      lt(workouts.workoutDate, endOfDay)
    ),
    with: {
      workoutExercises: {
        orderBy: (workoutExercises, { asc }) => [asc(workoutExercises.order)],
        with: {
          exercise: true,
          sets: {
            orderBy: (sets, { asc }) => [asc(sets.setOrder)],
          },
        },
      },
    },
    orderBy: (workouts, { desc }) => [desc(workouts.workoutDate)],
  });

  return userWorkouts;
}

/**
 * Get all workouts for a specific user
 *
 * @param userId - The Clerk user ID
 * @returns Array of all workouts for the user
 */
export async function getUserWorkouts(userId: string) {
  const userWorkouts = await db.query.workouts.findMany({
    where: eq(workouts.userId, userId),
    with: {
      workoutExercises: {
        orderBy: (workoutExercises, { asc }) => [asc(workoutExercises.order)],
        with: {
          exercise: true,
          sets: {
            orderBy: (sets, { asc }) => [asc(sets.setOrder)],
          },
        },
      },
    },
    orderBy: (workouts, { desc }) => [desc(workouts.workoutDate)],
  });

  return userWorkouts;
}
