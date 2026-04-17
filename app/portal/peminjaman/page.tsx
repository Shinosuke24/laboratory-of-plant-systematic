"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Leaf } from "lucide-react";

interface Peminjaman {
  id: string;
  email?: string;
  tahunMasuk?: number;
  nama?: string;
  nim?: string;
  institusi?: string;
  noWa?: string;
  dosenPembimbing?: string;
  persetujuanPembimbing?: string;
  judulPenelitian?: string;
  tujuanPenelitian?: string;
  fasilitasDigunakan?: string;
  waktuMulaiPenggunaan?: string;
  waktuSelesaiPengembalian?: string;
  dokumenPermohonanUrl?: string;
  returnDate: string | null;
  status: string;
  notes: string | null;
}

export default function PeminjamanPage() {
  const [items, setItems] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    tahunMasuk: "",
    nama: "",
    nim: "",
    institusi: "UGM_FAKULTAS_BIOLOGI",
    noWa: "",
    dosenPembimbing: "",
    persetujuanPembimbing: "BELUM",
    judulPenelitian: "",
    tujuanPenelitian: "",
    fasilitasDigunakan: "",
    waktuMulaiPenggunaan: "",
    waktuSelesaiPengembalian: "",
    dokumenPermohonanUrl: "",
  });

  useEffect(() => {
    fetchPeminjaman();
  }, []);

  const fetchPeminjaman = async () => {
    try {
      setErrorMessage(null);
      const response = await fetch("/api/peminjaman");
      const data = await response.json();

      if (!response.ok) {
        setItems([]);
        setErrorMessage(data?.error || "Failed to fetch borrowing data");
        return;
      }

      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching:", error);
      setItems([]);
      setErrorMessage("Failed to fetch borrowing data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMessage(null);

      let dokumenPermohonanUrl = formData.dokumenPermohonanUrl;

      if (selectedPdf) {
        setIsUploadingPdf(true);
        const uploadForm = new FormData();
        uploadForm.append("file", selectedPdf);

        const uploadResponse = await fetch("/api/upload/pdf", {
          method: "POST",
          body: uploadForm,
        });

        const uploadPayload = await uploadResponse.json();
        if (!uploadResponse.ok) {
          setErrorMessage(uploadPayload?.error || "Failed to upload PDF file");
          return;
        }

        dokumenPermohonanUrl = uploadPayload.url;
      }

      if (!dokumenPermohonanUrl) {
        setErrorMessage("A signed request document PDF is required");
        return;
      }

      const response = await fetch("/api/peminjaman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          dokumenPermohonanUrl,
        }),
      });

      const payload = await response.json();

      if (response.ok) {
        setFormData({
          email: "",
          tahunMasuk: "",
          nama: "",
          nim: "",
          institusi: "UGM_FAKULTAS_BIOLOGI",
          noWa: "",
          dosenPembimbing: "",
          persetujuanPembimbing: "BELUM",
          judulPenelitian: "",
          tujuanPenelitian: "",
          fasilitasDigunakan: "",
          waktuMulaiPenggunaan: "",
          waktuSelesaiPengembalian: "",
          dokumenPermohonanUrl: "",
        });
        setSelectedPdf(null);
        setShowForm(false);
        fetchPeminjaman();
      } else {
        setErrorMessage(payload?.error || "Failed to submit borrowing request");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      setErrorMessage("Failed to submit borrowing request");
    } finally {
      setIsUploadingPdf(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RETURNED":
        return "bg-green-100 text-green-800";
      case "APPROVED":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-green-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 flex-col items-center justify-between gap-2 py-2 sm:h-16 sm:flex-row sm:py-0">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-700 sm:h-6 sm:w-6" />
              <span className="hidden text-lg font-bold text-green-700 sm:inline">
                laboratory of plant systematic
              </span>
              <span className="text-sm font-bold text-green-700 sm:hidden">
                lab of plant systematic
              </span>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                Equipment Borrowing
              </h1>
              <p className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base">
                Request and track your equipment borrowing from the laboratory.
              </p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="w-full bg-green-700 hover:bg-green-800 sm:w-auto"
            >
              {showForm ? "Cancel" : "New Form"}
            </Button>
          </div>

          {/* Form */}
          {showForm && (
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle>Equipment Borrowing Form</CardTitle>
                <CardDescription>
                  Fill in the data below before submitting to admin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Email *
                      </label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="name@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Enrollment Year *
                      </label>
                      <Input
                        required
                        type="number"
                        min="1900"
                        value={formData.tahunMasuk}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tahunMasuk: e.target.value,
                          })
                        }
                        placeholder="example: 2022"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Full Name *
                      </label>
                      <Input
                        required
                        value={formData.nama}
                        onChange={(e) =>
                          setFormData({ ...formData, nama: e.target.value })
                        }
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        NIM *
                      </label>
                      <Input
                        required
                        value={formData.nim}
                        onChange={(e) =>
                          setFormData({ ...formData, nim: e.target.value })
                        }
                        placeholder="Student ID number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Institution *
                      </label>
                      <select
                        required
                        value={formData.institusi}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            institusi: e.target.value,
                          })
                        }
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      >
                        <option value="UGM_FAKULTAS_BIOLOGI">
                          UGM, Faculty of Biology
                        </option>
                        <option value="UGM_NON_FAKULTAS_BIOLOGI">
                          UGM, Non-Faculty of Biology
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        WhatsApp Number *
                      </label>
                      <Input
                        required
                        value={formData.noWa}
                        onChange={(e) =>
                          setFormData({ ...formData, noWa: e.target.value })
                        }
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Research Supervisor *
                      </label>
                      <Input
                        required
                        value={formData.dosenPembimbing}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dosenPembimbing: e.target.value,
                          })
                        }
                        placeholder="Supervisor name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Has this borrowing request been approved by the
                        supervisor? *
                      </label>
                      <select
                        required
                        value={formData.persetujuanPembimbing}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            persetujuanPembimbing: e.target.value,
                          })
                        }
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      >
                        <option value="TELAH_DISETUJUI">Approved</option>
                        <option value="BELUM">Not yet</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Research Title *
                    </label>
                    <Input
                      required
                      value={formData.judulPenelitian}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          judulPenelitian: e.target.value,
                        })
                      }
                      placeholder="Research title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Research Objective *
                    </label>
                    <Textarea
                      required
                      value={formData.tujuanPenelitian}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tujuanPenelitian: e.target.value,
                        })
                      }
                      placeholder="Explain the research objective"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Facilities/Equipment to be used *
                    </label>
                    <Textarea
                      required
                      value={formData.fasilitasDigunakan}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fasilitasDigunakan: e.target.value,
                        })
                      }
                      placeholder="Example: Microscope, digital scale, pH meter"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Equipment usage start time *
                      </label>
                      <Input
                        required
                        type="datetime-local"
                        value={formData.waktuMulaiPenggunaan}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            waktuMulaiPenggunaan: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Equipment return/end time *
                      </label>
                      <Input
                        required
                        type="datetime-local"
                        value={formData.waktuSelesaiPengembalian}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            waktuSelesaiPengembalian: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Upload signed request document (PDF) *
                    </label>
                    <Input
                      required
                      type="file"
                      accept="application/pdf"
                      onChange={(e) =>
                        setSelectedPdf(e.target.files?.[0] || null)
                      }
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      PDF files only, maximum size 5MB.
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      disabled={isUploadingPdf}
                      className="bg-green-700 hover:bg-green-800"
                    >
                      {isUploadingPdf
                        ? "Uploading PDF..."
                        : "Submit Borrowing Request"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Rentals List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Borrowing Request History
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
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No borrowing requests yet</p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-green-700 hover:bg-green-800"
                >
                  Create First Request
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {items.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.judulPenelitian || "Borrowing Request"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            NIM: {item.nim || "-"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Facilities: {item.fasilitasDigunakan || "-"}
                          </p>
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      {item.tujuanPenelitian && (
                        <p className="text-gray-600 mb-3 text-sm">
                          {item.tujuanPenelitian}
                        </p>
                      )}
                      <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 sm:grid-cols-2">
                        <div>
                          <span className="font-medium">Start:</span>{" "}
                          {item.waktuMulaiPenggunaan
                            ? new Date(
                                item.waktuMulaiPenggunaan,
                              ).toLocaleString()
                            : "-"}
                        </div>
                        <div>
                          <span className="font-medium">End:</span>{" "}
                          {item.waktuSelesaiPengembalian
                            ? new Date(
                                item.waktuSelesaiPengembalian,
                              ).toLocaleString()
                            : "-"}
                        </div>
                      </div>
                      {item.dokumenPermohonanUrl && (
                        <div className="mt-3 text-sm">
                          <a
                            href={item.dokumenPermohonanUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-700 hover:underline"
                          >
                            View request document
                          </a>
                        </div>
                      )}
                      {item.returnDate && (
                        <div className="mt-2 text-sm text-green-600">
                          <span className="font-medium">Returned:</span>{" "}
                          {new Date(item.returnDate).toLocaleDateString()}
                        </div>
                      )}
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
