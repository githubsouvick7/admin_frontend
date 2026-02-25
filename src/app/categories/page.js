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
import { Edit, Plus, Trash } from "lucide-react";
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
        category_name: name,
        image: image,
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
      category_name: editItem.name,
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

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left">
              <th className="px-4 py-3 w-40">SL No.</th>
              <th className="px-4 py-3">Category Name</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items?.map((item, index) => (
              <tr
                key={item._id}
                className="border-t hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-3 font-medium w-40">{index + 1}</td>

                <td className="px-4 py-3">{item.category_name}</td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      className="cursor-pointer p-1 px-2 text-xs rounded-sm flex items-center gap-1 border"
                      size="xs"
                      variant="outline"
                      onClick={() => setEditItem(item)}
                    >
                      Edit <Edit className="h-3 w-3 ml-1" />
                    </button>

                    <button
                      className="cursor-pointer p-1 px-2 text-xs rounded-sm flex items-center gap-1 border border-red-500 text-red-500"
                      size="xs"
                      variant="destructive"
                      onClick={() => setDeleteItem(item)}
                    >
                      Delete <Trash className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
