import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateMenuItemAction } from "@/lib/actions/menu-items";
import { MenuItemForm } from "../_components/MenuItemForm";

export default async function EditMenuItemPage(props: PageProps<"/admin/menu-items/[id]">) {
  const [{ id }, searchParams] = await Promise.all([props.params, props.searchParams]);
  const error = typeof searchParams.error === "string" ? searchParams.error : undefined;

  const [item, categories] = await Promise.all([
    db.menuItem.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!item) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Edit Menu Item</h1>
      <MenuItemForm action={updateMenuItemAction} categories={categories} item={item} error={error} />
    </div>
  );
}
