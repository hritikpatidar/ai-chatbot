import {
  FileText,
  Shield,
  Lock,
  AlertTriangle,
  RefreshCw,
  Mail,
  ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      {/* Background Blur */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-blue-500/5
          dark:bg-transparent
        "
      />

      <div className="relative z-10 mx-auto max-w-5xl px-5 py-10">
        {/* Header */}

        <button
          type="button"
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

        <div className="mb-8">
          <h1
            className="
              text-4xl
              font-bold
              text-gray-900
              md:text-5xl
              dark:text-white
            "
          >
            Terms &
            <span
              className="
                bg-linear-to-r
                from-cyan-500
                to-blue-500
                bg-clip-text
                text-transparent
                dark:from-cyan-400
                dark:to-blue-500
              "
            >
              {" "}
              Conditions
            </span>
          </h1>

          <p
            className="
              mt-4
              max-w-2xl
              text-gray-600
              dark:text-gray-400
            "
          >
            Please read these Terms & Conditions carefully before using our
            platform.
          </p>
        </div>

        {/* Last Updated */}

        <div
          className="
            rounded-2xl
            border
            border-blue-200
            bg-white/80
            px-6
            py-4
            backdrop-blur-xl
            dark:border-blue-500/20
            dark:bg-[#171b23]/80
          "
        >
          <p
            className="
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Last Updated
          </p>

          <p
            className="
              mt-1
              font-semibold
              text-gray-900
              dark:text-white
            "
          >
            July 27, 2026
          </p>
        </div>

        {/* Sections */}

        <div className="mt-6 grid gap-6">
          {sections.map((item, index) => {
            const Icon = item.icon;

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
                  hover:border-blue-500
                  dark:border-white/10
                  dark:bg-[#171b23]/80
                "
              >
                <div className="flex items-start gap-5">
                  {/* Icon */}

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
                      from-blue-500/10
                      to-cyan-500/10
                      text-cyan-600
                      dark:from-blue-500/20
                      dark:to-cyan-500/20
                      dark:text-cyan-400
                    "
                  >
                    <Icon size={26} />
                  </div>

                  {/* Content */}

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
                      {item.title}
                    </h2>

                    <p
                      className="
                        mt-3
                        leading-8
                        text-gray-600
                        dark:text-gray-400
                      "
                    >
                      {item.content}
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
            mt-16
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
          <h3
            className="
              text-2xl
              font-semibold
              text-gray-900
              dark:text-white
            "
          >
            Need Help?
          </h3>

          <p
            className="
              mx-auto
              mt-3
              max-w-xl
              text-gray-600
              dark:text-gray-400
            "
          >
            If you have any questions about our Terms & Conditions, please
            contact our support team.
          </p>

          <button
            type="button"
            className="
              mt-6
              rounded-xl
              bg-linear-to-r
              from-blue-500
              to-cyan-500
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
