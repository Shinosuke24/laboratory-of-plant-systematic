import nodemailer from "nodemailer";

type ServiceName =
  | "Identifikasi"
  | "Penelitian"
  | "Peminjaman Alat"
  | "Kerja Lembur";

function toStatusLabel(status: string) {
  const normalized = status.toUpperCase();
  if (normalized === "APPROVED" || normalized === "VERIFIED") return "APPROVED";
  if (normalized === "REJECTED") return "REJECTED";
  if (normalized === "PENDING") return "PENDING";
  if (normalized === "RETURNED") return "RETURNED";
  return normalized;
}

function toServiceLabel(serviceName: ServiceName) {
  if (serviceName === "Identifikasi") return "Identification";
  if (serviceName === "Penelitian") return "Research";
  if (serviceName === "Peminjaman Alat") return "Equipment Borrowing";
  if (serviceName === "Kerja Lembur") return "Overtime Work";
  return serviceName;
}

function buildTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass },
  });
}

export async function sendApprovalStatusEmail(params: {
  to: string;
  mahasiswaName?: string | null;
  serviceName: ServiceName;
  status: string;
  submissionTitle?: string;
}) {
  const transporter = buildTransporter();
  if (!transporter) {
    console.warn("[EMAIL] SMTP is not configured, email notification skipped.");
    return;
  }

  const from =
    process.env.MAIL_FROM || process.env.SMTP_USER || "no-reply@plantlab.local";
  const statusLabel = toStatusLabel(params.status);
  const serviceLabel = toServiceLabel(params.serviceName);
  const mahasiswa = params.mahasiswaName || "Student";
  const titleLine = params.submissionTitle
    ? `Submission Title/Name: ${params.submissionTitle}`
    : "";

  const subject = `[laboratory of plant systematic] ${serviceLabel} Status: ${statusLabel}`;
  const text = [
    `Hello ${mahasiswa},`,
    "",
    `Your ${serviceLabel} submission status has been updated by Admin.`,
    `Latest status: ${statusLabel}`,
    titleLine,
    "",
    "Please check the dashboard for more details.",
    "",
    "Regards,",
    "laboratory of plant systematic Team",
  ]
    .filter(Boolean)
    .join("\n");

  await transporter.sendMail({
    from,
    to: params.to,
    subject,
    text,
  });
}
