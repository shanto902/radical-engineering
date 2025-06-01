// store/projectSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { TProject } from "@/interfaces";

interface ProjectState {
  items: TProject[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  items: [],
  loading: false,
  error: null,
};

// Thunk to fetch title and slug
export const fetchProjects = createAsyncThunk("projects/fetch", async () => {
  const res = await fetch("/api/projects");
  if (!res.ok) throw new Error("Failed to fetch projects");
  return (await res.json()) as TProject[];
});

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default projectSlice.reducer;
