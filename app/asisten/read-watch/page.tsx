"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  Leaf,
  Edit2,
  Trash2,
  Sparkles,
  LibraryBig,
  Image as ImageIcon,
} from "lucide-react";

interface ReadWatch {
  id: string;
  title: string;
  description: string | null;
  category: string;
  content: string | null;
  fileUrl: string | null;
  imageUrl: string | null;
}

const CATEGORIES = ["Tutorial", "Guide", "Research", "Video", "Article"];

const CATEGORY_LABELS: Record<string, string> = {
  Tutorial: "Tutorial",
  Guide: "Guide",
  Research: "Research",
  Video: "Video",
  Article: "Article",
};

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const ALLOWED_IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

export default function AsisteReadWatchPage() {
  const [items, setItems] = useState<ReadWatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploadingAssets, setIsUploadingAssets] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isImageDragOver, setIsImageDragOver] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Tutorial",
    content: "",
    fileUrl: "",
    imageUrl: "",
  });

  const totalResources = items.length;
  const categoryCount = new Set(items.map((item) => item.category)).size;
  const imageResources = items.filter((item) => item.imageUrl).length;

  useEffect(() => {
    fetchItems();
  }, []);

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const fetchItems = async () => {
    try {
      setErrorMessage(null);
      const response = await fetch("/api/read-watch", { cache: "no-store" });

      if (!response.ok) {
        const error = await response.json();
        setErrorMessage(error?.error || "Failed to load learning resources");
        setItems([]);
        return;
      }

      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching:", error);
      setErrorMessage("Failed to load learning resources");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelection = (file: File | null) => {
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    const hasValidType = ALLOWED_IMAGE_TYPES.has(file.type);
    const hasValidExtension = ALLOWED_IMAGE_EXTENSIONS.has(extension);

    if (!hasValidType && !hasValidExtension) {
      setSelectedImage(null);
      setErrorMessage("Unsupported image format. Use JPG, PNG, WEBP, or GIF");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setSelectedImage(null);
      setErrorMessage("Maximum image size is 4 MB");
      return;
    }

    setErrorMessage(null);
    setSelectedImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMessage(null);
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `/api/read-watch/${editingId}`
        : "/api/read-watch";

      let imageUrl = formData.imageUrl;
      let fileUrl = formData.fileUrl;

      if (selectedImage) {
        setIsUploadingAssets(true);
      }

      if (selectedImage) {
        const uploadForm = new FormData();
        uploadForm.append("file", selectedImage);

        const uploadResponse = await fetch("/api/upload/image", {
          method: "POST",
          body: uploadForm,
        });

        const uploadPayload = await uploadResponse.json();
        if (!uploadResponse.ok) {
          setErrorMessage(uploadPayload?.error || "Failed to upload image");
          return;
        }

        imageUrl = uploadPayload.url;
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imageUrl,
          fileUrl,
        }),
      });

      if (response.ok) {
        setErrorMessage(null);
        setFormData({
          title: "",
          description: "",
          category: "Tutorial",
          content: "",
          fileUrl: "",
          imageUrl: "",
        });
        setSelectedImage(null);
        setShowForm(false);
        setEditingId(null);
        fetchItems();
      } else {
        const error = await response.json();
        setErrorMessage(error?.error || "Failed to save learning resource");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      setErrorMessage("Failed to save learning resource");
    } finally {
      setIsUploadingAssets(false);
    }
  };

  const handleEdit = (item: ReadWatch) => {
    setFormData({
      title: item.title,
      description: item.description || "",
      category: item.category,
      content: item.content || "",
      fileUrl: item.fileUrl || "",
      imageUrl: item.imageUrl || "",
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this learning resource?"))
      return;

    try {
      const response = await fetch(`/api/read-watch/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setErrorMessage(null);
        fetchItems();
      } else {
        const error = await response.json();
        setErrorMessage(error?.error || "Failed to delete learning resource");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      setErrorMessage("Failed to delete learning resource");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ecfdf3_0%,_#f8fafc_45%,_#ffffff_100%)]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-green-200/70 bg-white/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 flex-col gap-3 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-700 sm:h-6 sm:w-6" />
              <span className="hidden text-xl font-bold text-green-700 sm:inline">
                laboratory of plant systematic
              </span>
              <span className="text-sm font-bold text-green-700 sm:hidden">
                lab of plant systematic
              </span>
            </Link>
            <Link href="/dashboard" className="self-start sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                className="border-green-300/80 bg-white/80"
              >
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="rounded-2xl border border-green-200/80 bg-white/85 p-6 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Assistant Workspace
                </p>
                <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                  Manage Read and Watch
                </h1>
                <p className="mt-2 text-gray-600">
                  Curate learning resources for students and researchers in one
                  streamlined panel.
                </p>
                <p className="mt-1 text-sm text-green-700">
                  Every change here is reflected automatically on the public
                  Read and Watch page.
                </p>
              </div>

              <Button
                onClick={() => {
                  setFormData({
                    title: "",
                    description: "",
                    category: "Tutorial",
                    content: "",
                    fileUrl: "",
                    imageUrl: "",
                  });
                  setSelectedImage(null);
                  setEditingId(null);
                  setShowForm(!showForm);
                }}
                className="w-full bg-green-700 px-5 hover:bg-green-800 sm:w-auto"
              >
                {showForm ? "Cancel" : "Add Resource"}
              </Button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Card className="border-green-200/80 bg-white/90">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Total Resources
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {totalResources}
                    </p>
                  </div>
                  <LibraryBig className="h-5 w-5 text-green-700" />
                </CardContent>
              </Card>

              <Card className="border-green-200/80 bg-white/90">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Categories
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {categoryCount}
                    </p>
                  </div>
                  <Leaf className="h-5 w-5 text-green-700" />
                </CardContent>
              </Card>

              <Card className="border-green-200/80 bg-white/90">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      With Image
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {imageResources}
                    </p>
                  </div>
                  <ImageIcon className="h-5 w-5 text-green-700" />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form */}
          {showForm && (
            <Card className="border-green-200/90 bg-white/95 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">
                  {editingId ? "Edit Resource" : "Add New Resource"}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {editingId
                    ? "Update resource details"
                    : "Add a new learning resource"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Title *
                    </label>
                    <Input
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Learning resource title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Category *
                    </label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {CATEGORY_LABELS[cat] || cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Description (Optional)
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Short resource description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Content (Optional)
                    </label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      placeholder="Main resource content"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">
                      Upload Image (Optional)
                    </label>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="hidden"
                      onChange={(e) => {
                        handleImageSelection(e.target.files?.[0] || null);
                        e.currentTarget.value = "";
                      }}
                    />
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => imageInputRef.current?.click()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          imageInputRef.current?.click();
                        }
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsImageDragOver(true);
                      }}
                      onDragLeave={() => setIsImageDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsImageDragOver(false);
                        const droppedFile =
                          e.dataTransfer.items?.[0]?.kind === "file"
                            ? e.dataTransfer.items[0].getAsFile()
                            : e.dataTransfer.files?.[0] || null;
                        handleImageSelection(droppedFile);
                      }}
                      className={`cursor-pointer rounded-lg border border-dashed p-4 text-sm transition ${
                        isImageDragOver
                          ? "border-green-600 bg-green-50"
                          : "border-green-200 bg-green-50/40 hover:bg-green-50"
                      }`}
                    >
                      <p className="font-medium text-gray-800">
                        Drag and drop image here, or tap to choose
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, PNG, WEBP, GIF up to 4MB
                      </p>
                      {selectedImage && (
                        <p className="mt-2 text-xs text-green-700">
                          Selected: {selectedImage.name} (
                          {formatFileSize(selectedImage.size)})
                        </p>
                      )}
                    </div>
                    {formData.imageUrl && !selectedImage && (
                      <p className="mt-1 text-xs text-gray-500">
                        Current image is set. Drop or choose a new image to
                        replace it.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 pt-4 sm:flex-row">
                    <Button
                      type="submit"
                      disabled={isUploadingAssets}
                      className="bg-green-700 hover:bg-green-800"
                    >
                      {isUploadingAssets
                        ? "Uploading..."
                        : `${editingId ? "Update" : "Create"} Resource`}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                        setSelectedImage(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Resources List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Learning Resource List
            </h2>
            {errorMessage && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}
            {loading ? (
              <div className="text-center py-12 text-gray-600">
                Loading data...
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-green-300 bg-white/80 py-12 text-center">
                <p className="text-gray-600 mb-4">No learning resources yet</p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-green-700 hover:bg-green-800"
                >
                  Create Your First Resource
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className="border-green-200/80 bg-white/90 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.title}
                          </h3>
                          <p className="mb-2 inline-flex rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                            {item.category}
                          </p>
                          {item.description && (
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            {item.imageUrl && (
                              <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">
                                Has image
                              </span>
                            )}
                            {item.content && (
                              <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">
                                Has content
                              </span>
                            )}
                            {item.fileUrl && (
                              <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">
                                Has attachment
                              </span>
                            )}
                          </div>

                          {item.imageUrl && (
                            <div className="mt-4 max-w-sm overflow-hidden rounded-lg border border-green-100 bg-gray-50">
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="aspect-[4/3] w-full object-cover object-center"
                                loading="lazy"
                              />
                            </div>
                          )}

                          {item.fileUrl && (
                            <div className="mt-3 text-sm">
                              <a
                                href={item.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-700 hover:underline"
                              >
                                Open attachment
                              </a>
                            </div>
                          )}
                        </div>
                        <div className="flex self-end gap-2 sm:self-start">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="text-green-700 hover:bg-green-50"
                            aria-label={`Edit ${item.title}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-700 hover:bg-red-50"
                            aria-label={`Delete ${item.title}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
