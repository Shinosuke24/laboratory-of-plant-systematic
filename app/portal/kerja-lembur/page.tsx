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

interface KerjaLembur {
  id: string;
  email?: string;
  nama?: string;
  nim?: string;
  namaInstitusi?: string;
  noWa?: string;
  namaDosenPembimbing?: string;
  jadwalPelaksanaanLembur?: string;
  suratPermohonanUrl?: string;
  status: string;
  createdAt: string;
}

export default function KerjaLemburPage() {
  const [items, setItems] = useState<KerjaLembur[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    nama: "",
    nim: "",
    namaInstitusi: "",
    noWa: "",
    namaDosenPembimbing: "",
    jadwalPelaksanaanLembur: "",
    suratPermohonanUrl: "",
  });

  useEffect(() => {
    fetchKerjaLembur();
  }, []);

  const fetchKerjaLembur = async () => {
    try {
      setErrorMessage(null);
      const response = await fetch("/api/kerja-lembur");
      const data = await response.json();

      if (!response.ok) {
        setItems([]);
        setErrorMessage(data?.error || "Failed to fetch overtime data");
        return;
      }

      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching:", error);
      setItems([]);
      setErrorMessage("Failed to fetch overtime data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMessage(null);

      let suratPermohonanUrl = formData.suratPermohonanUrl;

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

        suratPermohonanUrl = uploadPayload.url;
      }

      if (!suratPermohonanUrl) {
        setErrorMessage("A request letter PDF is required");
        return;
      }

      const response = await fetch("/api/kerja-lembur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          suratPermohonanUrl,
        }),
      });

      const payload = await response.json();

      if (response.ok) {
        setFormData({
          email: "",
          nama: "",
          nim: "",
          namaInstitusi: "",
          noWa: "",
          namaDosenPembimbing: "",
          jadwalPelaksanaanLembur: "",
          suratPermohonanUrl: "",
        });
        setSelectedPdf(null);
        setShowForm(false);
        fetchKerjaLembur();
      } else {
        setErrorMessage(payload?.error || "Failed to submit overtime request");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      setErrorMessage("Failed to submit overtime request");
    } finally {
      setIsUploadingPdf(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalSubmissions = items.length;
  const approvedSubmissions = items.filter(
    (item) => item.status === "APPROVED",
  ).length;
  const pendingSubmissions = items.filter(
    (item) => item.status === "PENDING",
  ).length;

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
                Overtime Request Form
              </h1>
              <p className="text-gray-600 mt-2">
                Complete the overtime form based on requirements
              </p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="w-full bg-green-700 hover:bg-green-800 sm:w-auto"
            >
              {showForm ? "Cancel" : "New Form"}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600 mb-1">
                  Total Submissions
                </div>
                <div className="text-3xl font-bold text-green-700">
                  {totalSubmissions}
                </div>
              </CardContent>
            </Card>
            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600 mb-1">Approved</div>
                <div className="text-3xl font-bold text-green-700">
                  {approvedSubmissions}
                </div>
              </CardContent>
            </Card>
            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600 mb-1">Pending</div>
                <div className="text-3xl font-bold text-yellow-600">
                  {pendingSubmissions}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          {showForm && (
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle>Overtime Request Form</CardTitle>
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
                        Institution Name *
                      </label>
                      <Input
                        required
                        value={formData.namaInstitusi}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            namaInstitusi: e.target.value,
                          })
                        }
                        placeholder="Example: UGM, Faculty of Biology"
                      />
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
                        Research Supervisor Name *
                      </label>
                      <Input
                        required
                        value={formData.namaDosenPembimbing}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            namaDosenPembimbing: e.target.value,
                          })
                        }
                        placeholder="Supervisor name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Overtime Schedule (day and date) *
                    </label>
                    <Textarea
                      required
                      value={formData.jadwalPelaksanaanLembur}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jadwalPelaksanaanLembur: e.target.value,
                        })
                      }
                      placeholder="Example: Friday, May 16, 2026"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Upload Request Letter (signed by supervisor) *
                    </label>
                    <Input
                      required
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setSelectedPdf(file);
                      }}
                    />
                    {selectedPdf && (
                      <p className="text-xs text-gray-600 mt-1">
                        Selected file: {selectedPdf.name}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 pt-4 sm:flex-row">
                    <Button
                      type="submit"
                      className="bg-green-700 hover:bg-green-800"
                      disabled={isUploadingPdf}
                    >
                      {isUploadingPdf ? "Uploading PDF..." : "Submit"}
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

          {/* Records List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Overtime Submission History
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
                <p className="text-gray-600 mb-4">
                  No overtime submissions yet
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-green-700 hover:bg-green-800"
                >
                  Create First Submission
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {items.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition">
                    <CardContent className="pt-6">
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.nama || "Overtime Submission"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            NIM: {item.nim || "-"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Schedule: {item.jadwalPelaksanaanLembur || "-"}
                          </p>
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      {item.suratPermohonanUrl && (
                        <p className="text-sm mb-3">
                          <a
                            href={item.suratPermohonanUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-700 hover:underline"
                          >
                            View request letter (PDF)
                          </a>
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Submitted:{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
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
