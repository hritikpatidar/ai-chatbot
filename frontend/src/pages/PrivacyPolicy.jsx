import {
  ChevronLeft,
  ShieldCheck,
  Database,
  Eye,
  Lock,
  Globe,
  Mail,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content:
      "We may collect information such as your name, email address, profile details, device information, browser details, and usage analytics to improve our services.",
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content:
      "Your information helps us provide personalized experiences, improve platform performance, process requests, enhance security, and communicate important updates.",
  },
  {
    icon: Lock,
    title: "Data Protection",
    content:
      "We use industry-standard security measures including encryption, authentication, and secure storage practices to protect your personal information.",
  },
  {
    icon: Globe,
    title: "Third-Party Services",
    content:
      "Some services such as payment gateways, analytics, or cloud providers may process limited information necessary for providing their services.",
  },
  {
    icon: ShieldCheck,
    title: "Your Rights",
    content:
      "You may request access, correction, deletion, or export of your personal data at any time according to applicable privacy regulations.",
  },
  {
    icon: Mail,
    title: "Contact Us",
    content:
      "If you have any questions regarding this Privacy Policy, feel free to contact our support team.",
  },
];

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Background Glow */}
      <div className="fixed left-1/2 top-20 h-125 w-125 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[170px]" />
      <div className="relative mx-auto max-w-6xl px-5 py-12">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-5 inline-flex items-center gap-2 text-gray-400 transition hover:text-white"
            >
              <ChevronLeft size={18} />
              Back
            </button>
            <h1 className="text-4xl font-bold md:text-5xl">
              Privacy
              <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {" "}
                Policy
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-gray-400">
              Your privacy is important to us. This Privacy Policy explains how
              we collect, use, store, and protect your personal information
              while using our platform.
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-500/20 bg-[#171b23]/80 px-6 py-4 backdrop-blur-xl">
            <p className="text-sm text-gray-400">Last Updated</p>
            <p className="mt-1 text-lg font-semibold">July 27, 2026</p>
          </div>
        </div>

        {/* Policy Cards */}
        <div className="grid gap-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="group rounded-3xl border border-white/10 bg-[#171b23]/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400">
                    <Icon size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold transition group-hover:text-cyan-400">
                      {section.title}
                    </h2>
                    <p className="mt-3 leading-8 text-gray-400">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-14 rounded-3xl border border-white/10 bg-[#171b23]/80 p-8 text-center backdrop-blur-xl">
          <ShieldCheck size={48} className="mx-auto text-cyan-400" />
          <h3 className="mt-5 text-2xl font-semibold">Your Privacy Matters</h3>
          <p className="mx-auto mt-3 max-w-2xl text-gray-400 leading-7">
            We are committed to maintaining the confidentiality and security of
            your personal information. Our policies are regularly updated to
            ensure transparency and compliance with privacy standards.
          </p>
          <button className="mt-8 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 px-8 py-3 font-medium transition hover:scale-105">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
