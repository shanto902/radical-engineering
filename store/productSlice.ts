import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TProduct } from "@/interfaces";

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

export const fetchProducts = createAsyncThunk<TProduct[], string | undefined>(
  "products/fetchProducts",
  async (categorySlug, thunkAPI) => {
    try {
      const res = await fetch(
        `/api/products${categorySlug ? `?category=${categorySlug}` : ""}`
      );
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue("Failed to fetch products");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<TProduct[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
