"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "@/components/layout/ImageUploader";
import ConfirmDialog from "@/components/layout/ConfirmDialog";
import { fetcher } from "@/lib/fetcher";

const BASE_URL = "http://localhost:5000/api/product"; // change if needed

export default function Products() {
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    brandId: "",
    modelId: "",
    categoryId: "",
    name: "",
    amount: "",
    description: "",
    image: "",
  });

  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const refresh = async () => {
    try {
      const res = await fetcher(`/api/product/getProducts`);
      setItems(res.data);
    } catch (err) {
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      const res = await fetcher("/api/product/createProduct", "post", {
        brand_id: form.brandId,
        model_id: form.modelId,
        category_id: form.categoryId,
        product_name: form.name,
        product_image: form.image,
        amount: Number(form.amount),
        description: form.description,
      });
      if (!res.ok) throw new Error();

      toast.success("Product added");

      setForm({
        brandId: "",
        modelId: "",
        categoryId: "",
        name: "",
        amount: "",
        description: "",
        image: "",
      });

      refresh();
    } catch (err) {
      toast.error("Failed to add product");
    }
  };

  const handleUpdate = async () => {
    if (!editItem) return;

    try {
      const res = await fetcher(
        `/api/product/updateProduct/${editItem._id}`,
        "put",
        {
          brand_id: editItem.brand_id,
          model_id: editItem.model_id,
          category_id: editItem.category_id,
          product_name: editItem.product_name,
          product_image: editItem.product_image,
          amount: Number(editItem.amount),
          description: editItem.description,
        },
      );

      toast.success("Product updated");
      setEditItem(null);
      refresh();
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      const res = await fetcher(
        `/api/product/deleteProduct/${deleteItem._id}`,
        "delete",
      );

      if (!res.ok) throw new Error();
      toast.success("Product deleted");
      setDeleteItem(null);
      refresh();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleAdd}
        className="bg-card border rounded-2xl p-6 mb-6 shadow-sm"
      >
        <h3 className="font-semibold mb-4 text-foreground">Add Product</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>

          <ImageUploader
            value={form.image}
            onChange={(img) => setForm({ ...form, image: img })}
          />
        </div>

        <div className="mt-4 space-y-2">
          <Label>Description</Label>
          <Textarea
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />
        </div>

        <Button type="submit" className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </form>

      <div className="grid md:grid-cols-3 gap-4">
        {items?.map((item) => (
          <div
            key={item._id}
            className="border rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{item.product_name}</p>
              <p className="text-sm text-muted-foreground">₹ {item.amount}</p>
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

      {/* ✅ Edit Product Dialog */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Product Name */}
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input
                value={editItem?.product_name || ""}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    product_name: e.target.value,
                  })
                }
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                value={editItem?.amount || ""}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    amount: e.target.value,
                  })
                }
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={editItem?.description || ""}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    description: e.target.value,
                  })
                }
              />
            </div>

            {/* Image */}
            <ImageUploader
              value={editItem?.product_image}
              onChange={(img) =>
                setEditItem({
                  ...editItem,
                  product_image: img,
                })
              }
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>
              Cancel
            </Button>

            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
