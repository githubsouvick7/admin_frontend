"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "@/components/layout/ImageUploader";
import ConfirmDialog from "@/components/layout/ConfirmDialog";

export default function Brands() {
  const [items, setItems] = useState();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const refresh = () => setItems();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setName(""); setImage("");
    refresh();
    toast.success("Brand added");
  };

  const handleUpdate = () => {
    if (!editItem) return;
    setEditItem(null);
    refresh();
    toast.success("Brand updated");
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    brandService.remove(deleteItem.id);
    setDeleteItem(null);
    refresh();
    toast.success("Brand deleted");
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "image", label: "Image", render: (val) => val ? <img src={val} className="h-10 w-10 rounded object-cover" /> : "—" },
    { key: "createdAt", label: "Created", render: (val) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div>
      <form onSubmit={handleAdd} className="bg-card border rounded-2xl p-6 mb-6 shadow-sm">
        <h3 className="font-semibold mb-4 text-foreground">Add Brand</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Brand name" />
          </div>
          <ImageUploader value={image} onChange={setImage} />
        </div>
        <Button type="submit" className="mt-4"><Plus className="h-4 w-4 mr-2" /> Add Brand</Button>
      </form>

      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Brand</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={editItem?.name || ""} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} />
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
