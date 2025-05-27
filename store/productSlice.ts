import { TProduct } from "@/interfaces";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// ─── Async Thunk ──────────────────────────────────────────────
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ categorySlug }: { categorySlug?: string }, thunkAPI) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const options: any = {
        fields: ["*", "category.*"],
      };

      if (categorySlug) {
        options.filter = {
          category: {
            slug: {
              _eq: categorySlug,
            },
          },
        };
      }

      const result = await directus.request(readItems("products", options));
      return result as TProduct[];
    } catch (error) {
      console.error("Error fetching products", error);
      return thunkAPI.rejectWithValue("Failed to fetch products");
    }
  }
);

// ─── Initial State ─────────────────────────────────────────────
interface ProductState {
  products: TProduct[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// ─── Product Slice ─────────────────────────────────────────────
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;
