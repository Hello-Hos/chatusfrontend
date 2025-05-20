import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Check, Palette, MessageCircle, Settings as SettingsIcon, Sun, Moon } from "lucide-react";
import { useState } from "react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! What's up", isSent: false },
  { id: 2, content: "I'm doing great! How about you?", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    setTheme(newTheme);
    setSelectedTheme(newTheme);
  };

  return (
    <div className="h-screen bg-base-100">
      {/* Header */}
      <div className="bg-base-200 p-6 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
          <button
            className="p-2 rounded-lg bg-base-300 hover:bg-base-400 transition-all"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-96px)]">
        {/* Left Part - Theme Selection (Scrollable) */}
        <div className="bg-base-200 rounded-xl shadow-lg p-6 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Choose a Theme</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {THEMES.map((t) => (
              <button
                key={t}
                className={`
                  group flex flex-col items-center gap-2 p-4 rounded-xl transition-all
                  ${
                    selectedTheme === t
                      ? "bg-primary/10 border-2 border-primary"
                      : "bg-base-100 hover:bg-base-300"
                  }
                `}
                onClick={() => {
                  setSelectedTheme(t);
                  setTheme(t);
                }}
              >
                <div
                  className="relative h-16 w-full rounded-lg overflow-hidden shadow-sm"
                  data-theme={t}
                >
                  <div className="absolute inset-0 grid grid-cols-2 gap-px p-1">
                    <div className="rounded bg-primary"></div>
                    <div className="rounded bg-secondary"></div>
                    <div className="rounded bg-accent"></div>
                    <div className="rounded bg-neutral"></div>
                  </div>
                </div>
                <span className="text-sm font-medium truncate w-full text-center">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
                {selectedTheme === t && (
                  <div className="absolute top-2 right-2 p-1 bg-primary rounded-full text-white">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Part - Chat Preview (Non-Scrollable on PC) */}
        <div className="bg-base-200 rounded-xl shadow-lg p-6 hidden lg:block">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Chat Preview</h2>
          </div>
          <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-sm">
            <div className="p-6">
              {/* Chat Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                    U
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">User01</h3>
                    <p className="text-sm text-base-content/70">Online</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4">
                {PREVIEW_MESSAGES.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`
                        max-w-[80%] rounded-xl p-3 shadow-sm transition-all
                        ${
                          message.isSent
                            ? "bg-primary text-primary-content"
                            : "bg-base-200"
                        }
                        ${message.isSent ? "hover:scale-105" : "hover:scale-105"}
                      `}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`
                          text-[10px] mt-1.5
                          ${
                            message.isSent
                              ? "text-primary-content/70"
                              : "text-base-content/70"
                          }
                        `}
                      >
                        12:00 PM
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="mt-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input input-bordered flex-1 text-sm h-12"
                    placeholder="Type a message..."
                    value="This is a preview"
                    readOnly
                  />
                  <button className="btn btn-primary h-12 min-h-0">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;