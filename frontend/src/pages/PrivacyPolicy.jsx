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
    <div
      className="
        min-h-screen
        bg-gray-50
        text-gray-900
        transition-colors
        duration-300
        dark:bg-[#0b0f17]
        dark:text-white
      "
    >
      {/* Background Glow */}

      <div
        className="
          absolute
          inset-0
          bg-cyan-500/5
          dark:bg-transparent
        "
      />

      {/* Main Content */}

      <div className="relative z-10 mx-auto max-w-5xl px-5 py-10">

        {/* Header */}

        <button
          onClick={() => navigate(-1)}
          className="
            mb-5
            inline-flex
            items-center
            gap-2
            text-gray-500
            transition
            hover:text-gray-900
            dark:text-gray-400
            dark:hover:text-white
          "
        >
          <ChevronLeft size={18} />
          Back
        </button>

        <div className="mb-10">
          <h1
            className="
              text-4xl
              font-bold
              text-gray-900
              dark:text-white
            "
          >
            Privacy{" "}
            <span className="text-cyan-500">
              Policy
            </span>
          </h1>

          <p
            className="
              mt-4
              max-w-3xl
              leading-7
              text-gray-600
              dark:text-gray-400
            "
          >
            Your privacy is important to us. This Privacy Policy explains how
            we collect, use, store, and protect your personal information
            while using our platform.
          </p>

          <div
            className="
              mt-4
              text-sm
              text-gray-500
              dark:text-gray-500
            "
          >
            <span className="font-medium">
              Last Updated
            </span>
            <br />
            July 27, 2026
          </div>
        </div>

        {/* Policy Cards */}

        <div className="grid gap-6">
          {sections.map((section, index) => {
            const Icon = section.icon;

            return (
              <div
                key={index}
                className="
                  group
                  rounded-3xl
                  border
                  border-gray-200
                  bg-white/80
                  p-6
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-cyan-500
                  dark:border-white/10
                  dark:bg-[#171b23]/80
                "
              >
                <div className="flex items-start gap-5">

                  <div
                    className="
                      flex
                      h-14
                      w-14
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-linear-to-br
                      from-cyan-500/10
                      to-blue-500/10
                      text-cyan-600
                      dark:from-cyan-500/20
                      dark:to-blue-500/20
                      dark:text-cyan-400
                    "
                  >
                    <Icon size={28} />
                  </div>

                  <div>
                    <h2
                      className="
                        text-xl
                        font-semibold
                        text-gray-900
                        transition
                        group-hover:text-cyan-600
                        dark:text-white
                        dark:group-hover:text-cyan-400
                      "
                    >
                      {section.title}
                    </h2>

                    <p
                      className="
                        mt-3
                        leading-8
                        text-gray-600
                        dark:text-gray-400
                      "
                    >
                      {section.content}
                    </p>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}

        <div
          className="
            mt-14
            rounded-3xl
            border
            border-gray-200
            bg-white/80
            p-8
            text-center
            backdrop-blur-xl
            dark:border-white/10
            dark:bg-[#171b23]/80
          "
        >
          <ShieldCheck
            size={48}
            className="
              mx-auto
              text-cyan-600
              dark:text-cyan-400
            "
          />

          <h3
            className="
              mt-5
              text-2xl
              font-semibold
              text-gray-900
              dark:text-white
            "
          >
            Your Privacy Matters
          </h3>

          <p
            className="
              mx-auto
              mt-3
              max-w-2xl
              leading-7
              text-gray-600
              dark:text-gray-400
            "
          >
            We are committed to maintaining the confidentiality and security
            of your personal information. Our policies are regularly updated to
            ensure transparency and compliance with privacy standards.
          </p>

          <button
            className="
              mt-8
              rounded-xl
              bg-linear-to-r
              from-cyan-500
              to-blue-500
              px-8
              py-3
              font-medium
              text-white
              transition
              hover:scale-105
            "
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}