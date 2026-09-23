import { db } from "@/lib/db";
import {
  createCategoryAction,
  renameCategoryAction,
  deleteCategoryAction,
  moveCategoryAction,
} from "@/lib/actions/categories";

export default async function AdminCategoriesPage(props: PageProps<"/admin/categories">) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { items: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Categories</h1>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <ul className="mt-6 divide-y divide-cafe-border rounded-xl border border-cafe-border bg-cafe-surface">
        {categories.map((category, index) => (
          <li key={category.id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex flex-col">
              <form action={moveCategoryAction}>
                <input type="hidden" name="id" value={category.id} />
                <input type="hidden" name="direction" value="up" />
                <button
                  type="submit"
                  disabled={index === 0}
                  className="block text-cafe-muted hover:text-cafe-primary disabled:opacity-20"
                  aria-label="Move up"
                >
                  ▲
                </button>
              </form>
              <form action={moveCategoryAction}>
                <input type="hidden" name="id" value={category.id} />
                <input type="hidden" name="direction" value="down" />
                <button
                  type="submit"
                  disabled={index === categories.length - 1}
                  className="block text-cafe-muted hover:text-cafe-primary disabled:opacity-20"
                  aria-label="Move down"
                >
                  ▼
                </button>
              </form>
            </div>

            <form action={renameCategoryAction} className="flex flex-1 items-center gap-2">
              <input type="hidden" name="id" value={category.id} />
              <input
                name="name"
                defaultValue={category.name}
                className="flex-1 rounded-md border border-cafe-border px-3 py-1.5 text-sm"
              />
              <span className="whitespace-nowrap text-xs text-cafe-muted">
                {category._count.items} item{category._count.items === 1 ? "" : "s"}
              </span>
              <button
                type="submit"
                className="rounded-md border border-cafe-border px-3 py-1.5 text-sm font-medium hover:border-cafe-primary"
              >
                Save
              </button>
            </form>

            <form action={deleteCategoryAction}>
              <input type="hidden" name="id" value={category.id} />
              <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-800">
                Delete
              </button>
            </form>
          </li>
        ))}

        {categories.length === 0 && (
          <li className="px-4 py-6 text-sm text-cafe-muted">No categories yet — add one below.</li>
        )}
      </ul>

      <form action={createCategoryAction} className="mt-6 flex gap-2">
        <input
          name="name"
          placeholder="New category name"
          required
          className="flex-1 rounded-md border border-cafe-border px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-md bg-cafe-primary px-4 py-2 text-sm font-semibold text-cafe-primary-foreground hover:opacity-90"
        >
          Add Category
        </button>
      </form>
    </div>
  );
}
