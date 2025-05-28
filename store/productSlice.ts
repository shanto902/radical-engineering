// store/productSlice.ts
import { TProduct } from "@/interfaces";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// ─── Async Thunk: Fetch All Products ─────────────────────────────
export const fetchProducts = createAsyncThunk<
  TProduct[],
  void,
  { rejectValue: string }
>("products/fetchProducts", async (_, thunkAPI) => {
  try {
    const response = await fetch("/api/products");
    const data = await response.json();
    return data as TProduct[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return thunkAPI.rejectWithValue("Failed to fetch products");
  }
});

// ─── State Types ─────────────────────────────────────────────────
interface ProductState {
  items: TProduct[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
};

// ─── Product Slice ───────────────────────────────────────────────
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<TProduct[]>) => {
          state.items = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.payload || "Unknown error";
        state.loading = false;
      });
  },
});

// ─── Exports ─────────────────────────────────────────────────────
export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;
