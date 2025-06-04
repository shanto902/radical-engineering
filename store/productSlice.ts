import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { TProduct } from "@/interfaces";

// ─── Types ────────────────────────────────────────────────────────────────
interface ProductState {
  itemsByCategory: {
    [slug: string]: TProduct[];
  };
  loading: boolean;
  error: string | null;
  loadedSlugs: string[]; // ✅ NEW
}

// ─── Initial State ────────────────────────────────────────────────────────
const initialState: ProductState = {
  itemsByCategory: {},
  loading: false,
  error: null,
  loadedSlugs: [], // ✅ NEW
};

// ─── Async Thunk for Fetching Products ────────────────────────────────────
export const fetchProducts = createAsyncThunk<
  { slug: string; products: TProduct[] },
  string | undefined
>("products/fetchProducts", async (slug, thunkAPI) => {
  try {
    const url = slug ? `/api/products?category=${slug}` : `/api/products`;
    const res = await fetch(url);
    const data = await res.json();
    return { slug: slug || "all", products: data };
  } catch (err) {
    return thunkAPI.rejectWithValue(`Failed to fetch products, Error: ${err}`);
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      const slug = action.payload.slug || "all";
      state.itemsByCategory[slug] = action.payload.products;
      if (!state.loadedSlugs.includes(slug)) {
        state.loadedSlugs.push(slug); // ✅ track loaded slugs
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { slug, products } = action.payload;
        state.itemsByCategory[slug] = products;
        if (!state.loadedSlugs.includes(slug)) {
          state.loadedSlugs.push(slug); // ✅ Mark as loaded
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ─── Exports ──────────────────────────────────────────────────────────────
export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
