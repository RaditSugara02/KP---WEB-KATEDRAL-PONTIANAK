---
name: nextjs-webapp
description: Development rules for Next.js 16 + React 19 + Tailwind CSS v4 + shadcn/ui. Use when writing, editing, or generating any code in this Next.js project — pages, components, layouts, styles, or API routes.
---

# Next.js Web App Rules

## Framework

- **Next.js 16** with **App Router** (`app/` directory).
- **React 19** — leverage new features (Server Components, Server Actions, `use` hook).

## Styling — Tailwind CSS v4

- Use **Tailwind CSS v4** with the new CSS-first configuration.
- Define theme customizations with `@theme` inside `globals.css`. **Do NOT** create or use `tailwind.config.js`.
- Use `@import "tailwindcss"` at the top of `globals.css`.
- Prefer utility classes; use `@apply` sparingly and only inside `globals.css`.

```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-primary: #0057a8;
  --font-sans: "Inter", sans-serif;
}
```

## UI Components — shadcn/ui

- Use **shadcn/ui** as the component foundation.
- **Extend** existing shadcn components — never replace them.
- Place custom components in `components/` (not inside `components/ui/`).
- Install new shadcn components via `npx shadcn@latest add <component>`.

## Server vs Client Components

- **Default to Server Components.** Only add `"use client"` when a component needs:
  - State (`useState`, `useReducer`, etc.)
  - Browser APIs (`window`, `localStorage`, etc.)
  - Event handlers (`onClick`, `onChange`, etc.)
  - Class components or imperative refs
- Keep client boundaries minimal — extract small `"use client"` wrappers when needed.

## Data Fetching

- Fetch data in **Server Components** using `async`/`await` with `fetch()` or direct DB queries.
- Use **Server Actions** (`"use server"`) for mutations and form submissions.
- Avoid client-side `fetch` unless absolutely necessary (e.g., real-time polling).

```tsx
// Server Component — data fetching
export default async function Page() {
  const items = await db.select().from(itemsTable);
  return <ItemList items={items} />;
}
```

```tsx
// Server Action — mutation
"use server";
export async function createItem(formData: FormData) {
  const name = formData.get("name") as string;
  await db.insert(itemsTable).values({ name });
  revalidatePath("/items");
}
```

## Error Handling

- Use `error.tsx` for runtime error boundaries within route segments.
- Use `not-found.tsx` for missing resource scenarios (paired with `notFound()` function).
- Both files must be **Client Components** (`"use client"`).

```tsx
// error.tsx
"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>Something went wrong.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## Images

- **Always** use `next/image` (`<Image />`) — never raw `<img>` tags.
- Provide explicit `width`, `height` (or use `fill` with a positioned parent).
- Always include a descriptive `alt` attribute.

```tsx
import Image from "next/image";

<Image src="/logo.png" alt="Logo" width={200} height={80} />
```

## File & Naming Conventions

| Type              | Convention                          |
|-------------------|-------------------------------------|
| Pages             | `app/route/page.tsx`                |
| Layouts           | `app/route/layout.tsx`              |
| Server Actions    | `lib/actions/<domain>.ts`           |
| Client components | `components/<domain>/<Name>.tsx`    |
| Utilities         | `lib/<name>.ts`                     |
| DB schema         | `lib/db/schema.ts`                  |

## Quick Checklist

- [ ] Is this a Server Component? Add `"use client"` only if necessary.
- [ ] Am I using `@theme` in `globals.css` instead of `tailwind.config.js`?
- [ ] Am I extending shadcn/ui rather than replacing it?
- [ ] Did I use `next/image` with `width`, `height`, and `alt`?
- [ ] Is data fetching done in Server Components or Server Actions?
- [ ] Did I add `error.tsx` / `not-found.tsx` for this route?
