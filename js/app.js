// app.js - tab router, progress helpers, chat widget
import { journalTab, subjectTab } from "./journal.js";
import { licenseTab }    from "./license.js";
import { repositoryTab } from "./repository.js";

const API_BASE = "https://mohithnikesh-researchpilot.hf.space";

// ── Mode switcher ──────────────────────────────────────────────────────────
function switchMode(mode) {
  document.querySelectorAll(".mode-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.mode === mode);
  });
  const subjectEl    = document.getElementById("mode-subject");
  const manuscriptEl = document.getElementById("mode-manuscript");
  if (subjectEl)    subjectEl.style.display    = mode === "subject"    ? "block" : "none";
  if (manuscriptEl) manuscriptEl.style.display = mode === "manuscript" ? "block" : "none";
}
window.switchMode = switchMode;

// ── Tab routing ────────────────────────────────────────────────────────────
function activateTab(target) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach(p => {
    p.classList.remove("active");
    p.style.display = "none";
  });
  const btn = document.querySelector(`.tab-btn[data-tab="${target}"]`);
  if (btn) btn.classList.add("active");
  const panel = document.getElementById(`tab-${target}`);
  if (panel) { panel.classList.add("active"); panel.style.display = "block"; }
}
window.activateTab = activateTab;

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => activateTab(btn.dataset.tab));
});
activateTab("journals");

// ── Language selector ──────────────────────────────────────────────────────
// ── Progress helpers ───────────────────────────────────────────────────────
export function showProgress(containerId, steps) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  wrap.innerHTML = steps.map(s =>
    `<div class="p-step"><span class="p-dot"></span><span>${s}</span></div>`
  ).join("");
  wrap.classList.add("show");
  setStep(containerId, 0);
}

export function setStep(containerId, idx) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  wrap.querySelectorAll(".p-step").forEach((el, i) => {
    el.classList.remove("active", "done");
    if (i < idx)  el.classList.add("done");
    if (i === idx) el.classList.add("active");
  });
}

export function doneProgress(containerId, message) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  wrap.querySelectorAll(".p-step").forEach(el => {
    el.classList.remove("active"); el.classList.add("done");
  });
  if (message) {
    const el = document.createElement("div");
    el.className = "p-step done";
    el.style.cssText = "margin-top:6px;font-weight:600";
    el.innerHTML = `<span class="p-dot"></span><span>${message}</span>`;
    wrap.appendChild(el);
  }
}

export function hideProgress(containerId) {
  document.getElementById(containerId)?.classList.remove("show");
}

// ── Clipboard helper ───────────────────────────────────────────────────────
window.copyToClipboard = function(text, el) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = el.innerHTML;
    el.innerHTML = "Copied!";
    setTimeout(() => { el.innerHTML = orig; }, 1500);
  });
};

// ── Chat widget ────────────────────────────────────────────────────────────
(function initChat() {
  const MAX_HIST = 20;
  const API_BASE_CHAT = "https://mohithnikesh-researchpilot.hf.space";

  const WELCOME = "👋 Hi! I'm ResearchPilot — your AI publishing assistant for UW-Madison researchers.\n\nYou can go directly to the tabs above to find journals, check self-archiving rights, or find a data repository — or ask me anything here and I'll guide you.";

  const EXAMPLE_CHIPS = [
    "Find me a journal",
    "Can I self-archive my publication?",
    "Where do I deposit my dataset?",
  ];

  const TAB_META = {
    journals: { emoji: "📰", label: "Open Journal Submission tool", color: "#1a2744" },
    license:  { emoji: "🛡️", label: "Open License Checker",         color: "#059669" },
    data:     { emoji: "🗄️", label: "Open Data Repository tool",    color: "#d97706" },
  };

  let isOpen = false, isTyping = false, history = [], welcomeShown = false, chipsShown = false;

  const panel    = document.getElementById("rb-chat-panel");
  const launcher = document.getElementById("rb-chat-launcher");
  const closeBtn = document.getElementById("rb-chat-close");
  const msgs     = document.getElementById("rb-chat-messages");
  const input    = document.getElementById("rb-chat-input");
  const sendBtn  = document.getElementById("rb-chat-send");
  const badge    = document.getElementById("rb-chat-badge");
  const tooltip  = document.getElementById("rb-chat-tooltip");

  if (!panel || !launcher) return;

  function getLang() {
    return "english";
  }

  function esc(str) {
    return String(str || "")
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  function scrollBottom() { msgs.scrollTop = msgs.scrollHeight; }

  function addMessage(role, text) {
    const wrap   = document.createElement("div");
    wrap.className = `rb-msg ${role}`;
    const bubble = document.createElement("div");
    bubble.className = "rb-bubble";
    bubble.innerHTML = esc(text)
      .replace(/\n/g, "<br>")
      .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    wrap.appendChild(bubble);
    msgs.appendChild(wrap);
    scrollBottom();
    return bubble;
  }

  function addRouteCTA(route, prefill) {
    const meta = TAB_META[route];
    if (!meta) return;
    const wrap = document.createElement("div");
    wrap.className = "rb-msg assistant";
    const btn = document.createElement("button");
    btn.className = "rb-route-btn";
    btn.style.background = meta.color;
    btn.innerHTML = `${meta.emoji} ${meta.label} →`;
    btn.addEventListener("click", () => {
      closePanel();
      activateTabAndPrefill(route, prefill || {});
    });
    wrap.appendChild(btn);
    msgs.appendChild(wrap);
    scrollBottom();
  }

  function activateTabAndPrefill(route, prefill) {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => {
      p.classList.remove("active"); p.style.display = "none";
    });
    const tabBtn = document.querySelector(`.tab-btn[data-tab="${route}"]`);
    if (tabBtn) tabBtn.classList.add("active");
    const tabPanel = document.getElementById(`tab-${route}`);
    if (tabPanel) { tabPanel.classList.add("active"); tabPanel.style.display = "block"; }

    const FIELD_MAP = {
      journals: { title: "j-title", abstract: "j-abstract", keywords: "j-keywords", discipline: "j-discipline", subject: "s-subject" },
      license:  { journal_name: "l-journal", issn: "l-issn", publisher: "l-publisher" },
      data:     { title: "r-title", discipline: "r-discipline", data_types: "r-datatypes" },
    };
    const map = FIELD_MAP[route] || {};
    Object.entries(prefill || {}).forEach(([key, value]) => {
      const elId = map[key];
      if (!elId || !value) return;
      const el = document.getElementById(elId);
      if (el) el.value = value;
    });

    if (route === "journals") {
      switchMode(prefill && prefill.subject ? "subject" : "manuscript");
    }

    document.querySelector(".tabs-bar")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showExampleChips() {
    if (chipsShown) return;
    chipsShown = true;
    document.getElementById("rb-chips-wrap")?.remove();

    const wrap = document.createElement("div");
    wrap.id = "rb-chips-wrap";
    wrap.className = "rb-chips-wrap";

    EXAMPLE_CHIPS.forEach(text => {
      const chip = document.createElement("button");
      chip.className = "rb-chip";
      chip.textContent = text;
      chip.addEventListener("click", () => {
        wrap.remove();
        sendMessage(text);
      });
      wrap.appendChild(chip);
    });

    const inputArea = panel.querySelector(".rb-chat-input-wrap");
    if (inputArea) panel.insertBefore(wrap, inputArea);
  }

  function removeChips() {
    document.getElementById("rb-chips-wrap")?.remove();
  }

  function openPanel() {
    isOpen = true;
    panel.classList.add("open");
    badge.classList.remove("visible");
    tooltip.classList.remove("show");
    input.focus();
    if (!welcomeShown) {
      welcomeShown = true;
      addMessage("assistant", WELCOME);
      showExampleChips();
    }
  }

  function closePanel() {
    isOpen = false;
    panel.classList.remove("open");
  }

  const mobileBar = document.getElementById("rb-mobile-chat-bar");
  launcher.addEventListener("click", () => isOpen ? closePanel() : openPanel());
  mobileBar?.addEventListener("click", () => isOpen ? closePanel() : openPanel());
  closeBtn.addEventListener("click", closePanel);
  document.addEventListener("click", (e) => {
    const clickedMobileBar = mobileBar && mobileBar.contains(e.target);
    if (isOpen && !panel.contains(e.target) && !launcher.contains(e.target) && !clickedMobileBar) {
      closePanel();
    }
  });

  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 100) + "px";
    sendBtn.disabled = !input.value.trim() || isTyping;
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) sendMessage(input.value.trim());
    }
  });

  sendBtn.addEventListener("click", () => sendMessage(input.value.trim()));

  async function sendMessage(text) {
    if (!text || isTyping) return;

    removeChips();

    input.value = "";
    input.style.height = "auto";
    sendBtn.disabled = true;
    isTyping = true;

    addMessage("user", text);
    history.push({ role: "user", content: text });
    if (history.length > MAX_HIST) history = history.slice(-MAX_HIST);

    const wrap   = document.createElement("div");
    wrap.className = "rb-msg assistant";
    const bubble = document.createElement("div");
    bubble.className = "rb-bubble";
    bubble.innerHTML = '<span class="rb-cursor">▌</span>';
    wrap.appendChild(bubble);
    msgs.appendChild(wrap);
    scrollBottom();

    let fullText = "";

    try {
      const res = await fetch(`${API_BASE_CHAT}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, language: getLang() }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let   buffer  = "";
      let   route   = null;
      let   prefill = {};

      while (true) {
        const { done, value } = await reader.read();
        if (value) buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const evt = JSON.parse(line.slice(6));
            if (evt.done) {
              route   = evt.route   || null;
              prefill = evt.prefill || {};
              if (evt.reply && evt.reply.trim()) fullText = evt.reply;
            } else if (evt.token) {
              fullText += evt.token;
            }
            bubble.innerHTML = esc(fullText).replace(/\n/g, "<br>")
              .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
              + (evt.done ? "" : '<span class="rb-cursor">▌</span>');
            scrollBottom();
          } catch (_) {}
        }

        if (done) {
          if (buffer.trim().startsWith("data: ")) {
            try {
              const evt = JSON.parse(buffer.trim().slice(6));
              if (evt.done) {
                route   = evt.route   || null;
                prefill = evt.prefill || {};
                if (evt.reply && evt.reply.trim()) fullText = evt.reply;
                bubble.innerHTML = esc(fullText).replace(/\n/g, "<br>")
                  .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
                scrollBottom();
              }
            } catch (_) {}
          }
          break;
        }
      }

      const cleanReply = fullText.trim();
      if (cleanReply) history.push({ role: "assistant", content: cleanReply });
      if (history.length > MAX_HIST) history = history.slice(-MAX_HIST);

      if (route && TAB_META[route]) {
        addRouteCTA(route, prefill);
      }

    } catch (err) {
      bubble.innerHTML = "⚠️ Something went wrong. Please try again in a moment.";
      console.error("[ResearchPilot chat]", err);
    }

    isTyping = false;
    sendBtn.disabled = !input.value.trim();
  }

  // Tooltip on first load
  setTimeout(() => {
    tooltip.classList.add("show");
    badge.classList.add("visible");
    setTimeout(() => tooltip.classList.remove("show"), 4000);
  }, 2500);

})();

// ── Init ───────────────────────────────────────────────────────────────────
journalTab();
subjectTab();
licenseTab();
repositoryTab();
