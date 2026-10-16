import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Home,
  MessageCircle,
  Search,
  Sparkles,
} from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f8fc] px-4 py-8 text-gray-900 transition-colors duration-300 dark:bg-[#090b10] dark:text-white sm:px-6">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl sm:h-96 sm:w-96" />

        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <section className="relative z-10 grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left content */}
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300">
            <Sparkles size={16} />
            AI Chatbot Navigation
          </div>

          <h1 className="text-7xl font-black tracking-tighter sm:text-8xl md:text-9xl">
            4<span className="text-blue-600 dark:text-blue-400">0</span>4
          </h1>

          <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Oops! Lost in the{" "}
            <span className="text-blue-600 dark:text-blue-400">
              AI universe?
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base lg:mx-0">
            Looks like this page has gone off the grid. Our AI searched
            everywhere, but couldn't find what you're looking for.
            Let's get you back on track.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#090b10]"
            >
              <Home size={18} />
              Back to Home
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              onClick={handleGoBack}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500 lg:justify-start">
            <Search size={16} />
            <span>Error code:</span>
            <span className="font-mono font-semibold">404_PAGE_NOT_FOUND</span>
          </div>
        </div>

        {/* Right illustration */}
        <div className="order-1 flex justify-center lg:order-2">
          <div className="relative w-full max-w-md">
            {/* Floating cards */}
            <div className="absolute -left-2 top-12 z-10 hidden animate-bounce rounded-2xl border border-gray-200 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-[#171b25] sm:block">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  Page not found
                </span>
              </div>
            </div>

            <div className="absolute -right-1 top-24 z-10 hidden rounded-2xl border border-blue-200 bg-blue-50 p-3 shadow-xl dark:border-blue-400/20 dark:bg-[#111a2c] sm:block">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-300">
                <MessageCircle size={17} />
                <span className="text-xs font-semibold">
                  Searching the universe...
                </span>
              </div>
            </div>

            {/* Main chatbot card */}
            <div className="relative overflow-hidden rounded-4xl border border-gray-200 bg-white p-6 shadow-2xl shadow-gray-300/40 dark:border-white/10 dark:bg-[#11141d] dark:shadow-black/40 sm:p-9">
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-500 via-violet-500 to-blue-400" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                    <Bot size={25} />
                  </div>

                  <div>
                    <p className="font-bold">AI Assistant</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      Online and ready
                    </p>
                  </div>
                </div>

                <Sparkles className="text-violet-500" size={22} />
              </div>

              {/* 404 visual */}
              <div className="relative my-9 flex items-center justify-center py-5">
                <div className="absolute h-48 w-48 rounded-full border border-blue-200 dark:border-blue-400/20" />
                <div className="absolute h-36 w-36 rounded-full border border-dashed border-violet-300 dark:border-violet-400/30" />

                <div className="relative flex h-32 w-32 items-center justify-center rounded-4xl border border-blue-200 bg-linear-to-br from-blue-100 to-violet-100 shadow-xl shadow-blue-500/10 dark:border-blue-400/20 dark:from-blue-500/20 dark:to-violet-500/20">
                  <Bot
                    size={76}
                    strokeWidth={1.4}
                    className="text-blue-600 dark:text-blue-300"
                  />

                  <span className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-xs font-black text-violet-600 shadow-lg dark:border-white/10 dark:bg-[#1c2030] dark:text-violet-300">
                    ?
                  </span>
                </div>

                <span className="absolute left-5 top-5 h-3 w-3 rounded-full bg-blue-500" />
                <span className="absolute right-5 top-10 h-2 w-2 rounded-full bg-violet-500" />
                <span className="absolute bottom-3 left-12 h-2 w-2 rounded-full bg-violet-400" />
                <span className="absolute bottom-5 right-10 h-3 w-3 rounded-full bg-blue-400" />
              </div>

              {/* Chat message */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/4">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-300">
                  <Bot size={15} />
                  AI Assistant
                </div>

                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                  Hmm... I couldn't find this page. But don't worry, we can
                  find another way!
                </p>

                <div className="mt-4 flex gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500/60" />
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500/30" />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between text-xs text-gray-500">
                <span>Powered by AI</span>
                <span className="flex items-center gap-1.5">
                  <Sparkles size={13} />
                  Always learning
                </span>
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-gray-500 dark:text-gray-500">
              Even the smartest AI can't find every page.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFound;