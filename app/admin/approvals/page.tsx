"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Leaf, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ServiceType =
  | "identifikasi"
  | "penelitian"
  | "peminjaman"
  | "kerja-lembur";

type ApprovalItem = {
  id: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  userId?: string;
  user?: { name?: string | null; email?: string | null };
  email?: string;
  nim?: string;
  namaInstitusi?: string;
  institusi?: string;
  noWa?: string;
  namaDosenPembimbing?: string;
  dosenPembimbing?: string;
  tahunMasuk?: number;
  persetujuanPembimbing?: string;
  plantName?: string;
  scientificName?: string;
  description?: string;
  imageUrl?: string;
  suratPermohonanUrl?: string;
  namaKode?: string;
  familyKelompok?: string;
  title?: string;
  nama?: string;
  jadwalPelaksanaan?: string;
  jadwalPelaksanaanLembur?: string;
  startDate?: string;
  endDate?: string;
  returnDate?: string;
  borrowDate?: string;
  expectedReturn?: string;
  toolName?: string;
  quantity?: number;
  judulPenelitian?: string;
  tujuanPenelitian?: string;
  fasilitasDigunakan?: string;
  waktuMulaiPenggunaan?: string;
  waktuSelesaiPengembalian?: string;
  dokumenPermohonanUrl?: string;
  documentUrl?: string;
  notes?: string;
  date?: string;
  hours?: number;
};

const serviceLabels: Record<ServiceType, string> = {
  identifikasi: "Plant Identification",
  penelitian: "Research Project",
  peminjaman: "Equipment Borrowing",
  "kerja-lembur": "Overtime Records",
};

type DetailModalState = {
  open: boolean;
  service: ServiceType | null;
  item: ApprovalItem | null;
};

function SubmissionDetailModal({
  isOpen,
  service,
  item,
  onClose,
  onApprove,
  onReject,
  isLoading,
}: {
  isOpen: boolean;
  service: ServiceType | null;
  item: ApprovalItem | null;
  onClose: () => void;
  onApprove: (service: ServiceType, id: string) => Promise<void>;
  onReject: (service: ServiceType, id: string) => Promise<void>;
  isLoading: boolean;
}) {
  if (!isOpen || !service || !item) return null;

  const commonFields: { label: string; key: keyof ApprovalItem }[] = [
    { label: "Name", key: "nama" },
    { label: "Email", key: "email" },
    { label: "NIM", key: "nim" },
    { label: "Institution", key: "namaInstitusi" },
    { label: "Institution (Legacy)", key: "institusi" },
    { label: "WhatsApp Number", key: "noWa" },
    { label: "Academic Supervisor", key: "namaDosenPembimbing" },
    { label: "Academic Supervisor (Legacy)", key: "dosenPembimbing" },
  ];

  const fieldsByService: Record<
    ServiceType,
    { label: string; key: keyof ApprovalItem }[]
  > = {
    identifikasi: [
      ...commonFields,
      { label: "Plant Code/Name", key: "namaKode" },
      { label: "Plant Name", key: "plantName" },
      { label: "Family/Group", key: "familyKelompok" },
      { label: "Scientific Name", key: "scientificName" },
      { label: "Execution Schedule", key: "jadwalPelaksanaan" },
      { label: "Description", key: "title" },
      { label: "Description (Legacy)", key: "description" },
    ],
    penelitian: [
      ...commonFields,
      { label: "Research Title", key: "judulPenelitian" },
      { label: "Title (Legacy)", key: "title" },
      { label: "Execution Schedule", key: "jadwalPelaksanaan" },
      { label: "Start Date", key: "startDate" },
      { label: "End Date", key: "endDate" },
      { label: "Description", key: "description" },
      { label: "Notes", key: "notes" },
    ],
    peminjaman: [
      ...commonFields,
      { label: "Enrollment Year", key: "tahunMasuk" },
      { label: "Supervisor Approval", key: "persetujuanPembimbing" },
      { label: "Research Title", key: "judulPenelitian" },
      { label: "Research Objective", key: "tujuanPenelitian" },
      { label: "Requested Facilities", key: "fasilitasDigunakan" },
      { label: "Usage Start Time", key: "waktuMulaiPenggunaan" },
      { label: "Expected Return Time", key: "waktuSelesaiPengembalian" },
      { label: "Tool/Equipment Name (Legacy)", key: "toolName" },
      { label: "Quantity (Legacy)", key: "quantity" },
      { label: "Borrow Date (Legacy)", key: "borrowDate" },
      { label: "Expected Return (Legacy)", key: "expectedReturn" },
      { label: "Return Date (Legacy)", key: "returnDate" },
      { label: "Notes (Legacy)", key: "notes" },
    ],
    "kerja-lembur": [
      ...commonFields,
      { label: "Overtime Schedule", key: "jadwalPelaksanaanLembur" },
      { label: "Hours", key: "hours" },
      { label: "Date", key: "date" },
      { label: "Description", key: "description" },
    ],
  };

  const documentFieldsByService: Record<
    ServiceType,
    { label: string; key: keyof ApprovalItem }[]
  > = {
    identifikasi: [
      { label: "Application Letter", key: "suratPermohonanUrl" },
      { label: "Supporting Document (Legacy)", key: "imageUrl" },
    ],
    penelitian: [
      { label: "Application/Research Document", key: "suratPermohonanUrl" },
      { label: "Application/Research Document", key: "documentUrl" },
    ],
    peminjaman: [
      { label: "Application Document", key: "dokumenPermohonanUrl" },
    ],
    "kerja-lembur": [
      { label: "Application Letter", key: "suratPermohonanUrl" },
    ],
  };

  const dateFieldKeys = new Set<keyof ApprovalItem>([
    "date",
    "createdAt",
    "updatedAt",
    "startDate",
    "endDate",
    "returnDate",
    "borrowDate",
    "expectedReturn",
    "waktuMulaiPenggunaan",
    "waktuSelesaiPengembalian",
  ]);

  const documents = documentFieldsByService[service]
    .map((field) => ({
      label: field.label,
      url:
        typeof item[field.key] === "string" ? (item[field.key] as string) : "",
    }))
    .filter((doc) => Boolean(doc.url))
    .filter(
      (doc, index, arr) => arr.findIndex((x) => x.url === doc.url) === index,
    );

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-2xl shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex justify-between items-center rounded-t-2xl sm:rounded-t-xl">
          <h2 className="text-xl font-bold text-white">Review Submission</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-3xl leading-none font-light"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          {/* Submitter Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-green-700 mb-2">
              Submitted by
            </p>
            <p className="text-lg font-bold text-gray-900">
              {item.user?.name || "Unknown"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {item.user?.email || "-"}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              Submission Details
            </p>
            {fieldsByService[service]
              .filter((field) => item[field.key])
              .map((field) => (
                <div key={field.key}>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {field.label}
                  </p>
                  <p className="text-gray-900 mt-1 font-medium">
                    {dateFieldKeys.has(field.key)
                      ? new Date(String(item[field.key])).toLocaleString()
                      : field.key === "hours"
                        ? `${item[field.key]} hours`
                        : String(item[field.key])}
                  </p>
                </div>
              ))}
          </div>

          <div className="space-y-3 border-t border-gray-200 pt-4">
            <p className="text-sm font-semibold text-gray-700">
              Student Documents
            </p>
            {documents.length === 0 ? (
              <p className="text-sm text-gray-500">No uploaded documents.</p>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => {
                  const isPdf = doc.url.toLowerCase().includes(".pdf");
                  return (
                    <div key={`${doc.label}-${doc.url}`} className="space-y-2">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        {doc.label}
                      </p>
                      <div className="flex items-center gap-3">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-green-700 hover:text-green-800 underline"
                        >
                          Open Document
                        </a>
                        <a
                          href={doc.url}
                          download
                          className="text-sm text-gray-700 hover:text-gray-900 underline"
                        >
                          Download
                        </a>
                      </div>
                      {isPdf && (
                        <iframe
                          src={doc.url}
                          title={doc.label}
                          className="w-full h-72 border border-gray-200 rounded-lg"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 rounded-b-2xl sm:rounded-b-xl">
          <button
            onClick={() => onReject(service, item.id)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? "Processing..." : "Reject"}
          </button>
          <button
            onClick={() => onApprove(service, item.id)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? "Processing..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}

function toDisplayTitle(type: ServiceType, item: ApprovalItem) {
  if (type === "identifikasi")
    return item.namaKode || item.plantName || "Untitled submission";
  if (type === "penelitian") {
    if (item.nama) return `Research Request - ${item.nama}`;
    if (item.jadwalPelaksanaan)
      return `Research Request - ${item.jadwalPelaksanaan}`;
    return item.title || "Untitled research";
  }
  if (type === "peminjaman")
    return (
      item.judulPenelitian || item.toolName || "Untitled borrowing request"
    );
  if (type === "kerja-lembur") {
    if (item.nama) return `Overtime Request - ${item.nama}`;
    if (item.jadwalPelaksanaanLembur)
      return `Overtime Request - ${item.jadwalPelaksanaanLembur}`;
  }
  return item.date
    ? `Overtime ${new Date(item.date).toLocaleDateString()} (${item.hours || 0} hours)`
    : "Untitled overtime request";
}

export default function AdminApprovalsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Record<ServiceType, ApprovalItem[]>>({
    identifikasi: [],
    penelitian: [],
    peminjaman: [],
    "kerja-lembur": [],
  });
  const [modalState, setModalState] = useState<DetailModalState>({
    open: false,
    service: null,
    item: null,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
      return;
    }

    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }

    if (status === "authenticated") {
      void fetchAllPending();
    }
  }, [status, session, router]);

  const totalPending = useMemo(() => {
    return Object.values(data).reduce((acc, items) => acc + items.length, 0);
  }, [data]);

  const fetchAllPending = async () => {
    setLoading(true);
    setError(null);

    try {
      const [identifikasi, penelitian, peminjaman, kerjaLembur] =
        await Promise.all([
          fetch("/api/identifikasi?status=PENDING", { cache: "no-store" }),
          fetch("/api/penelitian?status=PENDING", { cache: "no-store" }),
          fetch("/api/peminjaman?status=PENDING", { cache: "no-store" }),
          fetch("/api/kerja-lembur?status=PENDING", { cache: "no-store" }),
        ]);

      if (
        !identifikasi.ok ||
        !penelitian.ok ||
        !peminjaman.ok ||
        !kerjaLembur.ok
      ) {
        throw new Error("Failed to load pending submissions");
      }

      const [
        identifikasiData,
        penelitianData,
        peminjamanData,
        kerjaLemburData,
      ] = await Promise.all([
        identifikasi.json(),
        penelitian.json(),
        peminjaman.json(),
        kerjaLembur.json(),
      ]);

      setData({
        identifikasi: identifikasiData,
        penelitian: penelitianData,
        peminjaman: peminjamanData,
        "kerja-lembur": kerjaLemburData,
      });
    } catch (fetchError) {
      console.error(fetchError);
      setError("Failed to load approval queue");
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (
    service: ServiceType,
    id: string,
    action: "approve" | "reject",
  ) => {
    const actionKey = `${service}-${id}-${action}`;
    setActionLoading(actionKey);
    setError(null);

    try {
      const approvedStatus =
        service === "identifikasi" ? "VERIFIED" : "APPROVED";
      const nextStatus = action === "approve" ? approvedStatus : "REJECTED";

      const response = await fetch(`/api/${service}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res?.error || "Failed to update status");
      }

      await fetchAllPending();
    } catch (submitError: any) {
      console.error(submitError);
      setError(submitError?.message || "Failed to update approval status");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 flex-col gap-3 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-700" />
              <span className="text-base font-bold text-green-700 sm:text-xl">
                Admin Approval Center
              </span>
            </Link>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              <Button
                variant="outline"
                onClick={fetchAllPending}
                className="w-full border-green-300 sm:w-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
              </Button>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button className="w-full bg-green-700 hover:bg-green-800 sm:w-auto">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <section className="bg-white border border-green-200 rounded-xl p-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Pending Approval Queue
          </h1>
          <p className="text-gray-600 mt-2">
            All student submissions from four services appear here and await
            admin approval.
          </p>
          <p className="text-green-700 font-semibold mt-3">
            Total pending: {totalPending}
          </p>
        </section>

        {error && (
          <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-600">
            Loading pending submissions...
          </div>
        ) : (
          <div className="space-y-8">
            {(Object.keys(data) as ServiceType[]).map((service) => (
              <section key={service} className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {serviceLabels[service]} ({data[service].length})
                </h2>

                {data[service].length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-5 text-sm text-gray-600">
                    No submissions are waiting for approval.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {data[service].map((item) => (
                      <Card
                        key={item.id}
                        className="border-green-200 cursor-pointer hover:shadow-lg hover:border-green-400 transition-all"
                        onClick={() =>
                          setModalState({ open: true, service, item })
                        }
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">
                            {toDisplayTitle(service, item)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600">
                            Submitted by: {item.user?.name || "Unknown user"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Email: {item.user?.email || "-"}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Submission time:{" "}
                            {new Date(item.createdAt).toLocaleString()}
                          </p>

                          <p className="text-sm text-green-600 font-semibold mt-4 flex items-center">
                            Click to review details →
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </main>

      <SubmissionDetailModal
        isOpen={modalState.open}
        service={modalState.service}
        item={modalState.item}
        onClose={() =>
          setModalState({ open: false, service: null, item: null })
        }
        onApprove={async (service, id) => {
          await handleApproval(service, id, "approve");
          setModalState({ open: false, service: null, item: null });
        }}
        onReject={async (service, id) => {
          await handleApproval(service, id, "reject");
          setModalState({ open: false, service: null, item: null });
        }}
        isLoading={actionLoading !== null}
      />
    </div>
  );
}
