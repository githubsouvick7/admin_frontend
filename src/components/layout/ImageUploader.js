import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

export default function ImageUploader({ value, onChange, label = "Image" }) {
  const [preview, setPreview] = useState(value || "");

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        {preview && (
          <img src={preview} alt="Preview" className="h-16 w-16 rounded-lg object-cover border" />
        )}
        <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-input cursor-pointer hover:bg-muted/50 transition-colors">
          <Upload className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Upload</span>
          <Input type="file" accept="image/*" onChange={handleChange} className="hidden" />
        </label>
      </div>
    </div>
  );
}
