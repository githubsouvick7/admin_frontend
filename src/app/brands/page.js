"use client";
import { useEffect, useState } from "react";
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
import ImageUploader from "@/components/layout/ImageUploader";
import ConfirmDialog from "@/components/layout/ConfirmDialog";
import { fetcher } from "@/lib/fetcher";

export default function Brands() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // =============================
  // FETCH ALL BRANDS
  // =============================
  const fetchBrands = async () => {
    try {
      const res = await fetcher(`/api/brand/getBrands`);

      if (!res.ok) throw new Error(res.data.message);

      setItems(res.data);
    } catch (err) {
      toast.error(err.message || "Failed to fetch brands");
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetcher(`/api/brand/createBrand`, "POST", {
        name,
        image,
      });

      if (!res.ok) throw new Error(res.data.message);

      toast.success("Brand added");
      setName("");
      setImage("");
      fetchBrands();
    } catch (err) {
      toast.error(err.message || "Failed to add brand");
    }
  };

  // =============================
  // UPDATE BRAND
  // =============================
  const handleUpdate = async () => {
    if (!editItem) return;

    try {
      const res = await fetcher(
        `/api/brand/updateBrand/${editItem._id}`,
        "PUT",
        {
          name: editItem.name,
          image: editItem.image,
        },
      );

      if (!res.ok) throw new Error(res.data.message);

      toast.success("Brand updated");
      setEditItem(null);
      fetchBrands();
    } catch (err) {
      toast.error(err.message || "Failed to update brand");
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      const res = await fetcher(
        `/api/brand/deleteBrand/${deleteItem._id}`,
        "DELETE",
      );

      if (!res.ok) throw new Error(res.data.message);

      toast.success("Brand deleted");
      setDeleteItem(null);
      fetchBrands();
    } catch (err) {
      toast.error(err.message || "Failed to delete brand");
    }
  };

  return (
    <div>
      {/* ================= ADD BRAND ================= */}
      <form
        onSubmit={handleAdd}
        className="bg-card border rounded-2xl p-6 mb-6 shadow-sm"
      >
        <h3 className="font-semibold mb-4 text-foreground">Add Brand</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Brand name"
            />
          </div>

          <ImageUploader value={image} onChange={setImage} />
        </div>

        <Button type="submit" className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Brand
        </Button>
      </form>

      {/* ================= EDIT DIALOG ================= */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={editItem?.name || ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, name: e.target.value })
                }
              />
            </div>

            <ImageUploader
              value={editItem?.image}
              onChange={(img) => setEditItem({ ...editItem, image: img })}
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

      {/* ================= DELETE CONFIRM ================= */}
      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
