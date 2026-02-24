"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "@/components/layout/ImageUploader";
import ConfirmDialog from "@/components/layout/ConfirmDialog";

export default function Models() {
  const [items, setItems] = useState();
  const [form, setForm] = useState({ brandId: "", name: "", modelNumber: "", image: "" });
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const refresh = () => setItems();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.brandId) return;
    setForm({ brandId: "", name: "", modelNumber: "", image: "" });
    refresh();
    toast.success("Model added");
  };

  const handleUpdate = () => {
    if (!editItem) return;
    setEditItem(null);
    refresh();
    toast.success("Model updated");
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    setDeleteItem(null);
    refresh();
    toast.success("Model deleted");
  };


  const columns = [
    { key: "brandId", label: "Brand", render: (val) => getBrandName(val) },
    { key: "name", label: "Model Name" },
    { key: "modelNumber", label: "Model Number" },
    { key: "image", label: "Image", render: (val) => val ? <img src={val} className="h-10 w-10 rounded object-cover" /> : "—" },
  ];

  return (
    <div>
      <form onSubmit={handleAdd} className="bg-card border rounded-2xl p-6 mb-6 shadow-sm">
        <h3 className="font-semibold mb-4 text-foreground">Add Model</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Brand</Label>
            <Select value={form.brandId} onValueChange={(v) => setForm({ ...form, brandId: v })}>
              <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Model Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Model name" />
          </div>
          <div className="space-y-2">
            <Label>Model Number</Label>
            <Input value={form.modelNumber} onChange={(e) => setForm({ ...form, modelNumber: e.target.value })} placeholder="Model number" />
          </div>
          <ImageUploader value={form.image} onChange={(img) => setForm({ ...form, image: img })} />
        </div>
        <Button type="submit" className="mt-4"><Plus className="h-4 w-4 mr-2" /> Add Model</Button>
      </form>

      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Model</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Brand</Label>
              <Select value={editItem?.brandId || ""} onValueChange={(v) => setEditItem({ ...editItem, brandId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent></SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Model Name</Label>
              <Input value={editItem?.name || ""} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Model Number</Label>
              <Input value={editItem?.modelNumber || ""} onChange={(e) => setEditItem({ ...editItem, modelNumber: e.target.value })} />
            </div>
            <ImageUploader value={editItem?.image} onChange={(img) => setEditItem({ ...editItem, image: img })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
            <Button onClick={handleUpdate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} />
    </div>
  );
}
