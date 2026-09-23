import { db } from "@/lib/db";
import { createMenuItemAction } from "@/lib/actions/menu-items";
import { MenuItemForm } from "../_components/MenuItemForm";

export default async function NewMenuItemPage(props: PageProps<"/admin/menu-items/new">) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : undefined;
  const categories = await db.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Add Menu Item</h1>
      <MenuItemForm action={createMenuItemAction} categories={categories} error={error} />
    </div>
  );
}
