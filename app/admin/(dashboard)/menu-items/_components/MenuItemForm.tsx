type Category = { id: string; name: string };

type Item = {
  id: string;
  name: string;
  description: string | null;
  price: unknown;
  categoryId: string;
  isAvailable: boolean;
  imageUrl: string | null;
};

export function MenuItemForm({
  action,
  categories,
  item,
  error,
}: {
  action: (formData: FormData) => void;
  categories: Category[];
  item?: Item;
  error?: string;
}) {
  return (
    <form action={action} className="mt-6 max-w-lg space-y-5">
      {item && <input type="hidden" name="id" value={item.id} />}

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={item?.name}
          className="mt-1 w-full rounded-md border border-cafe-border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={item?.description ?? ""}
          className="mt-1 w-full rounded-md border border-cafe-border px-3 py-2 text-sm"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="price" className="block text-sm font-medium text-foreground">
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={item ? String(item.price) : undefined}
            className="mt-1 w-full rounded-md border border-cafe-border px-3 py-2 text-sm"
          />
        </div>

        <div className="flex-1">
          <label htmlFor="categoryId" className="block text-sm font-medium text-foreground">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={item?.categoryId ?? ""}
            className="mt-1 w-full rounded-md border border-cafe-border px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-foreground">
          Photo {item?.imageUrl && "(replace)"}
        </label>
        {item?.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- runtime-served upload, not a build-time static asset
          <img src={item.imageUrl} alt="" className="mt-2 h-24 w-24 rounded-md object-cover" />
        )}
        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="mt-2 block w-full text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isAvailable"
          name="isAvailable"
          type="checkbox"
          defaultChecked={item?.isAvailable ?? true}
          className="h-4 w-4 rounded border-cafe-border"
        />
        <label htmlFor="isAvailable" className="text-sm text-foreground">
          Available on the menu
        </label>
      </div>

      <button
        type="submit"
        className="rounded-md bg-cafe-primary px-4 py-2 text-sm font-semibold text-cafe-primary-foreground hover:opacity-90"
      >
        {item ? "Save Changes" : "Add Item"}
      </button>
    </form>
  );
}
