import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      
      addToCart: (item) => {
        set((state) => {
          const existingItem = state.cartItems.find(
            (i) => i.product === item.product && i.variantId === item.variantId
          );

          if (existingItem) {
            return {
              cartItems: state.cartItems.map((i) =>
                i.product === item.product && i.variantId === item.variantId
                  ? { ...i, qty: i.qty + item.qty }
                  : i
              ),
            };
          } else {
            return { cartItems: [...state.cartItems, item] };
          }
        });
      },

      removeFromCart: (productId, variantId) => {
        set((state) => ({
          cartItems: state.cartItems.filter(
            (i) => !(i.product === productId && i.variantId === variantId)
          ),
        }));
      },

      updateQuantity: (productId, variantId, qty) => {
        set((state) => ({
          cartItems: state.cartItems.map((i) =>
            i.product === productId && i.variantId === variantId
              ? { ...i, qty }
              : i
          ),
        }));
      },

      clearCart: () => set({ cartItems: [] }),

      getCartTotal: () => {
        return get().cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);
