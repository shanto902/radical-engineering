import { TNotification } from "@/interfaces";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export const fetchNotifications = createAsyncThunk<TNotification[]>(
  "notifications/fetch",
  async () => {
    const res = await fetch("/api/notifications");
    const data = await res.json();
    return data.notifications;
  }
);

interface NotificationState {
  notifications: TNotification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    recalculateUnread: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    addNotification: (state, action: PayloadAction<TNotification>) => {
      const exists = state.notifications.some(
        (n) => n.id === action.payload.id
      );
      if (!exists) {
        state.notifications.unshift(action.payload);
        state.unreadCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.notifications = action.payload;
    });
  },
});

export const { recalculateUnread, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
