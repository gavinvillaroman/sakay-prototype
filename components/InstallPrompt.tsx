"use client";
import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISSED_KEY = "sakay-install-dismissed";

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(DISMISSED_KEY)) return;

    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as unknown as { standalone?: boolean }).standalone;
    if (standalone) return;

    const onBefore = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBefore);
    return () => window.removeEventListener("beforeinstallprompt", onBefore);
  }, []);

  if (!visible) return null;

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setVisible(false);
    setDeferred(null);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+64px)] md:bottom-4 md:left-auto md:right-4 md:w-[360px] z-40">
      <div className="bg-black text-white rounded-2xl shadow-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-lg">
          S
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold tracking-tight">Install Sakay</div>
          <div className="text-[12px] text-gray-300">Add to your home screen for the full app.</div>
        </div>
        <button
          onClick={install}
          className="bg-white text-black rounded-full text-[13px] font-medium px-3 py-1.5 flex items-center gap-1 hover:bg-gray-100"
        >
          <Download size={13} /> Install
        </button>
        <button
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="text-gray-400 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
