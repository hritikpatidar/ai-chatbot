// (function () {
//   const currentScript = document.currentScript;

//   if (!currentScript) {
//     console.error("AI Chatbot: script not found");
//     return;
//   }

//   const clientId = currentScript.getAttribute("data-client-id");

//   if (!clientId) {
//     console.error(
//       "AI Chatbot: data-client-id is required"
//     );
//     return;
//   }

//   const CHATBOT_URL = "https://my-ai-chatbot-project.vercel.app";

//   // -----------------------------
//   // Chat Button
//   // -----------------------------

//   const button = document.createElement("button");

//   button.innerHTML = "💬";

//   button.style.position = "fixed";
//   button.style.right = "24px";
//   button.style.bottom = "24px";
//   button.style.width = "60px";
//   button.style.height = "60px";
//   button.style.borderRadius = "50%";
//   button.style.border = "none";
//   button.style.background = "#2563eb";
//   button.style.color = "#fff";
//   button.style.fontSize = "24px";
//   button.style.cursor = "pointer";
//   button.style.zIndex = "999999";

//   // -----------------------------
//   // Chat iframe
//   // -----------------------------

//   const iframe = document.createElement("iframe");

//   iframe.src =
//     CHATBOT_URL +
//     "/?clientKey=" +
//     encodeURIComponent(clientId);

//   iframe.style.position = "fixed";
//   iframe.style.right = "24px";
//   iframe.style.bottom = "95px";
//   iframe.style.width = "400px";
//   iframe.style.height = "650px";
//   iframe.style.border = "none";
//   iframe.style.borderRadius = "16px";
//   iframe.style.boxShadow =
//     "0 10px 40px rgba(0,0,0,0.25)";
//   iframe.style.zIndex = "999998";
//   iframe.style.display = "none";
//   iframe.style.background = "#fff";

//   // -----------------------------
//   // Append
//   // -----------------------------

//   document.body.appendChild(button);
//   document.body.appendChild(iframe);

//   // -----------------------------
//   // Toggle chatbot
//   // -----------------------------

//   let isOpen = false;

//   button.addEventListener("click", function () {
//     isOpen = !isOpen;

//     if (isOpen) {
//       iframe.style.display = "block";
//       button.innerHTML = "✕";
//     } else {
//       iframe.style.display = "none";
//       button.innerHTML = "💬";
//     }
//   });

//   // -----------------------------
//   // Responsive
//   // -----------------------------

//   function handleResize() {
//     if (window.innerWidth <= 600) {
//       iframe.style.right = "10px";
//       iframe.style.bottom = "85px";
//       iframe.style.width = "calc(100vw - 20px)";
//       iframe.style.height = "calc(100vh - 110px)";
//     } else {
//       iframe.style.right = "24px";
//       iframe.style.bottom = "95px";
//       iframe.style.width = "400px";
//       iframe.style.height = "650px";
//     }
//   }

//   handleResize();

//   window.addEventListener("resize", handleResize);
// })();

(function () {
  console.log("🔥 AI CHATBOT WIDGET LOADED");

  const script = document.currentScript;

  if (!script) {
    console.error("❌ Current script not found");
    return;
  }

  const clientId = script.getAttribute("data-client-id");

  console.log("Client ID:", clientId);

  if (!clientId) {
    console.error("❌ data-client-id missing");
    return;
  }

  const button = document.createElement("button");

  button.innerHTML = "💬";

  button.style.position = "fixed";
  button.style.right = "24px";
  button.style.bottom = "24px";

  button.style.width = "60px";
  button.style.height = "60px";

  button.style.border = "none";
  button.style.borderRadius = "50%";

  button.style.backgroundColor = "#2563eb";
  button.style.color = "white";

  button.style.fontSize = "28px";
  button.style.cursor = "pointer";

  button.style.zIndex = "999999";

  document.body.appendChild(button);

  console.log("✅ Chatbot button added");
})();