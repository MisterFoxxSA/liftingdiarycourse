# Data Fetching Architecture

## CRITICAL: Server Components Only

**ALL data fetching in this application MUST be done via Server Components.**

### Allowed
✅ Server Components fetching data directly
✅ Server Components calling helper functions from `/data` directory

### NOT Allowed
❌ Route handlers (API routes) for data fetching
❌ Client components fetching data
❌ Any other data fetching pattern

## Database Query Requirements

### 1. Use Helper Functions in `/data` Directory

ALL database queries MUST be encapsulated in helper functions located in the `/data` directory.

**Example structure:**
```
/data
  /users.ts         # User-related queries
  /workouts.ts      # Workout-related queries
  /exercises.ts     # Exercise-related queries
```

### 2. Use Drizzle ORM - NO Raw SQL

**ALWAYS use Drizzle ORM for database queries. Raw SQL is strictly prohibited.**

✅ **Correct - Using Drizzle ORM:**
```typescript
// data/workouts.ts
import { db } from '@/db';
import { workouts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function getUserWorkouts(userId: string) {
  return await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId));
}
```

❌ **WRONG - Raw SQL:**
```typescript
// NEVER DO THIS
export async function getUserWorkouts(userId: string) {
  return await db.execute(sql`SELECT * FROM workouts WHERE user_id = ${userId}`);
}
```

### 3. CRITICAL: User Data Isolation

**Users MUST ONLY access their own data. This is a critical security requirement.**

Every data helper function that queries user-specific data MUST:
1. Accept a `userId` parameter
2. Filter results by that `userId`
3. NEVER return data belonging to other users

✅ **Correct - Properly Isolated:**
```typescript
// data/workouts.ts
import { auth } from '@/auth';
import { db } from '@/db';
import { workouts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserWorkouts(userId: string) {
  // Always filter by userId
  return await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId));
}

export async function getWorkoutById(workoutId: string, userId: string) {
  // Even when querying by ID, ALWAYS verify ownership
  const result = await db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.id, workoutId),
        eq(workouts.userId, userId) // Critical: verify ownership
      )
    )
    .limit(1);

  return result[0];
}
```

❌ **WRONG - No User Isolation:**
```typescript
// NEVER DO THIS - Missing userId filter
export async function getWorkoutById(workoutId: string) {
  return await db
    .select()
    .from(workouts)
    .where(eq(workouts.id, workoutId))
    .limit(1);
}
```

## Server Component Data Fetching Pattern

### Step 1: Get Current User Session

Always get the current user's session in your Server Component:

```typescript
// app/dashboard/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Now we have the authenticated user's ID
  const userId = session.user.id;

  // ... fetch data using userId
}
```

### Step 2: Call Data Helper Functions

Use the helper functions from `/data` directory with the authenticated user's ID:

```typescript
// app/dashboard/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserWorkouts } from '@/data/workouts';
import { getUserProfile } from '@/data/users';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = session.user.id;

  // Fetch data using helper functions
  const workouts = await getUserWorkouts(userId);
  const profile = await getUserProfile(userId);

  return (
    <div>
      {/* Render your data */}
    </div>
  );
}
```

### Step 3: Pass Data to Client Components (if needed)

If you need interactivity, pass the data as props to Client Components:

```typescript
// app/dashboard/page.tsx (Server Component)
import { auth } from '@/auth';
import { getUserWorkouts } from '@/data/workouts';
import WorkoutList from '@/components/WorkoutList';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const workouts = await getUserWorkouts(session.user.id);

  return <WorkoutList workouts={workouts} />;
}
```

```typescript
// components/WorkoutList.tsx (Client Component)
'use client';

import { useState } from 'react';

export default function WorkoutList({ workouts }: { workouts: Workout[] }) {
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // Client-side interactivity only, no data fetching
  return (
    <div>
      {workouts.map(workout => (
        <div key={workout.id} onClick={() => setSelectedWorkout(workout)}>
          {workout.name}
        </div>
      ))}
    </div>
  );
}
```

## Security Checklist

Before implementing any data fetching code, verify:

- [ ] Am I fetching data in a Server Component?
- [ ] Am I using a helper function from `/data`?
- [ ] Does the helper function use Drizzle ORM (no raw SQL)?
- [ ] Does the helper function accept and use `userId`?
- [ ] Am I filtering results by `userId` to prevent data leaks?
- [ ] Have I authenticated the user before fetching their data?

## Common Patterns

### Pattern: List View
```typescript
// app/workouts/page.tsx
import { auth } from '@/auth';
import { getUserWorkouts } from '@/data/workouts';

export default async function WorkoutsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const workouts = await getUserWorkouts(session.user.id);

  return <WorkoutList workouts={workouts} />;
}
```

### Pattern: Detail View
```typescript
// app/workouts/[id]/page.tsx
import { auth } from '@/auth';
import { getWorkoutById } from '@/data/workouts';
import { notFound } from 'next/navigation';

export default async function WorkoutDetailPage({
  params
}: {
  params: { id: string }
}) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  // Critical: Pass userId to verify ownership
  const workout = await getWorkoutById(params.id, session.user.id);

  if (!workout) {
    notFound();
  }

  return <WorkoutDetail workout={workout} />;
}
```

### Pattern: Mutations (Server Actions)

For data mutations, use Server Actions that also enforce user isolation:

```typescript
// app/workouts/actions.ts
'use server';

import { auth } from '@/auth';
import { db } from '@/db';
import { workouts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function deleteWorkout(workoutId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Critical: Verify ownership before deletion
  await db
    .delete(workouts)
    .where(
      and(
        eq(workouts.id, workoutId),
        eq(workouts.userId, session.user.id)
      )
    );

  revalidatePath('/workouts');
}
```

## Why This Architecture?

1. **Security**: Server Components ensure data fetching logic runs on the server, preventing exposure of sensitive queries or credentials
2. **User Isolation**: Helper functions with userId filtering prevent data leaks between users
3. **Type Safety**: Drizzle ORM provides full TypeScript support and prevents SQL injection
4. **Performance**: Server Components enable automatic request deduplication and parallel data fetching
5. **Maintainability**: Centralized data functions in `/data` make it easy to update query logic

## Remember

**Data fetching = Server Components + `/data` helpers + Drizzle ORM + userId filtering**

Never compromise on user data isolation. When in doubt, always filter by userId.
