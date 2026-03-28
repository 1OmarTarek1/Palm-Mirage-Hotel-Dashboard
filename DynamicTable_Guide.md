# DynamicTable Guide

This guide explains how to use `DynamicTable` in the dashboard, how to configure columns and filters, and where the table's responsibility ends.

## Goal

`DynamicTable` is a generic reusable table component.

It is responsible for:
- rendering rows and cells
- search, filter, sort, and pagination on the client
- rendering the actions dropdown
- calling external action handlers
- showing loading skeleton rows

It is not responsible for:
- fetching API data
- opening feature-specific modals
- routing to pages
- delete API calls
- edit/view business logic

That logic belongs in the parent client wrapper such as `ActivitiesTableClient`.

## Current File Locations

- Table component: [DynamicTable.tsx](/d:/Work%20Place/Projects/Palm%20Hotel/Dashboard/src/components/shared/table/DynamicTable.tsx)
- Shared types: [types.ts](/d:/Work%20Place/Projects/Palm%20Hotel/Dashboard/src/components/shared/table/types.ts)
- Activities example: [ActivitiesTableClient.tsx](/d:/Work%20Place/Projects/Palm%20Hotel/Dashboard/src/components/Activities/ActivitiesTableClient.tsx)
- Activity preset: [activityColumns.ts](/d:/Work%20Place/Projects/Palm%20Hotel/Dashboard/src/config/tablePresets/activityColumns.ts)

## Basic Usage

```tsx
"use client";

import DynamicTable from "@/components/shared/table/DynamicTable";
import type { Column, FilterConfig, RowActionConfig } from "@/components/shared/table/types";

type User = {
  id: string;
  name: string;
  role: string;
  createdAt: string;
};

const columns: Column<User>[] = [
  {
    key: "name",
    title: "Name",
    searchable: true,
    sortable: true,
    cellAlign: "left",
  },
  {
    key: "role",
    title: "Role",
    type: "badge",
    searchable: true,
    sortable: true,
  },
  {
    key: "createdAt",
    title: "Created At",
    type: "date",
    accessorType: "date",
    sortable: true,
  },
];

const filters: FilterConfig<User>[] = [
  {
    key: "role",
    label: "Role",
    type: "select",
    options: [
      { label: "Admin", value: "admin" },
      { label: "Editor", value: "editor" },
    ],
  },
];

const actions: RowActionConfig<User>[] = [
  {
    key: "view",
    onClick: (user) => console.log("view", user.id),
  },
  {
    key: "edit",
    onClick: (user) => console.log("edit", user.id),
  },
  {
    key: "delete",
    variant: "danger",
    onClick: (user) => console.log("delete", user.id),
  },
];

export default function UsersTableClient() {
  const data: User[] = [];

  return (
    <DynamicTable<User>
      columns={columns}
      data={data}
      filtersConfig={filters}
      actions={actions}
      pageSize={10}
      searchPlaceholder="Search users..."
    />
  );
}
```

## Props

`DynamicTable<T>` accepts:

- `columns: Column<T>[]`
- `data: T[]`
- `isLoading?: boolean`
- `pageSize?: number`
- `searchPlaceholder?: string`
- `filtersConfig?: FilterConfig<T>[]`
- `actions?: RowActionConfig<T>[]`

## Column Definition

Each column is a `Column<T>`.

Supported fields:

- `key`
  - property name in the row object
- `title`
  - header label
- `cellAlign?: "left" | "center" | "right"`
  - affects body cells only
  - header stays centered independently
- `sortable?: boolean`
- `searchable?: boolean`
- `filterable?: boolean`
- `accessorKey?: string`
  - for nested values like `"author.profile.name"`
- `type?: "text" | "image-card" | "badge" | "icon" | "count" | "date" | "action-dropdown"`
- `accessorType?: "text" | "join" | "count" | "date"`
- `config?: Record<string, any>`

## Cell Types

### `text`
Default text rendering.

```ts
{
  key: "title",
  title: "Title",
}
```

### `image-card`
Used for title/image/subtitle style cells.

```ts
{
  key: "title",
  title: "Activity",
  type: "image-card",
  config: {
    imageKey: "image",
    subtitleKey: "label",
  },
}
```

### `badge`
Renders a pill style value.

```ts
{
  key: "category",
  title: "Category",
  type: "badge",
}
```

### `icon`
Renders an icon through the shared icon cell map.

```ts
{
  key: "icon",
  title: "Icon",
  type: "icon",
}
```

### `count`
Useful for arrays.

```ts
{
  key: "highlights",
  title: "Highlights",
  type: "count",
  accessorType: "count",
}
```

### `date`
Formats the value as a date.

```ts
{
  key: "createdAt",
  title: "Created At",
  type: "date",
  accessorType: "date",
}
```

## Search

Global search is client-side.

How it works:
- the table receives full data
- it searches only inside columns marked with `searchable: true`
- search is debounced by `300ms`
- no extra API request is sent while typing
- search runs before pagination, so it checks all loaded rows, not only the current page

### Search Pipeline

The search flow inside `DynamicTable` is:

1. The user types into `SearchBar`.
2. The value is stored in `searchTerm`.
3. A `300ms` debounce updates `debouncedSearchTerm`.
4. The table starts from the full `data` array.
5. It builds a list of searchable columns by reading `columns.filter((c) => c.searchable)`.
6. For each row, it reads the cell value through `resolveValue(...)`.
7. The value is converted to lowercase text and checked with `includes(...)`.
8. Matching rows move to the next step of the pipeline: sorting, then pagination.

### What This Means

- Search is generic and reusable across tables.
- Search does not inspect every field in the row automatically.
- Search only looks at columns you explicitly mark as `searchable: true`.
- Pagination does not limit the search scope. Pagination only slices the final result after search and sort are complete.
- If the parent passes 100 loaded rows, the search checks all 100 rows.

Example:

```ts
{
  key: "title",
  title: "Activity",
  searchable: true,
}
```

### When Generic Search Is Enough

The current search is a good fit when:

- the dataset is already loaded in the client
- the row count is small or medium
- matching plain text is enough
- you want the same table engine to work for multiple entities

### When You May Need Custom Search

You may need table-specific or server-side search when:

- the dataset is very large
- the search should hit the API instead of local memory
- the searchable value is not directly represented by a column
- you need fuzzy search, token search, Arabic normalization, or advanced matching rules
- you want to combine several fields into one custom searchable string

In other words, the current design is not "one search per table". It is "one generic search engine, configured by each table's columns".

## Filters

Filtering is also client-side.

Supported filter types:
- `select`
- `range`

### Filter Pipeline

Filters are applied in the same `filteredData` step as search.

The order is:

1. Start with the full `data` array.
2. Apply global search if `debouncedSearchTerm` is not empty.
3. Apply each configured column filter from the `filters` state.
4. Return the fully filtered result.
5. Apply sorting.
6. Apply pagination last.

This means filters also work across all loaded rows, not only the visible page.

### Select Filters

A `select` filter compares the row value with the selected option.

- `__all__` is used in the UI as the neutral value
- when `__all__` is selected, the stored filter becomes an empty string
- empty string means "do not filter this field"

### Range Filters

A `range` filter expects an object like:

```ts
{ min?: number | string; max?: number | string }
```

Behavior:

- empty `min` and `max` means the filter is ignored
- only `min` means "greater than or equal to min"
- only `max` means "less than or equal to max"
- if both are present and `min > max`, the table auto-swaps them
- row values are converted to numbers before comparison

### Active Filter State

`DynamicTable` treats these as active controls:

- search term
- column filters
- sort state

That is why the reset action clears all three together:

- `searchTerm`
- `filters`
- `sortConfig`

Example:

```ts
const filters: FilterConfig<Product>[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Published", value: "published" },
      { label: "Draft", value: "draft" },
    ],
  },
  {
    key: "price",
    label: "Price",
    type: "range",
  },
];
```

## Sorting

Sorting is client-side and works only on columns with `sortable: true`.

```ts
{
  key: "createdAt",
  title: "Created At",
  sortable: true,
}
```

## Pagination

Pagination is built in automatically.

Behavior:
- handled on the client
- changing page scrolls back to the top of the table
- if `isLoading` is true, pagination stays rendered while skeleton rows are shown

## Loading Skeleton

Do not hide the whole table during loading.

Pass:

```tsx
<DynamicTable<User>
  columns={columns}
  data={data}
  isLoading={isLoading}
/>
```

This keeps:
- search bar visible
- filters visible
- header visible
- pagination visible

Only the body becomes skeleton rows.

## Actions

Actions are generic.

The table:
- shows `view`, `edit`, `delete` buttons in a dropdown
- calls the matching `onClick`

The table does not know whether the handler:
- opens a modal
- navigates to another page
- calls an API
- shows a confirmation dialog

Example:

```tsx
const actions: RowActionConfig<Activity>[] = [
  {
    key: "view",
    onClick: (activity) => setViewingActivityId(activity.id),
  },
  {
    key: "edit",
    onClick: (activity) => setEditingActivityId(activity.id),
  },
  {
    key: "delete",
    variant: "danger",
    onClick: (activity) => setDeletingActivityId(activity.id),
  },
];

<DynamicTable<Activity>
  columns={activityColumns}
  data={activities}
  actions={actions}
/>
```

### Modal Example

```tsx
const actions: RowActionConfig<Activity>[] = [
  {
    key: "view",
    onClick: (activity) => setViewingActivityId(activity.id),
  },
  {
    key: "edit",
    onClick: (activity) => {
      setEditingActivityId(activity.id);
      setEditingDraft(activity);
    },
  },
  {
    key: "delete",
    variant: "danger",
    onClick: (activity) => setDeletingActivityId(activity.id),
  },
];
```

### Page Navigation Example

```tsx
const router = useRouter();

const actions: RowActionConfig<Activity>[] = [
  {
    key: "view",
    label: "Open Details Page",
    onClick: (activity) => router.push(`/dashboard/activities/${activity.id}`),
  },
  {
    key: "edit",
    label: "Open Edit Page",
    onClick: (activity) => router.push(`/dashboard/activities/${activity.id}/edit`),
  },
  {
    key: "delete",
    variant: "danger",
    onClick: (activity) => setDeletingActivityId(activity.id),
  },
];
```

Same table, different behavior. The difference is only in the parent wrapper.

## Recommended Architecture

For each feature, keep this split:

### Shared
- `DynamicTable`
- shared cells
- shared filters/search/pagination
- `SharedModal`

### Feature-specific
- `ActivitiesTableClient`
- `ActivityEditForm`
- `ActivityDetailsView`
- `ActivityDeleteConfirm`
- `activities.ts` API service

## Recommended Implementation Pattern

Use a client wrapper for each entity.

Typical responsibilities of the wrapper:
- fetch API data
- manage loading and error state
- define action configs
- manage modal state
- call create/edit/delete APIs
- pass ready data into `DynamicTable`

Example shape:

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import DynamicTable from "@/components/shared/table/DynamicTable";
import SharedModal from "@/components/shared/modal/SharedModal";

export default function ExampleTableClient() {
  const [rows, setRows] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRow, setEditingRow] = useState<Entity | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await fetchEntities();
      setRows(data);
      setIsLoading(false);
    };

    load();
  }, []);

  return (
    <>
      <DynamicTable<Entity>
        columns={columns}
        data={rows}
        isLoading={isLoading}
        filtersConfig={filters}
        actions={[
          {
            key: "edit",
            onClick: (row) => setEditingRow(row),
          },
        ]}
      />

      <SharedModal
        isOpen={Boolean(editingRow)}
        onClose={() => setEditingRow(null)}
        title="Edit"
        onSave={() => {}}
      >
        {editingRow ? <EditForm entity={editingRow} /> : null}
      </SharedModal>
    </>
  );
}
```

## Activities Example

The current `activities` implementation is the reference example in this project:

- table wrapper: [ActivitiesTableClient.tsx](/d:/Work%20Place/Projects/Palm%20Hotel/Dashboard/src/components/Activities/ActivitiesTableClient.tsx)
- table preset: [activityColumns.ts](/d:/Work%20Place/Projects/Palm%20Hotel/Dashboard/src/config/tablePresets/activityColumns.ts)
- API service: [activities.ts](/d:/Work%20Place/Projects/Palm%20Hotel/Dashboard/src/lib/activities.ts)

Current behaviors there:
- search, filter, sort, pagination are local in the table
- data fetching is external
- `view` opens a shared modal
- `edit` opens a shared modal with a feature form
- `delete` opens a shared confirmation modal
- first body column is left-aligned using `cellAlign: "left"`

## Presets

If a feature has stable columns and filters, define them in a preset file.

Example:

```ts
export const columns: Column<Activity>[] = [...]
export const filters: FilterConfig<Activity>[] = [...]
```

Then use them in the wrapper:

```tsx
<DynamicTable<Activity>
  columns={activityColumns}
  data={activities}
  filtersConfig={activityFilters}
/>
```

## Type Safety Notes

`DynamicTable` is generic and should stay generic.

Correct pattern:
- each entity has its own explicit type
  - `Activity`
  - `Room`
  - `Booking`
  - `User`
- the table receives that type generically

Example:

```tsx
<DynamicTable<Activity>
  columns={activityColumns}
  data={activities}
/>
```

Do not turn feature data into `any` just to satisfy the table.

## Limits

Current table behavior is client-side.

That means:
- search is local
- filter is local
- sort is local
- pagination is local

This is good for:
- small and medium datasets
- admin lists with manageable row counts

If a table becomes very large, consider a future server-side version.

## Rules For Developers

1. Keep `DynamicTable` generic.
2. Do not hardcode feature business logic inside table cells.
3. Put API calls in feature services, not inside the table.
4. Put modal open/close state in the feature wrapper, not inside the table.
5. Use presets for columns and filters when possible.
6. Use `cellAlign` only for body alignment.
7. Keep header alignment independent from cell alignment.
8. Use `isLoading` instead of replacing the table with a plain loading message.

## Short Checklist

When adding a new table:

1. Create entity type.
2. Create column definitions.
3. Create filters if needed.
4. Create API service.
5. Create client wrapper.
6. Pass `data`, `columns`, `filtersConfig`, and `actions` to `DynamicTable`.
7. Add shared modal usage only in the wrapper if needed.

## Summary

Think about `DynamicTable` as a reusable table engine.

Think about each `*TableClient` component as the feature controller.

That split is what keeps the dashboard maintainable as more entities are added.
