import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  ChevronDown,
  Globe2,
  Headphones,
  Languages,
  Menu,
  MessageCircle,
  Moon,
  Sparkles,
  Sun,
  UserRound,
  Users,
  WandSparkles,
  X,
  Zap,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/common/LanguageSwitcher";

const content = {
  en: {
    features: "Features",
    how: "How it works",
    why: "Why us",
    login: "Log in",
    badge: "Meet your smarter AI assistant",
    h1: "Conversations that",
    h2: "move your business",
    h3: "forward.",
    subtitle:
      "One intelligent workspace for better support, faster answers, and more meaningful customer conversations.",
    start: "Get started",
    explore: "Explore features",
    trusted: "Built for teams that care about every conversation",
    assistant: "AI ASSISTANT",
    online: "Online · Ready to help",
    hello: "Hi there! 👋 How can I help you today?",
    question: "How can AI help my business?",
    answer:
      "I can answer questions, guide customers, and help your team save time — all in one place.",
    ask: "Ask anything...",
    powered: "Powered by intelligent AI",
    featureEyebrow: "A better way to connect",
    featureTitle: "Everything your conversations need",
    featureSub: "Thoughtful tools that make every interaction feel effortless.",
    f1: "Instant AI responses",
    d1: "Give customers helpful answers in seconds, around the clock.",
    f2: "Human when it matters",
    d2: "Keep conversations personal with a smooth handoff to your team.",
    f3: "Understand every detail",
    d3: "Turn conversations into useful insights and better decisions.",
    f4: "Made to fit your workflow",
    d4: "Customize your assistant around your business and customers.",
    howEyebrow: "Simple by design",
    howTitle: "From first hello to solved",
    s1: "Set up your assistant",
    sd1: "Shape your AI around your brand, knowledge, and goals.",
    s2: "Connect with customers",
    sd2: "Bring helpful conversations to the places your customers are.",
    s3: "Keep getting better",
    sd3: "Learn from every interaction and improve your experience.",
    whyEyebrow: "The difference is in the details",
    whyTitle: "A more human kind of AI",
    whyText:
      "Great support is not just about quick replies. It is about making people feel heard. Give your team a thoughtful assistant that helps them do their best work.",
    p1: "Consistent, helpful experiences",
    p2: "A workspace your team can trust",
    p3: "Flexible for growing businesses",
    ctaTitle: "Ready for conversations that feel different?",
    ctaText:
      "Give your customers a faster, friendlier way to get the help they need.",
    cta: "Start a conversation",
    footerText: "Smarter conversations. Stronger connections.",
    product: "Product",
    company: "Company",
    legal: "Legal",
    privacy: "Privacy",
    terms: "Terms",
    roleTitle: "Choose how you want to continue",
    roleSub: "Select your account type to continue to login.",
    client: "Client",
    clientDesc: "Manage your AI assistant and business workspace.",
    user: "User",
    userDesc: "Chat with an AI assistant and get answers.",
    continue: "Continue to login",
    cancel: "Cancel",
    language: "Language",
  },
  hi: {
    features: "विशेषताएँ",
    how: "कैसे काम करता है",
    why: "हम क्यों",
    login: "लॉग इन",
    badge: "आपका स्मार्ट AI असिस्टेंट",
    h1: "ऐसी बातचीत जो",
    h2: "आपके बिज़नेस को",
    h3: "आगे बढ़ाए।",
    subtitle:
      "बेहतर सपोर्ट, तेज़ जवाब और शानदार ग्राहक अनुभव के लिए एक स्मार्ट वर्कस्पेस।",
    start: "शुरू करें",
    explore: "विशेषताएँ देखें",
    trusted: "हर बातचीत को बेहतर बनाने के लिए",
    assistant: "AI असिस्टेंट",
    online: "ऑनलाइन · मदद के लिए तैयार",
    hello: "नमस्ते! 👋 आज मैं आपकी कैसे मदद कर सकता हूँ?",
    question: "AI मेरे बिज़नेस की कैसे मदद कर सकता है?",
    answer:
      "मैं सवालों के जवाब दे सकता हूँ, ग्राहकों का मार्गदर्शन कर सकता हूँ और आपकी टीम का समय बचा सकता हूँ।",
    ask: "कुछ भी पूछें...",
    powered: "स्मार्ट AI द्वारा संचालित",
    featureEyebrow: "जुड़ने का बेहतर तरीका",
    featureTitle: "आपकी बातचीत के लिए सब कुछ",
    featureSub: "ऐसे उपयोगी टूल जो हर बातचीत को आसान बनाते हैं।",
    f1: "तुरंत AI जवाब",
    d1: "ग्राहकों को हर समय कुछ ही सेकंड में उपयोगी जवाब दें।",
    f2: "ज़रूरत पर इंसानी मदद",
    d2: "टीम तक आसान ट्रांसफर के साथ बातचीत को व्यक्तिगत रखें।",
    f3: "हर जानकारी को समझें",
    d3: "बातचीत को उपयोगी जानकारी और बेहतर फैसलों में बदलें।",
    f4: "आपके काम के अनुसार",
    d4: "अपने बिज़नेस और ग्राहकों के अनुसार असिस्टेंट को ढालें।",
    howEyebrow: "सरल अनुभव",
    howTitle: "पहली बातचीत से समाधान तक",
    s1: "असिस्टेंट सेटअप करें",
    sd1: "अपने ब्रांड, जानकारी और लक्ष्यों के अनुसार AI तैयार करें।",
    s2: "ग्राहकों से जुड़ें",
    sd2: "ग्राहकों तक उपयोगी बातचीत पहुँचाएँ।",
    s3: "लगातार बेहतर बनें",
    sd3: "हर बातचीत से सीखें और अनुभव सुधारें।",
    whyEyebrow: "छोटी बातों में बड़ा फर्क",
    whyTitle: "ज़्यादा मानवीय AI",
    whyText:
      "अच्छा सपोर्ट सिर्फ तेज़ जवाब देने के बारे में नहीं है। यह लोगों को समझे जाने का एहसास कराने के बारे में है।",
    p1: "लगातार बेहतर अनुभव",
    p2: "टीम के लिए भरोसेमंद वर्कस्पेस",
    p3: "बढ़ते बिज़नेस के लिए लचीला",
    ctaTitle: "बेहतर बातचीत के लिए तैयार हैं?",
    ctaText: "ग्राहकों को तेज़ और आसान मदद पाने का बेहतर तरीका दें।",
    cta: "बातचीत शुरू करें",
    footerText: "स्मार्ट बातचीत। मजबूत रिश्ते।",
    product: "प्रोडक्ट",
    company: "कंपनी",
    legal: "कानूनी",
    privacy: "प्राइवेसी",
    terms: "नियम",
    roleTitle: "आगे बढ़ने का तरीका चुनें",
    roleSub: "लॉगिन के लिए अपना अकाउंट टाइप चुनें।",
    client: "क्लाइंट",
    clientDesc: "अपने AI असिस्टेंट और बिज़नेस वर्कस्पेस को मैनेज करें।",
    user: "यूज़र",
    userDesc: "AI असिस्टेंट से चैट करें और जवाब पाएँ।",
    continue: "लॉगिन पर जाएँ",
    cancel: "रद्द करें",
    language: "भाषा",
  },
};

const featureCards = [
  {
    icon: Zap,
    title: "f1",
    desc: "d1",
    color: "text-violet-500 bg-violet-500/10",
  },
  {
    icon: Headphones,
    title: "f2",
    desc: "d2",
    color: "text-sky-500 bg-sky-500/10",
  },
  {
    icon: BrainCircuit,
    title: "f3",
    desc: "d3",
    color: "text-pink-500 bg-pink-500/10",
  },
  {
    icon: WandSparkles,
    title: "f4",
    desc: "d4",
    color: "text-emerald-500 bg-emerald-500/10",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const dark = isDarkMode;
  const t = (key) =>
    content[language === "hi" ? "hi" : "en"][key] ?? content.en[key] ?? key;

  useEffect(() => {
    if (!showRoleModal) return undefined;
    const onKeyDown = (event) =>
      event.key === "Escape" && setShowRoleModal(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showRoleModal]);

  useEffect(() => {
    if (!isProfileMenuOpen) return;

    const handlePointerDown = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileMenuOpen]);

  const goLogin = () => {
    navigate("/login", { state: { role: selectedRole } });
    setShowRoleModal(false);
  };

  const navItems = [
    { label: t("features"), href: "#features" },
    { label: t("how"), href: "#how-it-works" },
    { label: t("why"), href: "#why-us" },
  ];

  const surface = dark
    ? "bg-[#101525]/90 border-white/10"
    : "bg-white/90 border-slate-200";
  const muted = dark ? "text-slate-400" : "text-slate-600";
  const heading = dark ? "text-white" : "text-slate-900";

  return (
    <main
      className={`relative isolate min-h-screen overflow-hidden font-sans ${dark ? "bg-[#080b14] text-white" : "bg-[#f8f9ff] text-slate-900"}`}
    >
      {/* Animated ambient background — Tailwind utilities + Framer Motion, no CSS file */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -left-48 top-20 h-[28rem] w-[28rem] rounded-full bg-violet-600/20 blur-[110px]"
          animate={{ x: [0, 65, 0], y: [0, -35, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-48 top-[28rem] h-[30rem] w-[30rem] rounded-full bg-sky-500/20 blur-[115px]"
          animate={{ x: [0, -55, 0], y: [0, 45, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/3 top-[95rem] h-96 w-96 rounded-full bg-fuchsia-500/10 blur-[110px]"
          animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(130,145,190,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(130,145,190,.15) 1px, transparent 1px)",
            backgroundSize: "54px 54px",
            maskImage: "linear-gradient(to bottom, black, transparent 75%)",
          }}
        />
      </div>

      <header
        className={`relative z-30 mx-auto flex h-[76px] w-[min(1240px,calc(100%-36px))] items-center justify-between border-b ${dark ? "border-white/10" : "border-slate-200"}`}
      >
        <a
          href="#home"
          className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-400 text-white shadow-lg shadow-violet-500/30">
            <Bot size={22} />
          </span>
          Aiva<span className="text-violet-500">.</span>
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-sm transition hover:text-violet-500 ${muted}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="my-1 border-t border-gray-100 dark:border-white/10" />
          <div className="px-2 py-1">
            <LanguageSwitcher
              className="w-full"
              onLanguageChange={() => setIsProfileMenuOpen(false)}
            />
          </div>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`grid h-10 w-10 place-items-center rounded-xl border transition hover:-translate-y-0.5 hover:border-violet-400 ${surface}`}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setShowRoleModal(true)}
            className="hidden h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-4 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 sm:flex"
          >
            {t("login")} <ArrowUpRight size={16} />
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className={`grid h-10 w-10 place-items-center rounded-xl border md:hidden ${surface}`}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`absolute left-4 right-4 top-[70px] z-20 flex flex-col rounded-2xl border p-3 shadow-2xl md:hidden ${surface}`}
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`border-b px-3 py-3 text-sm last:border-0 ${dark ? "border-white/10" : "border-slate-100"}`}
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false);
                setShowRoleModal(true);
              }}
              className="flex items-center justify-between px-3 py-3 text-left text-sm font-bold text-violet-500"
            >
              {t("login")} <ArrowRight size={16} />
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      <section
        id="home"
        className="mx-auto grid min-h-[610px] w-[min(1160px,calc(100%-40px))] items-center gap-12 py-16 lg:grid-cols-2 lg:py-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2.5 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-[11px] font-bold text-violet-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,.12)]" />
            {t("badge")}
          </div>
          <h1
            className={`mt-7 text-5xl font-extrabold leading-[1.1] tracking-[-.055em] sm:text-6xl xl:text-[68px] ${heading}`}
          >
            {t("h1")}{" "}
            <span className="bg-gradient-to-r from-violet-500 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
              {t("h2")}
            </span>{" "}
            {t("h3")}
          </h1>
          <p className={`mt-6 max-w-xl text-base leading-8 ${muted}`}>
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => setShowRoleModal(true)}
              className="inline-flex h-12 items-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-6 text-sm font-bold text-white shadow-xl shadow-violet-500/25 transition hover:-translate-y-1 hover:shadow-violet-500/40"
            >
              {t("start")} <ArrowRight size={18} />
            </button>
            <a
              href="#features"
              className={`inline-flex h-12 items-center gap-3 rounded-xl border px-6 text-sm font-bold transition hover:-translate-y-1 hover:border-violet-400 ${surface}`}
            >
              {t("explore")} <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="mt-10 flex items-center justify-center gap-3 sm:justify-start">
            <div className="flex -space-x-2">
              {["R", "A", "M", "+"].map((v, i) => (
                <span
                  key={v}
                  className={`grid h-8 w-8 place-items-center rounded-full border-2 text-[10px] font-extrabold text-white ${dark ? "border-[#080b14]" : "border-[#f8f9ff]"} ${["bg-violet-500", "bg-rose-400", "bg-teal-500", "bg-slate-600"][i]}`}
                >
                  {v}
                </span>
              ))}
            </div>
            <div>
              <div className="text-[11px] tracking-[2px] text-amber-400">
                ★★★★★
              </div>
              <p className={`mt-0.5 text-[10px] ${muted}`}>{t("trusted")}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12 }}
          className="relative mx-auto flex min-h-[460px] w-full max-w-[510px] items-center justify-center"
        >
          <div className="absolute h-[300px] w-[430px] max-w-full rotate-[-22deg] rounded-[50%] border border-violet-400/20" />
          <div className="absolute h-[390px] w-[340px] max-w-full rotate-45 rounded-[50%] border border-sky-400/15" />
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [-1.5, -2.5, -1.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className={`relative z-10 w-full max-w-[390px] overflow-hidden rounded-[24px] border shadow-[0_35px_90px_rgba(0,0,0,.35)] backdrop-blur-2xl ${dark ? "border-violet-300/25 bg-[#111626]/90" : "border-violet-200 bg-white/90"}`}
          >
            <div
              className={`flex items-center justify-between border-b px-5 py-4 ${dark ? "border-white/10" : "border-slate-100"}`}
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-400 text-white">
                  <Bot size={20} />
                </span>
                <div>
                  <strong className="block text-[11px] tracking-wider">
                    {t("assistant")}
                  </strong>
                  <small className="mt-1 block text-[10px] text-emerald-500">
                    {t("online")}
                  </small>
                </div>
              </div>
              <span className={muted}>•••</span>
            </div>
            <div className="min-h-[275px] space-y-4 p-5">
              <p className={`text-center text-[8px] tracking-[2px] ${muted}`}>
                TODAY
              </p>
              <div className="flex items-start gap-2">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-sky-400 text-white">
                  <Bot size={14} />
                </span>
                <p
                  className={`max-w-[275px] rounded-r-xl rounded-bl-xl border p-3 text-[11px] leading-5 ${dark ? "border-white/10 bg-white/5" : "border-slate-100 bg-slate-50"}`}
                >
                  {t("hello")}
                </p>
              </div>
              <div className="flex justify-end">
                <p className="max-w-[270px] rounded-l-xl rounded-br-xl bg-gradient-to-r from-violet-600 to-blue-500 p-3 text-[11px] leading-5 text-white">
                  {t("question")}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-sky-400 text-white">
                  <Bot size={14} />
                </span>
                <p
                  className={`max-w-[275px] rounded-r-xl rounded-bl-xl border p-3 text-[11px] leading-5 ${dark ? "border-white/10 bg-white/5" : "border-slate-100 bg-slate-50"}`}
                >
                  {t("answer")}
                </p>
              </div>
              <div className="ml-8 flex gap-1">
                <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400" />
                <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]" />
                <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:300ms]" />
              </div>
            </div>
            <div
              className={`mx-4 flex items-center justify-between rounded-xl border px-3 py-2 text-[10px] ${dark ? "border-white/10 text-slate-500" : "border-slate-200 text-slate-400"}`}
            >
              <span>{t("ask")}</span>
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-600 text-white">
                <ArrowUpRight size={16} />
              </span>
            </div>
            <p className={`py-3 text-center text-[8px] ${muted}`}>
              {t("powered")}
            </p>
          </motion.div>
          <motion.div
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className={`absolute right-0 top-12 z-20 flex items-center gap-2 rounded-xl border px-3 py-2.5 text-[10px] font-bold shadow-xl ${surface}`}
          >
            <Sparkles size={15} className="text-violet-500" /> AI powered
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className={`absolute bottom-12 left-0 z-20 flex items-center gap-2 rounded-xl border px-3 py-2.5 text-[10px] font-bold shadow-xl ${surface}`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Always
            available
          </motion.div>
          <Sparkles
            className="absolute left-5 top-24 text-violet-400"
            size={22}
          />
          <Sparkles
            className="absolute bottom-24 right-6 text-sky-400"
            size={17}
          />
        </motion.div>
      </section>

      <section
        className={`mx-auto grid w-[min(1160px,calc(100%-40px))] grid-cols-1 border-y py-6 sm:grid-cols-3 ${dark ? "border-white/10" : "border-slate-200"}`}
      >
        {[
          ["24/7", "Always-on assistance"],
          [
            <>
              <Zap size={20} /> Fast
            </>,
            "Helpful answers in moments",
          ],
          [
            <>
              <ShieldCheck size={20} /> Secure
            </>,
            "Designed with trust in mind",
          ],
        ].map(([value, label], i) => (
          <div
            key={i}
            className={`flex items-center justify-center gap-3 py-2 ${i ? `sm:border-l ${dark ? "sm:border-white/10" : "sm:border-slate-200"}` : ""}`}
          >
            <strong className="flex items-center gap-2 text-lg font-extrabold">
              {value}
            </strong>
            <span className={`text-[10px] ${muted}`}>{label}</span>
          </div>
        ))}
      </section>

      <section
        id="features"
        className="mx-auto w-[min(1160px,calc(100%-40px))] py-24"
      >
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-[2px] text-violet-500">
            {t("featureEyebrow")}
          </span>
          <h2
            className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl ${heading}`}
          >
            {t("featureTitle")}
          </h2>
          <p className={`mt-3 text-sm leading-7 ${muted}`}>{t("featureSub")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -7 }}
              className={`group relative min-h-[220px] rounded-2xl border p-6 shadow-sm backdrop-blur-xl transition hover:border-violet-400/50 hover:shadow-xl hover:shadow-violet-500/5 ${surface}`}
            >
              <span
                className={`mb-6 grid h-12 w-12 place-items-center rounded-2xl ${color}`}
              >
                <Icon size={22} />
              </span>
              <ArrowUpRight
                className={`absolute right-6 top-7 ${muted}`}
                size={17}
              />
              <h3 className="mb-2 text-[15px] font-bold">{t(title)}</h3>
              <p className={`text-[11px] leading-6 ${muted}`}>{t(desc)}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className={`border-y py-20 ${dark ? "border-white/10 bg-white/[.02]" : "border-slate-200 bg-violet-50/50"}`}
      >
        <div className="mx-auto w-[min(1160px,calc(100%-40px))]">
          <div className="mb-12 text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-[2px] text-violet-500">
              {t("howEyebrow")}
            </span>
            <h2
              className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl ${heading}`}
            >
              {t("howTitle")}
            </h2>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              [WandSparkles, "01", "s1", "sd1"],
              [MessageCircle, "02", "s2", "sd2"],
              [BrainCircuit, "03", "s3", "sd3"],
            ].map(([Icon, n, title, desc]) => (
              <div key={n} className="relative pl-16">
                <span className="absolute left-0 top-0 text-3xl font-extrabold text-violet-500/60">
                  {n}
                </span>
                <span className="mb-5 grid h-11 w-11 place-items-center rounded-xl border border-violet-400/25 bg-violet-500/10 text-violet-500">
                  <Icon size={22} />
                </span>
                <h3 className="mb-2 text-[15px] font-bold">{t(title)}</h3>
                <p className={`text-[11px] leading-6 ${muted}`}>{t(desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="why-us"
        className="mx-auto w-[min(1160px,calc(100%-40px))] py-24"
      >
        <div
          className={`grid items-center gap-10 overflow-hidden rounded-[26px] border p-7 sm:p-12 lg:grid-cols-2 ${surface}`}
        >
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[2px] text-violet-500">
              {t("whyEyebrow")}
            </span>
            <h2
              className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl ${heading}`}
            >
              {t("whyTitle")}
            </h2>
            <p className={`my-5 text-sm leading-7 ${muted}`}>{t("whyText")}</p>
            <ul className={`mb-7 space-y-3 text-xs ${muted}`}>
              {["p1", "p2", "p3"].map((key) => (
                <li key={key} className="flex items-center gap-2">
                  <Check size={17} className="text-emerald-500" />
                  {t(key)}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowRoleModal(true)}
              className="inline-flex h-12 items-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-6 text-sm font-bold text-white shadow-lg shadow-violet-500/20"
            >
              {t("start")} <ArrowRight size={18} />
            </button>
          </div>
          <div className="relative flex min-h-[300px] items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              className="absolute h-[280px] w-[280px] rounded-full border border-dashed border-violet-400/30"
            />
            <div className="absolute h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="relative grid h-44 w-44 place-items-center rounded-full border border-violet-300/40 bg-gradient-to-br from-violet-400 to-indigo-800 text-white shadow-[0_0_80px_rgba(139,92,246,.45)]"
            >
              <Bot size={75} strokeWidth={1.2} />
            </motion.div>
            <span
              className={`absolute right-0 top-7 flex items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-bold shadow-xl ${surface}`}
            >
              <Sparkles size={15} className="text-violet-500" /> Smart replies
            </span>
            <span
              className={`absolute bottom-6 left-0 flex items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-bold shadow-xl ${surface}`}
            >
              <Users size={15} className="text-sky-500" /> Human connection
            </span>
            <span
              className={`absolute bottom-16 right-0 flex items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-bold shadow-xl ${surface}`}
            >
              <Zap size={15} className="text-amber-500" /> Less busywork
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(1160px,calc(100%-40px))] pb-24">
        <div className="relative overflow-hidden rounded-[26px] border border-violet-300/30 bg-gradient-to-br from-[#211942] via-[#1b2545] to-[#102d43] px-6 py-16 text-center text-white sm:px-12">
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-violet-500 blur-[100px]"
          />
          <Sparkles
            className="absolute left-[13%] top-9 text-violet-200/70"
            size={27}
          />
          <Sparkles
            className="absolute bottom-10 right-[15%] text-sky-200/70"
            size={20}
          />
          <div className="relative">
            <span className="text-[10px] font-extrabold uppercase tracking-[2px] text-violet-200">
              LET'S BUILD BETTER CONVERSATIONS
            </span>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300">
              {t("ctaText")}
            </p>
            <button
              onClick={() => setShowRoleModal(true)}
              className="mt-7 inline-flex h-12 items-center gap-3 rounded-xl bg-white px-6 text-sm font-extrabold text-indigo-950 transition hover:-translate-y-1"
            >
              {t("cta")} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <footer
        className={`border-t ${dark ? "border-white/10" : "border-slate-200"}`}
      >
        <div className="mx-auto grid w-[min(1160px,calc(100%-40px))] gap-9 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <a
              href="#home"
              className="flex items-center gap-2.5 text-2xl font-extrabold"
            >
              {" "}
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-400 text-white">
                <Bot size={22} />
              </span>
              Aiva<span className="text-violet-500">.</span>
            </a>
            <p className={`mt-4 max-w-[220px] text-xs leading-6 ${muted}`}>
              {t("footerText")}
            </p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <strong className="mb-1 text-xs">{t("product")}</strong>
            <a href="#features" className={`text-xs ${muted}`}>
              {t("features")}
            </a>
            <a href="#how-it-works" className={`text-xs ${muted}`}>
              {t("how")}
            </a>
          </div>
          <div className="flex flex-col items-start gap-3">
            <strong className="mb-1 text-xs">{t("company")}</strong>
            <a href="#why-us" className={`text-xs ${muted}`}>
              {t("why")}
            </a>
            <button
              onClick={() => setShowRoleModal(true)}
              className={`text-xs ${muted}`}
            >
              {t("login")}
            </button>
          </div>
          <div className="flex flex-col items-start gap-3">
            <strong className="mb-1 text-xs">{t("legal")}</strong>

            <Link
              to="/privacy-policy"
              className={`text-xs ${muted} transition-colors hover:text-blue-500`}
            >
              {t("Privacy Policy")}
            </Link>

            <Link
              to="/terms-and-conditions"
              className={`text-xs ${muted} transition-colors hover:text-blue-500`}
            >
              {t("Terms & Conditions")}
            </Link>
          </div>
        </div>
        <div
          className={`mx-auto flex w-[min(1160px,calc(100%-40px))] flex-col gap-3 border-t py-5 text-[10px] sm:flex-row sm:items-center sm:justify-between ${dark ? "border-white/10 text-slate-500" : "border-slate-200 text-slate-500"}`}
        >
          <span>
            © {new Date().getFullYear()} Aiva AI. All rights reserved.
          </span>
          <span className="flex items-center gap-2">
            Made for better conversations{" "}
            <Sparkles size={13} className="text-violet-500" />
          </span>
        </div>
      </footer>

      <AnimatePresence>
        {showRoleModal && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) =>
              e.target === e.currentTarget && setShowRoleModal(false)
            }
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="role-modal-title"
              initial={{ opacity: 0, y: 22, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className={`relative w-full max-w-[440px] rounded-3xl border p-7 shadow-2xl sm:p-8 ${dark ? "border-white/10 bg-[#111626] text-white" : "border-slate-200 bg-white text-slate-900"}`}
            >
              <button
                onClick={() => setShowRoleModal(false)}
                aria-label="Close"
                className={`absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl border ${dark ? "border-white/10 text-slate-400" : "border-slate-200 text-slate-500"}`}
              >
                <X size={18} />
              </button>
              <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-sky-400 text-white shadow-lg shadow-violet-500/30">
                <Bot size={26} />
              </div>
              <p className="text-center text-[10px] font-extrabold uppercase tracking-[2px] text-violet-500">
                WELCOME TO AIVA
              </p>
              <h2
                id="role-modal-title"
                className="mt-2 text-center text-xl font-extrabold"
              >
                {t("roleTitle")}
              </h2>
              <p className={`mb-6 mt-2 text-center text-xs ${muted}`}>
                {t("roleSub")}
              </p>
              <div className="space-y-3">
                {[
                  {
                    role: "client",
                    icon: Users,
                    title: t("client"),
                    desc: t("clientDesc"),
                  },
                  {
                    role: "user",
                    icon: UserRound,
                    title: t("user"),
                    desc: t("userDesc"),
                  },
                ].map(({ role, icon: Icon, title, desc }) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${selectedRole === role ? "border-violet-500 bg-violet-500/10 ring-2 ring-violet-500/10" : dark ? "border-white/10 bg-white/[.03]" : "border-slate-200 bg-slate-50"}`}
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-500/10 text-violet-500">
                      <Icon size={22} />
                    </span>
                    <span className="flex-1">
                      <strong className="block text-sm">{title}</strong>
                      <small
                        className={`mt-1 block text-[10px] leading-5 ${muted}`}
                      >
                        {desc}
                      </small>
                    </span>
                    <span
                      className={`grid h-[18px] w-[18px] place-items-center rounded-full border ${selectedRole === role ? "border-violet-500" : dark ? "border-slate-500" : "border-slate-400"}`}
                    >
                      {selectedRole === role && (
                        <i className="h-2 w-2 rounded-full bg-violet-500" />
                      )}
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={goLogin}
                className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 text-sm font-bold text-white shadow-lg shadow-violet-500/20"
              >
                {t("continue")} <ArrowRight size={18} />
              </button>
              <button
                onClick={() => setShowRoleModal(false)}
                className={`mt-3 w-full py-2 text-xs ${muted}`}
              >
                {t("cancel")}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
