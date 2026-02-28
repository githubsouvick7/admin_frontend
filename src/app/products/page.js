"use client";

import { useState, useEffect, useMemo } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "@/components/layout/ImageUploader";
import ConfirmDialog from "@/components/layout/ConfirmDialog";
import { fetcher } from "@/lib/fetcher";
import { MultiSelect } from "@/components/ui/multiselectDropdown";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    brandIds: [],
    modelIds: [],
    categoryId: "",
    name: "",
    amount: "",
    description: "",
    image: "",
  });

  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [productRes, modelRes, brandRes, categoryRes] = await Promise.all(
          [
            fetcher("/api/product/getProducts"),
            fetcher("/api/model/getModels"),
            fetcher("/api/brand/getBrands"),
            fetcher("/api/category/getCategories"),
          ],
        );

        setProducts(productRes.data);
        setModels(modelRes.data);
        setBrands(brandRes.data);
        setCategories(categoryRes.data);
      } catch {
        toast.error("Failed to fetch data");
      }
    };

    fetchInitialData();
  }, []);

  const refreshProducts = async () => {
    const res = await fetcher("/api/product/getProducts");
    setProducts(res.data);
  };

  /* ================= FILTER MODELS ================= */

  const filteredModels = models.filter((m) =>
    form.brandIds.includes(m.brand_id?._id),
  );

  /* ================= ADD PRODUCT ================= */

  const handleAdd = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.brandIds.length ||
      !form.modelIds.length ||
      !form.categoryId
    ) {
      toast.error("All required fields must be filled");
      return;
    }

    try {
      await fetcher("/api/product/createProduct", "post", {
        brand_ids: form.brandIds,
        model_ids: form.modelIds,
        category_id: form.categoryId,
        product_name: form.name,
        product_image: form.image,
        amount: Number(form.amount),
        description: form.description,
      });

      toast.success("Product added");

      setForm({
        brandIds: [],
        modelIds: [],
        categoryId: "",
        name: "",
        amount: "",
        description: "",
        image: "",
      });

      refreshProducts();
    } catch {
      toast.error("Failed to add product");
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    if (!deleteItem) return;

    await fetcher(`/api/product/deleteProduct/${deleteItem._id}`, "delete");

    toast.success("Product deleted");
    setDeleteItem(null);
    refreshProducts();
  };

  /* ================= FILTER PRODUCTS ================= */

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.product_name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  /* ================= UI ================= */

  return (
    <div>
      {/* ================= ADD FORM ================= */}

      <form
        onSubmit={handleAdd}
        className="bg-card border rounded-2xl p-6 mb-6 shadow-sm"
      >
        <h3 className="font-semibold mb-4">Add Product</h3>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Brand Multi Select */}
          <div className="space-y-2">
            <Label>Brand</Label>
            <MultiSelect
              options={brands}
              value={form.brandIds}
              onChange={(val) =>
                setForm({ ...form, brandIds: val, modelIds: [] })
              }
              placeholder="Select Brand"
              valueKey="_id"
              labelKey="brand_name"
            />
          </div>

          {/* Model Multi Select */}
          <div className="space-y-2">
            <Label>Model</Label>
            <MultiSelect
              options={filteredModels}
              value={form.modelIds}
              onChange={(val) => setForm({ ...form, modelIds: val })}
              placeholder="Select Model"
              valueKey="_id"
              labelKey="model_name"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={form.categoryId}
              onValueChange={(val) => setForm({ ...form, categoryId: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Amount */}
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
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <Button type="submit" className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </form>

      {/* ================= SEARCH ================= */}

      <div className="mb-4">
        <Input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ================= TABLE ================= */}

      <div className="border rounded-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredProducts.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.product_name}</TableCell>
                <TableCell>{item.brand_id?.brand_name}</TableCell>
                <TableCell>{item.model_id?.model_name}</TableCell>
                <TableCell>{item.category_id?.category_name}</TableCell>
                <TableCell>₹ {item.amount}</TableCell>
                <TableCell className="text-right flex items-center justify-end space-x-2">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
