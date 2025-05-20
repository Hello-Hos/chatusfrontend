import { useState } from "react";
import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleAvatarClick = () => setIsPreviewOpen(true);
  const closePreview = () => setIsPreviewOpen(false);

  return (
    <div className="p-2.5 border-b border-base-300 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar cursor-pointer" onClick={handleAvatarClick}>
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} className="rounded-full" />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>

      {/* Avatar Preview Modal */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
          onClick={closePreview} // Clicking outside closes the preview
        >
          <div className="p-2 bg-white rounded-full shadow-lg">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
              className="w-60 h-60 rounded-full object-cover border border-gray-300"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
