# API Feature Development Workflow

The order always flows left to right:

```
packages/db  →  packages/types  →  apps/api  →  packages/trpc  →  frontend
(Drizzle)       (Zod schemas)      (router)      (re-export)       (uses types)
```

---

## Step 1 — `packages/db`: Define the database model

Add your table to `packages/db/src/schema.ts`:

```ts
export const tripStatusEnum = pgEnum("TripStatus", ["DRAFT", "PUBLISHED", "ARCHIVED"])

export const trips = pgTable("trips", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  agencyId: text("agencyId").notNull().references(() => agencies.id),
  title: text("title").notNull(),
  status: tripStatusEnum("status").notNull().default("DRAFT"),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
})

export const tripsRelations = relations(trips, ({ one }) => ({
  agency: one(agencies, { fields: [trips.agencyId], references: [agencies.id] }),
}))
```

Then generate and run the migration:

```bash
pnpm db:generate    # diffs schema.ts and writes a new SQL migration
pnpm db:migrate     # applies pending migrations
```

---

## Step 2 — `packages/types`: Write Zod schemas

The Drizzle table defines the DB shape. `packages/types` defines the **API contract** — what your routes accept and return. These are used for validation on both the API and frontend sides.

Add to `packages/types/src/trip.ts`:

```ts
// Input schemas — what the API accepts
export const CreateTripSchema = z.object({ title: z.string().min(1), ... })
export const UpdateTripSchema = CreateTripSchema.partial()

// Inferred TS types — used everywhere
export type Trip = z.infer<typeof TripSchema>
export type CreateTrip = z.infer<typeof CreateTripSchema>
```

**Rule:** Zod schemas live here, not in `apps/api`. The API imports from `@atlora/types`.

---

## Step 3 — `apps/api`: Build the tRPC router

Create a router file per domain: `apps/api/src/routers/trip.ts`

```ts
import { router, protectedProcedure } from '../trpc'
import { CreateTripSchema, UpdateTripSchema } from '@atlora/types'
import { db, trips } from '@atlora/db'
import { eq } from 'drizzle-orm'

export const tripRouter = router({
  list: protectedProcedure.query(({ ctx }) =>
    db.select().from(trips).where(eq(trips.agencyId, ctx.agencyId))
  ),

  create: protectedProcedure
    .input(CreateTripSchema)          // ← Zod schema from @atlora/types
    .mutation(async ({ input, ctx }) => {
      const [trip] = await db.insert(trips).values({ ...input, agencyId: ctx.agencyId }).returning()
      return trip
    }),

  update: protectedProcedure
    .input(UpdateTripSchema)
    .mutation(async ({ input }) => {
      const [trip] = await db.update(trips).set(input).where(eq(trips.id, input.id)).returning()
      return trip
    }),
})
```

Then wire it into the root router in `apps/api/src/index.ts`:

```ts
export const appRouter = router({
  trip: tripRouter,
  // destination: destinationRouter,
})

export type AppRouter = typeof appRouter  // ← this is what @atlora/trpc re-exports
```

---

## Step 4 — `packages/trpc`: Nothing to touch (usually)

`packages/trpc` already re-exports `AppRouter` from `apps/api`. Because TypeScript resolves workspace packages at build time, the moment you add a new router and update `AppRouter`, all frontends automatically get the new typed procedures. Only touch this package if you need to export a new tRPC utility.

---

## Step 5 — Frontend: Call the procedure

In `apps/admin` or `apps/web`, the tRPC client is already typed end-to-end:

```ts
import { trpc } from '@/lib/trpc'   // configured in the app using @atlora/trpc

// Fully typed — autocompletes, input validates, return type inferred
const { data } = trpc.trip.list.useQuery()
const createTrip = trpc.trip.create.useMutation()
```

No manual type imports needed — the return type of `trip.list` is automatically inferred from what Drizzle returns in the router.

---

## Package responsibilities

| Package | Your job | Never do |
|---|---|---|
| `packages/db` | Drizzle tables + migrations | Business logic |
| `packages/types` | Zod input/output schemas | DB queries |
| `apps/api` | tRPC routers + procedures | Define Zod schemas here |
| `packages/trpc` | Re-export `AppRouter` + client utils | Add business logic |
| `apps/admin` / `apps/web` | Call procedures via tRPC client | Import from `apps/api` directly |

**Key discipline:** Zod schemas own the contract, Drizzle owns the shape — keep them separate. They often look similar but serve different purposes (Drizzle is DB-centric; Zod schemas are what you're willing to expose over the API).
