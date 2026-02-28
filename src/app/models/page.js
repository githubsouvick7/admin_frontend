"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Edit, Pencil, Plus, Trash, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "@/components/layout/ImageUploader";
import ConfirmDialog from "@/components/layout/ConfirmDialog";
import { fetcher } from "@/lib/fetcher";

export default function Models() {
  const [items, setItems] = useState([]);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    brand_id: "",
    name: "",
    model_name: "",
    image: "",
  });

  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  // ================= FETCH =================

  const fetchData = async () => {
    try {
      const [modelRes, brandRes] = await Promise.all([
        fetcher("/api/model/getModels"),
        fetcher("/api/brand/getBrands"),
      ]);

      setItems(modelRes.data);
      setBrands(brandRes.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  console.log(items);
  // ================= HELPERS =================

  const getBrandName = (id) =>
    brands.find((b) => b._id === id)?.brand_name || "—";

  const filteredItems = items.filter((item) =>
    item.model_name?.toLowerCase().includes(search.toLowerCase()),
  );

  // ================= ADD =================

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.model_name.trim() || !form.brand_id) return;

    try {
      const res = await fetcher("/api/model/createModel", "POST", form);

      setItems((prev) => [res.data, ...prev]);
      setForm({
        brand_id: "",
        model_name: "",
        model_name: "",
        image: "",
      });
      fetchData();

      toast.success("Model added");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ================= UPDATE =================

  const handleUpdate = async () => {
    try {
      const res = await fetcher(
        `/api/model/updateModel/${editItem._id}`,
        "PUT",
        editItem,
      );

      setItems((prev) =>
        prev.map((item) => (item._id === editItem._id ? res.data : item)),
      );

      setEditItem(null);
      toast.success("Model updated");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ================= DELETE =================

  const handleDelete = async () => {
    try {
      await fetcher(`/api/model/deleteModel/${deleteItem._id}`, "DELETE");

      setItems((prev) => prev.filter((item) => item._id !== deleteItem._id));

      setDeleteItem(null);
      toast.success("Model deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= ADD MODEL ================= */}
      <form
        onSubmit={handleAdd}
        className="bg-card border rounded-2xl p-6 shadow-sm"
      >
        <h3 className="font-semibold mb-4">Add Model</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Brand</Label>
            <Select
              value={form.brand_id}
              onValueChange={(v) => setForm({ ...form, brand_id: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand._id} value={brand._id}>
                    {brand.brand_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Model Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Model name"
            />
          </div>

          <div className="space-y-2">
            <Label>Model Number</Label>
            <Input
              value={form.model_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  model_name: e.target.value,
                })
              }
              placeholder="Model number"
            />
          </div>

          <ImageUploader
            value={form.image}
            onChange={(img) => setForm({ ...form, image: img })}
          />
        </div>

        <Button type="submit" className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Model
        </Button>
      </form>

      {/* ================= MODEL LIST ================= */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold mb-4">Model List</h3>

        <div className="mb-4">
          <Input
            placeholder="Search by model name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2">SL</th>
              <th className="border p-2">Brand</th>
              <th className="border p-2">Model Name</th>
              <th className="border p-2">Model Number</th>
              <th className="border p-2">Image</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <tr key={item._id}>
                  <td className=" p-2">{index + 1}</td>

                  <td className=" p-2">{item.brand_id?.brand_name || "—"}</td>

                  <td className=" p-2 font-semibold">{item.model_name}</td>

                  <td className=" p-2"></td>
                  <td className=" p-2">
                    {item.model_image ? (
                      <img
                        src={item.model_image}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className=" p-2">
                    <div className="flex justify-center gap-3">
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
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="border p-4 text-center">
                  No models found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Model</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              value={editItem?.name || ""}
              onChange={(e) =>
                setEditItem({
                  ...editItem,
                  name: e.target.value,
                })
              }
            />
            <Input
              value={editItem?.model_name || ""}
              onChange={(e) =>
                setEditItem({
                  ...editItem,
                  model_name: e.target.value,
                })
              }
            />
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

      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
