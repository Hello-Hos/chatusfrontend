import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, UserPlus } from "lucide-react";
import { FriendRequestList } from "./FriendRequestList";
import FriendRequestButton from "./FriendRequestButton";

const Sidebar = () => {
  const {
    getUsers,
    users = [],
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    friendRequests,
  } = useChatStore();

  const { onlineUsers = [] } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRequestPopupOpen, setIsRequestPopupOpen] = useState(false);

  useEffect(() => {
    getUsers();
    useChatStore.getState().getFriendRequests();

    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getUsers]);

  // Filter users
  let filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (searchTerm.trim() !== "") {
    filteredUsers = filteredUsers.filter((user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (isMobile && selectedUser) return null;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <>
      <aside
        className={`fixed lg:static top-0 left-0 z-40 h-full w-full lg:w-72 bg-base-100 border-r border-base-300 flex flex-col transition-all duration-200 mt-16 lg:mt-0`}
      >
        {/* Header */}
        <div className="border-b border-base-300 w-full p-5">
          <div className={`flex items-center gap-2 ${isMobile ? "flex-row" : ""}`}>
            <Users className="size-6" />
            {!isMobile && <span className="font-medium hidden lg:block">Contacts</span>}

            {isMobile && (
              <input
                type="text"
                placeholder="Search user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-sm input-bordered flex-grow max-w-[calc(100%-80px)]"
              />
            )}

            {/* Friend Request Icon with Badge and Custom Tooltip */}
            <div className="relative group ml-auto">
              <button
                onClick={() => setIsRequestPopupOpen(true)}
                className="btn btn-ghost btn-sm relative"
                aria-label="Show Friend Requests"
              >
                <UserPlus className="size-6 text-primary" />
                {friendRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {friendRequests.length}
                  </span>
                )}
              </button>
              {/* Custom tooltip */}
              <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                Friend Requests
              </span>
            </div>
          </div>

          {/* Desktop checkbox */}
          <div className="mt-3 hidden lg:flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm"
              />
              <span className="text-sm">Show online only</span>
            </label>
            <span className="text-xs text-zinc-500">
              ({Math.max(onlineUsers.length - 1, 0)} online)
            </span>
          </div>
        </div>

        {/* User List */}
        <div className="overflow-y-auto w-full py-3 px-2">
          {filteredUsers.length === 0 && (
            <div className="text-center text-zinc-500 py-4">No Users Found</div>
          )}

          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`flex items-center justify-between w-full gap-3 p-3 rounded-md hover:bg-base-300 transition-colors ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }`}
            >
              <button
                onClick={() => setSelectedUser(user)}
                className="flex items-center gap-3 flex-1 text-left"
              >
                <div className="relative">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.name}
                    className="size-10 object-cover rounded-full"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="font-medium text-sm truncate">{user.fullName}</div>
                  <div className="text-xs text-zinc-400">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              </button>

              <div className="self-start">
                <FriendRequestButton userId={user._id} />
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Friend Request Popup Modal */}
      {isRequestPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-md p-5 relative">
            <button
              onClick={() => setIsRequestPopupOpen(false)}
              className="absolute top-3 right-3 btn btn-circle btn-ghost"
              aria-label="Close Friend Requests"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4">Pending Friend Requests</h2>
            <FriendRequestList />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
