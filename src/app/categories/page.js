"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/layout/ConfirmDialog";
import ImageUploader from "@/components/layout/ImageUploader";
import { fetcher } from "@/lib/fetcher";

export default function Categories() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const refresh = async () => {
    try {
      const res = await fetcher("/api/category/getCategories");
      setItems(res.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetcher("/api/category/createCategory", "post", {
        name,
        image,
      });

      if (!res.ok) throw new Error();

      setName("");
      setImage("");
      refresh();
      toast.success("Category added");
    } catch (error) {
      toast.error("Failed to add category");
    }
  };

  const handleUpdate = async () => {
    if (!editItem) return;
    const payload = {
      name: editItem.name,
      image: editItem.image,
    };

    try {
      const res = await fetcher(
        `/api/category/updateCategory/${editItem._id}`,
        "put",
        payload,
      );

      if (!res.ok) throw new Error();

      setEditItem(null);
      refresh();
      toast.success("Category updated");
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  // ✅ Delete Category
  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      const res = await fetcher(
        `/api/category/deleteCategory/${deleteItem._id}`,
        "delete",
      );

      if (!res.ok) throw new Error();

      setDeleteItem(null);
      refresh();
      toast.success("Category deleted");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div>
      {/* Add Category Form */}
      <form
        onSubmit={handleAdd}
        className="bg-card border rounded-2xl p-6 mb-6 shadow-sm"
      >
        <h3 className="font-semibold mb-4 text-foreground">Add Category</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
            />
          </div>

          <ImageUploader value={image} onChange={setImage} />
        </div>

        <Button type="submit" className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </form>

      {/* Category List */}
      <div className="grid md:grid-cols-3 gap-4">
        {items?.map((item) => (
          <div
            key={item._id}
            className="border rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{item.name}</p>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditItem(item)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setDeleteItem(item)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={editItem?.name || ""}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <ImageUploader
              value={editItem?.image}
              onChange={(img) =>
                setEditItem({
                  ...editItem,
                  image: img,
                })
              }
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
