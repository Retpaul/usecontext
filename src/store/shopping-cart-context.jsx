import { createContext, useReducer, useState } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  UpdateCartItemQuantity: () => {},
});
// UseReducer Function. Should be called outside component function so that it wil not be executed again when component is re-excecuted, 
function shoppingCartReducer(state, action) { //State is the guarantee latest snapshot of component
  if (action.type === "ADD_ITEM") {  // whenever function that has dispatch object property type as "ADD_ITEM" is called this code Runs
    const updatedItems = [...state.items];  // Copy items list so a not to make changes to original array

    const existingCartItemIndex = updatedItems.findIndex( // find indexof item whose id is equal to the id in action.payload
      (cartItem) => cartItem.id === action.payload
    );
    const existingCartItem = updatedItems[existingCartItemIndex]; //find item whose index if gotten from above

    if (existingCartItem) { //if item exist increase quantity instead of adding new item to cart
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem; // replace item whose index was gotten with the updated item
    } else {
      const product = DUMMY_PRODUCTS.find(
        (product) => product.id === action.payload // if product does not exist find product whose id is equal to id in action.payload
      );
      updatedItems.push({
        id: action.payload,
        name: product.title,
        price: product.price,
        quantity: 1,  // then add new item in array of items, item must contain these properties
      });
    }

    return {
      items: updatedItems, //update items to updated items
    };
  }

  if (action.type === 'UPDATE_ITEM'){
    const updatedItems = [...state.items];
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload.productId
    );

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };

    updatedItem.quantity += action.payload.amount;

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }

    return {
      items: updatedItems,
    };
  }
  return state;
}

export default function CartContextProvider({ children }) {
  const [shoppingCartState, shoppingCartDispatch] = useReducer( // like state it returns two values, one is the current state the othe is the dipatch action
    shoppingCartReducer,  // use reducer takes 1 or two arg, the usereducer function and the initial state value, mostly an object
    {
      items: [],
    }
  );

  // const [shoppingCart, setShoppingCart] = useState({
  //   items: [],
  // });

  function handleAddItemToCart(id) {
    shoppingCartDispatch({
      type: "ADD_ITEM",
      payload: id,
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: "UPDATE_ITEM",
      payload: {
        productId,
        amount,
      },
    });

   
  }

  const ctxValue = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart,
    UpdateCartItemQuantity: handleUpdateCartItemQuantity,
  };

  return (
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  );
}
