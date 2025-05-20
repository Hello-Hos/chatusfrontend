import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  friendRequests: [],
  friends: [],
  isFriendsLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const [usersRes, friendsRes] = await Promise.all([
        axiosInstance.get("/messages/users"),
        axiosInstance.get("/friends"),
      ]);
      set({
        users: usersRes.data,
        friends: friendsRes.data.friends,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getFriendRequests: async () => {
    try {
      const res = await axiosInstance.get("/friends/pending");
      set({ friendRequests: res.data.requests });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load requests");
    }
  },

  getFriends: async () => {
    set({ isFriendsLoading: true });
    try {
      const res = await axiosInstance.get("/friends");
      set({ friends: res.data.friends });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load friends");
    } finally {
      set({ isFriendsLoading: false });
    }
  },

  sendFriendRequest: async (receiverId) => {
    const senderId = useAuthStore.getState().user?._id;

    if (!receiverId) {
      toast.error("Invalid user selected");
      return;
    }

    if (receiverId === senderId) {
      toast.error("You cannot send a friend request to yourself");
      return;
    }

    try {
      const res = await axiosInstance.post(`/friends/send/${receiverId}`);

      // backend returns the friend request object directly
      set((state) => ({
        friendRequests: [...state.friendRequests, res.data],
      }));

      toast.success("Friend request sent!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
      throw error;
    }
  },

  respondToRequest: async (requestId, action) => {
    try {
      const res = await axiosInstance.put(`/friends/${action}/${requestId}`);
      set((state) => ({
        friendRequests: state.friendRequests.filter((req) => req._id !== requestId),
      }));
      if (action === "accept") {
        set((state) => ({
          friends: [...state.friends, res.data],
        }));
      }
      toast.success(`Request ${action}ed!`);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process request");
      throw error;
    }
  },
}));
