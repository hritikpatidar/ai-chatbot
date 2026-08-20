(function () {
  // ============================================================
  // Prevent duplicate widget initialization
  // ============================================================

  if (window.__AI_CHATBOT_WIDGET_LOADED__) {
    console.warn("AI Chatbot: Widget already loaded.");
    return;
  }

  window.__AI_CHATBOT_WIDGET_LOADED__ = true;

  // ============================================================
  // Current Script
  // ============================================================

  const script = document.currentScript;

  if (!script) {
    console.error("AI Chatbot: Unable to find current script.");
    return;
  }

  // ============================================================
  // Client ID
  // ============================================================

  const clientId = script.getAttribute("data-client-id");

  if (!clientId) {
    console.error("AI Chatbot: data-client-id is required.");
    return;
  }

  // ============================================================
  // Chatbot URL
  // ============================================================

  const CHATBOT_URL =
    "https://my-ai-chatbot-project.vercel.app";

  // ============================================================
  // Configuration
  // ============================================================

  const CONFIG = {
    desktop: {
      buttonRight: "24px",
      buttonBottom: "24px",

      // Robot size
      buttonSize: "72px",

      // Medium close button
      closeButtonSize: "48px",

      // Iframe position
      iframeRight: "30px",
      iframeTop: "13%",

      iframeWidth: "400px",
      iframeHeight: "calc(80vh - 24px)",

      borderRadius: "18px",
    },

    mobile: {
      buttonRight: "16px",
      buttonBottom: "16px",

      // Robot size
      buttonSize: "64px",

      // Medium close button
      closeButtonSize: "46px",

      // Iframe position
      iframeRight: "8px",
      iframeTop: "20%",

      iframeWidth: "calc(100vw - 16px)",
      iframeHeight: "calc(80vh - 24px)",

      borderRadius: "16px",
    },
  };

  // ============================================================
  // Inject CSS
  // ============================================================

  const style = document.createElement("style");

  style.id = "ai-chatbot-widget-style";

  style.textContent = `
    /* ==========================================================
       Widget Button
       ========================================================== */

    .ai-widget-button {
      position: fixed;

      display: flex;
      align-items: center;
      justify-content: center;

      width: 72px;
      height: 72px;

      padding: 0;
      margin: 0;

      border: none;
      border-radius: 50%;

      background: transparent;

      cursor: pointer;

      outline: none;

      z-index: 999999;

      overflow: visible;

      -webkit-tap-highlight-color: transparent;

      transition: none;
    }

    /* ==========================================================
       Robot Icon
       ========================================================== */

    .ai-widget-robot {
      width: 100%;
      height: 100%;

      display: block;

      transform-origin: center center;

      filter:
        drop-shadow(
          0 10px 12px rgba(0, 0, 0, 0.20)
        );

      transition: none;

      transform: none;
    }

    /* ==========================================================
       Hover
       ========================================================== */

    .ai-widget-button:hover {
      transform: none;
    }

    .ai-widget-button:hover .ai-widget-robot {
      transform: none;

      filter:
        drop-shadow(
          0 10px 12px rgba(0, 0, 0, 0.20)
        );
    }

    /* ==========================================================
       Active / Click
       ========================================================== */

    .ai-widget-button:active {
      transform: none;
    }

    /* ==========================================================
       Open / Close Button
       ========================================================== */

    .ai-widget-button.ai-widget-open {
      width: 48px;
      height: 48px;

      border-radius: 50%;

      background:
        linear-gradient(
          145deg,
          #2563eb,
          #1d4ed8
        );

      box-shadow:
        0 6px 18px rgba(37, 99, 235, 0.30);

      transition: none;

      transform: none;
    }

    .ai-widget-button.ai-widget-open:hover {
      transform: none;
    }

    .ai-widget-button.ai-widget-open:active {
      transform: none;
    }

    /* ==========================================================
       Close Icon
       ========================================================== */

    .ai-widget-close-icon {
      width: 20px;
      height: 20px;

      color: #ffffff;

      display: flex;
      align-items: center;
      justify-content: center;

      flex-shrink: 0;

      transition: none;

      transform: none;
    }

    .ai-widget-close-icon svg {
      width: 20px;
      height: 20px;

      display: block;

      transition: none;

      transform: none;
    }

    /* ==========================================================
       Mobile
       ========================================================== */

    @media (max-width: 600px) {

      .ai-widget-button {
        width: 64px;
        height: 64px;

        transition: none;
      }

      .ai-widget-button.ai-widget-open {
        width: 46px;
        height: 46px;

        transition: none;

        transform: none;
      }

      .ai-widget-close-icon {
        width: 20px;
        height: 20px;
      }

      .ai-widget-close-icon svg {
        width: 20px;
        height: 20px;
      }

      .ai-widget-button:hover {
        transform: none;
      }

      .ai-widget-button:active {
        transform: none;
      }
    }

    /* ==========================================================
       Reduced Motion
       ========================================================== */

    @media (prefers-reduced-motion: reduce) {

      .ai-widget-button,
      .ai-widget-robot,
      .ai-widget-close-icon,
      .ai-widget-close-icon svg {
        transition: none !important;
        animation: none !important;
      }
    }
  `;

  document.head.appendChild(style);

  // ============================================================
  // Robot SVG Icon
  // ============================================================

  const robotIcon = `
    <svg
      class="ai-widget-robot"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >

      <defs>

        <linearGradient
          id="robotBodyGradient"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0%"
            stop-color="#dbeafe"
          />

          <stop
            offset="45%"
            stop-color="#93c5d9"
          />

          <stop
            offset="100%"
            stop-color="#64748b"
          />
        </linearGradient>

        <linearGradient
          id="robotFaceGradient"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0%"
            stop-color="#475569"
          />

          <stop
            offset="100%"
            stop-color="#1e293b"
          />
        </linearGradient>

        <linearGradient
          id="speechGradient"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0%"
            stop-color="#22d3ee"
          />

          <stop
            offset="100%"
            stop-color="#2563eb"
          />
        </linearGradient>

        <filter
          id="eyeGlow"
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur
            stdDeviation="2"
            result="blur"
          />

          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter
          id="robotShadow"
          x="-30%"
          y="-30%"
          width="160%"
          height="180%"
        >
          <feDropShadow
            dx="0"
            dy="5"
            stdDeviation="5"
            flood-color="#000000"
            flood-opacity="0.22"
          />
        </filter>

      </defs>

      <!-- =====================================================
           Antenna
           ===================================================== -->

      <line
        x1="60"
        y1="24"
        x2="60"
        y2="12"
        stroke="#334155"
        stroke-width="4"
        stroke-linecap="round"
      />

      <circle
        cx="60"
        cy="9"
        r="5"
        fill="#22d3ee"
      />

      <rect
        x="51"
        y="22"
        width="18"
        height="4"
        rx="2"
        fill="#334155"
      />

      <rect
        x="54"
        y="29"
        width="12"
        height="3"
        rx="1.5"
        fill="#475569"
      />

      <!-- =====================================================
           Robot Body
           ===================================================== -->

      <rect
        x="18"
        y="28"
        width="84"
        height="76"
        rx="30"
        fill="url(#robotBodyGradient)"
        filter="url(#robotShadow)"
      />

      <!-- =====================================================
           Left Ear
           ===================================================== -->

      <rect
        x="10"
        y="48"
        width="14"
        height="31"
        rx="7"
        fill="#2563eb"
      />

      <circle
        cx="17"
        cy="47"
        r="6"
        fill="#22d3ee"
      />

      <!-- =====================================================
           Right Ear
           ===================================================== -->

      <rect
        x="96"
        y="48"
        width="14"
        height="31"
        rx="7"
        fill="#2563eb"
      />

      <!-- =====================================================
           Face
           ===================================================== -->

      <rect
        x="27"
        y="47"
        width="66"
        height="45"
        rx="20"
        fill="url(#robotFaceGradient)"
      />

      <rect
        x="30"
        y="50"
        width="60"
        height="39"
        rx="17"
        fill="none"
        stroke="#64748b"
        stroke-opacity="0.35"
        stroke-width="2"
      />

      <!-- =====================================================
           Eyes
           ===================================================== -->

      <rect
        x="42"
        y="57"
        width="11"
        height="17"
        rx="5.5"
        fill="#4adeff"
        filter="url(#eyeGlow)"
      />

      <rect
        x="67"
        y="57"
        width="11"
        height="17"
        rx="5.5"
        fill="#4adeff"
        filter="url(#eyeGlow)"
      />

      <!-- =====================================================
           Smile
           ===================================================== -->

      <path
        d="M48 79 Q60 89 72 79"
        fill="none"
        stroke="#4adeff"
        stroke-width="5"
        stroke-linecap="round"
      />

      <!-- =====================================================
           Speech Bubble
           ===================================================== -->

      <path
        d="
          M55 18
          C55 10 62 5 72 5
          H96
          C106 5 113 12 113 21
          V39
          C113 48 106 55 96 55
          H78
          L68 65
          V55
          H72
          C62 55 55 48 55 39
          Z
        "
        fill="url(#speechGradient)"
        filter="url(#robotShadow)"
      />

      <!-- =====================================================
           Bubble Highlight
           ===================================================== -->

      <path
        d="
          M63 15
          C67 10 72 9 78 9
          H94
        "
        fill="none"
        stroke="#ffffff"
        stroke-width="2"
        stroke-linecap="round"
        stroke-opacity="0.18"
      />

      <!-- =====================================================
           Hi Text
           ===================================================== -->

      <text
        x="83"
        y="39"
        text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="21"
        font-weight="700"
        fill="#ffffff"
      >
        Hi
      </text>

    </svg>
  `;

  // ============================================================
  // Close Icon
  // ============================================================

  const closeIcon = `
    <span class="ai-widget-close-icon">

      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        aria-hidden="true"
      >

        <path d="M18 6L6 18" />

        <path d="M6 6L18 18" />

      </svg>

    </span>
  `;

  // ============================================================
  // Create Button
  // ============================================================

  const button =
    document.createElement("button");

  button.type = "button";

  button.className =
    "ai-widget-button";

  button.setAttribute(
    "aria-label",
    "Open chat"
  );

  button.setAttribute(
    "title",
    "Open chat"
  );

  // ============================================================
  // Closed Button
  // ============================================================

  function setClosedButton() {
    button.innerHTML = robotIcon;
  }

  // ============================================================
  // Open Button
  // ============================================================

  function setOpenButton() {
    button.innerHTML = closeIcon;
  }

  // Initial icon
  setClosedButton();

  // ============================================================
  // Chat Iframe
  // ============================================================

  const iframe =
    document.createElement("iframe");

  iframe.src =
    `${CHATBOT_URL}/?clientKey=${encodeURIComponent(clientId)}`;

  iframe.title =
    "AI Chatbot";

  iframe.setAttribute(
    "allow",
    "microphone; clipboard-write"
  );

  iframe.setAttribute(
    "loading",
    "eager"
  );

  iframe.setAttribute(
    "referrerpolicy",
    "strict-origin-when-cross-origin"
  );

  // ============================================================
  // IMPORTANT SCROLL SETTINGS
  // ============================================================

  iframe.setAttribute(
    "scrolling",
    "yes"
  );

  // ============================================================
  // Iframe Style
  // ============================================================

  Object.assign(
    iframe.style,
    {
      position: "fixed",

      right:
        CONFIG.desktop.iframeRight,

      // Changed from bottom to top
      top:
        CONFIG.desktop.iframeTop,

      width:
        CONFIG.desktop.iframeWidth,

      height:
        CONFIG.desktop.iframeHeight,

      border: "0",

      borderRadius:
        CONFIG.desktop.borderRadius,

      background:
        "#0b0f17",

      boxShadow:
        "0 20px 60px rgba(0, 0, 0, 0.30)",

      zIndex:
        "999998",

      display:
        "none",

      overflow:
        "auto",

      overscrollBehavior:
        "contain",

      WebkitOverflowScrolling:
        "touch",

      margin:
        "0",

      padding:
        "0",
    }
  );

  // ============================================================
  // Add Elements
  // ============================================================

  document.body.appendChild(button);
  document.body.appendChild(iframe);

  // ============================================================
  // State
  // ============================================================

  let isOpen = false;

  // ============================================================
  // Toggle Chat
  // ============================================================

  function toggleChat() {
    isOpen = !isOpen;

    iframe.style.display =
      isOpen ? "block" : "none";

    button.classList.toggle(
      "ai-widget-open",
      isOpen
    );

    button.setAttribute(
      "aria-label",
      isOpen
        ? "Close chat"
        : "Open chat"
    );

    button.setAttribute(
      "title",
      isOpen
        ? "Close chat"
        : "Open chat"
    );

    if (isOpen) {
      setOpenButton();
    } else {
      setClosedButton();
    }

    updateResponsive();
  }

  // ============================================================
  // Button Click
  // ============================================================

  button.addEventListener(
    "click",
    toggleChat
  );

  // ============================================================
  // Responsive
  // ============================================================

  function updateResponsive() {
    const isMobile =
      window.innerWidth <= 600;

    if (isMobile) {

      Object.assign(
        iframe.style,
        {
          right:
            CONFIG.mobile.iframeRight,

          // Changed from bottom to top
          top:
            CONFIG.mobile.iframeTop,

          width:
            CONFIG.mobile.iframeWidth,

          height:
            CONFIG.mobile.iframeHeight,

          borderRadius:
            CONFIG.mobile.borderRadius,

          overflow:
            "auto",

          overscrollBehavior:
            "contain",

          WebkitOverflowScrolling:
            "touch",
        }
      );

      Object.assign(
        button.style,
        {
          right:
            CONFIG.mobile.buttonRight,

          bottom:
            CONFIG.mobile.buttonBottom,

          width:
            isOpen
              ? CONFIG.mobile.closeButtonSize
              : CONFIG.mobile.buttonSize,

          height:
            isOpen
              ? CONFIG.mobile.closeButtonSize
              : CONFIG.mobile.buttonSize,

          transition:
            "none",
        }
      );

    } else {

      Object.assign(
        iframe.style,
        {
          right:
            CONFIG.desktop.iframeRight,

          // Changed from bottom to top
          top:
            CONFIG.desktop.iframeTop,

          width:
            CONFIG.desktop.iframeWidth,

          height:
            CONFIG.desktop.iframeHeight,

          borderRadius:
            CONFIG.desktop.borderRadius,

          overflow:
            "auto",

          overscrollBehavior:
            "contain",

          WebkitOverflowScrolling:
            "touch",
        }
      );

      Object.assign(
        button.style,
        {
          right:
            CONFIG.desktop.buttonRight,

          bottom:
            CONFIG.desktop.buttonBottom,

          width:
            isOpen
              ? CONFIG.desktop.closeButtonSize
              : CONFIG.desktop.buttonSize,

          height:
            isOpen
              ? CONFIG.desktop.closeButtonSize
              : CONFIG.desktop.buttonSize,

          transition:
            "none",
        }
      );
    }
  }

  // ============================================================
  // Initial Responsive
  // ============================================================

  updateResponsive();

  // ============================================================
  // Resize
  // ============================================================

  let resizeTimeout;

  window.addEventListener(
    "resize",
    () => {

      clearTimeout(
        resizeTimeout
      );

      resizeTimeout =
        setTimeout(
          () => {
            updateResponsive();
          },
          100
        );
    }
  );

  // ============================================================
  // Escape Key
  // ============================================================

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        isOpen
      ) {
        toggleChat();
      }

    }
  );

})();