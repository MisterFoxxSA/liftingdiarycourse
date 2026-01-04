import 'dotenv/config';
import { db } from '@/src/db';
import { workouts, workoutExercises, sets, exercises } from '@/src/db/schema';

async function clearDummyData() {
  try {
    console.log('🗑️  Clearing all dummy workout data...');

    // Delete in correct order due to foreign key constraints
    // 1. Delete all sets
    const deletedSets = await db.delete(sets);
    console.log('✓ Deleted all sets');

    // 2. Delete all workout exercises
    const deletedWorkoutExercises = await db.delete(workoutExercises);
    console.log('✓ Deleted all workout exercises');

    // 3. Delete all workouts
    const deletedWorkouts = await db.delete(workouts);
    console.log('✓ Deleted all workouts');

    // Optional: Delete all exercises (uncomment if you want to clear exercises too)
    // const deletedExercises = await db.delete(exercises);
    // console.log('✓ Deleted all exercises');

    console.log('\n✅ All dummy workout data has been cleared!');
    console.log('Your dashboard should now show "No workouts logged"');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    process.exit(1);
  }
}

clearDummyData();
