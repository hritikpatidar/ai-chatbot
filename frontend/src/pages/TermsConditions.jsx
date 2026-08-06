import {
  FileText,
  Shield,
  Lock,
  AlertTriangle,
  RefreshCw,
  Mail,
  ChevronLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const sections = [
  {
    icon: FileText,
    title: "Acceptance of Terms",
    content:
      "By accessing or using our platform, you agree to be bound by these Terms and Conditions. If you do not agree, please discontinue using the service immediately.",
  },
  {
    icon: Shield,
    title: "User Responsibilities",
    content:
      "Users are responsible for maintaining the confidentiality of their account credentials and all activities performed under their account.",
  },
  {
    icon: Lock,
    title: "Privacy & Security",
    content:
      "We are committed to protecting your information. Personal data is processed according to our Privacy Policy.",
  },
  {
    icon: AlertTriangle,
    title: "Prohibited Activities",
    content:
      "You may not misuse the platform, attempt unauthorized access, distribute malicious software, or violate applicable laws.",
  },
  {
    icon: RefreshCw,
    title: "Changes to Terms",
    content:
      "We reserve the right to update these Terms at any time. Continued use of the platform constitutes acceptance of the revised Terms.",
  },
  {
    icon: Mail,
    title: "Contact Us",
    content:
      "If you have any questions regarding these Terms & Conditions, please contact our support team.",
  },
];

export default function TermsConditions() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Background Blur */}
      <div className="fixed left-1/2 top-20 -translate-x-1/2 w-125 h-125 rounded-full bg-blue-500/10 blur-[150px]" />
      <div className="relative mx-auto max-w-6xl px-5 py-12">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-5 inline-flex items-center gap-2 text-gray-400 transition hover:text-white"
            >
              <ChevronLeft size={18} />
              Back
            </button>

            <h1 className="text-4xl font-bold md:text-5xl">
              Terms &
              <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {" "}
                Conditions
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-gray-400">
              Please read these Terms & Conditions carefully before using our
              platform.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-[#171b23]/80 px-6 py-4 backdrop-blur-xl">
            <p className="text-sm text-gray-400">Last Updated</p>
            <p className="mt-1 font-semibold">July 27, 2026</p>
          </div>
        </div>

        {/* Sections */}
        <div className="grid gap-6">
          {sections.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group rounded-3xl border border-white/10 bg-[#171b23]/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-500 hover:-translate-y-1"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500/20 to-cyan-500/20 text-cyan-400">
                    <Icon size={26} />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold group-hover:text-cyan-400 transition">
                      {item.title}
                    </h2>

                    <p className="mt-3 leading-8 text-gray-400">
                      {item.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}

        <div className="mt-16 rounded-3xl border border-white/10 bg-[#171b23]/80 p-8 text-center backdrop-blur-xl">
          <h3 className="text-2xl font-semibold">Need Help?</h3>
          <p className="mx-auto mt-3 max-w-xl text-gray-400">
            If you have any questions about our Terms & Conditions, please
            contact our support team.
          </p>
          <button className="mt-6 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 px-8 py-3 font-medium transition hover:scale-105">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
