import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const FriendRequestButton = ({ userId }) => {
  const { authUser } = useAuthStore();
  const { friends = [], sendFriendRequest, getFriendRequests, getUsers } = useChatStore();
  const [loading, setLoading] = useState(false);

  if (!authUser || authUser._id === userId || friends.some(f => f._id === userId)) {
    return null;
  }

  const handleSendRequest = async () => {
    setLoading(true);
    try {
      await sendFriendRequest(userId);

      // Refresh data immediately (this triggers a rerender)
      await Promise.all([getFriendRequests(), getUsers()]);
    } catch (error) {
      console.error("Failed to send request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSendRequest}
      disabled={loading}
      className={`px-3 py-1 rounded-md text-sm transition ${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
      }`}
    >
      {loading ? "Sending..." : "Add Friend"}
    </button>
  );
};

export default FriendRequestButton;
