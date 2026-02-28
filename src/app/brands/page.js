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
import { Edit, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "@/components/layout/ImageUploader";
import ConfirmDialog from "@/components/layout/ConfirmDialog";
import { fetcher } from "@/lib/fetcher";

export default function Brands() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [brandName, setBrandName] = useState("");
  const [image, setImage] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  // ================= FETCH =================
  const fetchBrands = async () => {
    try {
      const res = await fetcher("/api/brand/getBrands");
      setItems(res.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // ================= SEARCH FILTER =================
  const filteredItems = items.filter((item) =>
    item.brand_name?.toLowerCase().includes(search.toLowerCase()),
  );

  // ================= ADD =================
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!brandName.trim()) return;

    try {
      const res = await fetcher("/api/brand/createBrand", "POST", {
        brand_name: brandName,
        image,
      });

      setItems((prev) => [res.data, ...prev]);
      setBrandName("");
      setImage("");
      toast.success("Brand added");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      const res = await fetcher(
        `/api/brand/updateBrand/${editItem._id}`,
        "PUT",
        editItem,
      );

      setItems((prev) =>
        prev.map((item) => (item._id === editItem._id ? res.data : item)),
      );

      setEditItem(null);
      toast.success("Brand updated");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    try {
      await fetcher(`/api/brand/deleteBrand/${deleteItem._id}`, "DELETE");

      setItems((prev) => prev.filter((item) => item._id !== deleteItem._id));

      setDeleteItem(null);
      toast.success("Brand deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= ADD BRAND ================= */}
      <form
        onSubmit={handleAdd}
        className="bg-card border rounded-2xl p-6 shadow-sm"
      >
        <h3 className="font-semibold mb-4">Add Brand</h3>

        <div className="flex items-center gap-4">
          <div className="space-y-2 w-80">
            <Label>Brand Name</Label>
            <Input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Brand name"
            />
          </div>

          <ImageUploader value={image} onChange={setImage} />
          <Button type="submit" className="mt-4">
            Submit
          </Button>
          <Button
          variant="destructive"
            type="button"
            className="mt-4"
            onClick={() => {
              setBrandName("");
              setImage("");
            }}
          >
            Cancel
          </Button>
        </div>
      </form>

      {/* ================= BRAND LIST ================= */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold mb-4">Brand List</h3>

        {/* Search */}
        <div className="mb-4">
          <Input
            placeholder="Search by brand name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left">SL</th>
              <th className="border p-2 text-left">Brand Name</th>
              <th className="border p-2 text-left">Image</th>
              <th className="border p-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <tr key={item._id} className="border-b">
                  <td className=" p-2">{index + 1}</td>

                  <td className=" p-2 font-semibold">{item.brand_name}</td>

                  <td className=" p-2">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.brand_name}
                        className="h-10 w-10 object-contain"
                      />
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="flex justify-end items-center p-2 text-end space-x-2">
                    <button
                      className="p-2 text-sm border flex gap-2 items-center justify-end rounded-full bg-black text-white"
                      onClick={() => setEditItem(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      className="p-2 text-sm border flex gap-2 items-center justify-end rounded-full bg-red-500 text-white"
                      onClick={() => setDeleteItem(item)}
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="border p-4 text-center">
                  No matching brands found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= EDIT DIALOG ================= */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              value={editItem?.brand_name || ""}
              onChange={(e) =>
                setEditItem({
                  ...editItem,
                  brand_name: e.target.value,
                })
              }
            />

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
