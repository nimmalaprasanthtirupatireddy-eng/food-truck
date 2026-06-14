import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  const addToCart = (item) => {
    const existing = cartItems.find((i) => i.id === item.id);

    if (existing) {
      setCartItems(
        cartItems.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          ...item,
          quantity: 1,
        },
      ]);
    }
  };

  const decreaseQuantity = (id) => {
    const existing = cartItems.find((i) => i.id === id);

    if (!existing) return;

    if (existing.quantity === 1) {
      setCartItems(cartItems.filter((i) => i.id !== id));
    } else {
      setCartItems(
        cartItems.map((i) =>
          i.id === id
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
      );
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getQuantity = (id) => {
    const item = cartItems.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,

        cartCount,
        total,

        isCartOpen,
        setIsCartOpen,

        isCheckoutOpen,
        setIsCheckoutOpen,

        successOrder,
        setSuccessOrder,

        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  return useContext(CartContext);
};

export default CartContext;