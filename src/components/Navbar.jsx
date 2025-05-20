import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { LogOut, Settings, Download, ChevronDown, User } from "lucide-react";

const Navbar = ({ installPrompt, handleInstallClick }) => {
  const { logout, authUser } = useAuthStore();
  const { theme } = useThemeStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Determine if the login button should be visible
  const shouldShowLoginButton = !authUser;

  return (
    <header
      className={`fixed w-full top-0 z-40 backdrop-blur-lg border-b ${
        theme === "dark"
          ? "bg-black/80 border-gray-700 text-white"
          : "bg-white/80 border-gray-300 text-black"
      }`}
    >
      <div className="container mx-auto h-16 flex items-center justify-between px-4">
        {/* Logo Section */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-all"
        >
          <div
            className={`size-9 rounded-lg flex items-center justify-center ${
              theme === "dark" ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="w-16 h-10"
            />
          </div>
          <h1
            className={`text-xl font-bold ${
              theme === "dark" ? "text-primary" : "text-primary"
            }`}
          >
            ChatUs
            {authUser?.fullName && (
              <span className="ml-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text font-bold text-xl animate-gradient bg-[length:200%_auto] hover:bg-[length:100%_auto] transition-all duration-500">
                , {authUser.fullName}
              </span>
            )}
          </h1>
        </Link>

        {/* Actions Section */}
        <div className="flex items-center gap-3">
          {/* Install Button */}
          {installPrompt && (
            <button
              className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
                theme === "dark"
                  ? "hover:bg-gray-700 hover:shadow-lg"
                  : "hover:bg-gray-200 hover:shadow-lg"
              }`}
              onClick={handleInstallClick}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Install</span>
            </button>
          )}

          {/* Login Button (Visible only when not logged in) */}
          {shouldShowLoginButton && (
            <Link
              to="/login"
              className={`flex items-center rounded-lg px-5 py-2 transition-all ${
                theme === "dark"
                  ? "hover:bg-gray-700 hover:shadow-lg"
                  : "hover:bg-gray-200 hover:shadow-lg"
              } ${
                location.pathname === "/login" || location.pathname === "/signup"
                  ? theme === "dark"
                    ? "border border-gray-500 bg-gray-700" 
                    : "border border-gray-300 bg-gray-100" 
                  : ""
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline"></span>
            </Link>
          )}

          {/* Settings Button (Visible only when logged out) */}
          {!authUser && (
            <Link
              to="/settings"
              className={`flex items-center rounded-lg px-5 py-2 transition-all ${
                theme === "dark"
                  ? "hover:bg-gray-700 hover:shadow-lg"
                  : "hover:bg-gray-200 hover:shadow-lg"
              } ${
                location.pathname === "/settings"
                  ? theme === "dark"
                    ? "border border-gray-500 bg-gray-700" 
                    : "border border-gray-300 bg-gray-100" 
                  : ""
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline"></span>
            </Link>
          )}

          {/* Dropdown Menu (Visible only when logged in) */}
          {authUser && (
            <div className="relative" ref={dropdownRef}>
              <button
                className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
                  theme === "dark"
                    ? "hover:bg-gray-700 hover:shadow-lg"
                    : "hover:bg-gray-200 hover:shadow-lg"
                }`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {/* User's Profile Picture */}
                {authUser?.profilePic ? (
                  <img
                    src={authUser.profilePic}
                    alt="Profile"
                    className="size-8 rounded-full object-cover border-2 border-purple-400"
                  />
                ) : (
                  <div className="size-8 rounded-full bg-purple-400 flex items-center justify-center">
                    <span className="text-white text-sm">
                      {authUser.fullName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="hidden sm:inline">{authUser.username}</span>
                <ChevronDown className="size-4" />
              </button>

              {/* Dropdown Content */}
              {isDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${
                    theme === "dark"
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  {/* Profile */}
                  <Link
                    to="/profile"
                    className={`block px-4 py-2 text-sm transition-all ${
                      theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {authUser?.profilePic ? (
                      <img
                        src={authUser.profilePic}
                        alt="Profile"
                        className="inline-block size-4 rounded-full mr-2"
                      />
                    ) : (
                      <div className="inline-block size-4 rounded-full bg-purple-400 flex items-center justify-center mr-2">
                        <span className="text-white text-xs">
                          {authUser.fullName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    Profile
                  </Link>

                  {/* Settings */}
                  <Link
                    to="/settings"
                    className={`block px-4 py-2 text-sm transition-all ${
                      theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Settings className="inline-block w-4 h-4 mr-2" />
                    Settings
                  </Link>

                  {/* Logout */}
                  <button
                    className={`w-full text-left px-4 py-2 text-sm transition-all ${
                      theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                  >
                    <LogOut className="inline-block w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;