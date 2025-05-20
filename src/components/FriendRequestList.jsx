import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { User } from "lucide-react";

export const FriendRequestList = () => {
  const { friendRequests, respondToRequest } = useChatStore();

  useEffect(() => {
    useChatStore.getState().getFriendRequests();
  }, []);

  if (friendRequests.length === 0) return null;

  return (
    <div className="border-t border-base-300 pt-4 mt-4">
      <h3 className="font-medium flex items-center gap-2 mb-3">
        <User className="size-5" />
        Friend Requests
      </h3>
      <ul className="space-y-2">
        {friendRequests.map((request) => (
          <li
            key={request._id}
            className="flex items-center justify-between p-2 bg-base-200 rounded"
          >
            <div className="flex items-center gap-2">
              <img
                src={request.sender.profilePic || "/avatar.png"}
                alt={request.sender.fullName}
                className="size-8 rounded-full"
              />
              <span>{request.sender.fullName}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => respondToRequest(request._id, "accept")}
                className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={() => respondToRequest(request._id, "reject")}
                className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};