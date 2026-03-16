import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

type CartItem = {
  slug: string;
  name: string;
  price: string;
  size: string;
  quantity: number;
  image?: string;
};

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{ slug: string; name: string; price: string; size: string; image?: string }>
    ) => {
      const { slug, size } = action.payload;
      const existing = state.items.find((item) => item.slug === slug && item.size === size);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    incrementQuantity: (state, action: PayloadAction<{ slug: string; size: string }>) => {
      const existing = state.items.find(
        (item) => item.slug === action.payload.slug && item.size === action.payload.size
      );
      if (existing) {
        existing.quantity += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<{ slug: string; size: string }>) => {
      const existing = state.items.find(
        (item) => item.slug === action.payload.slug && item.size === action.payload.size
      );
      if (!existing) return;
      if (existing.quantity > 1) {
        existing.quantity -= 1;
      } else {
        state.items = state.items.filter(
          (item) => !(item.slug === action.payload.slug && item.size === action.payload.size)
        );
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions;

export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
