// Actions
export const ADD_TO_WISHLIST = 'ADD_TO_WISHLIST';
export const REMOVE_FROM_WISHLIST = 'REMOVE_FROM_WISHLIST';

// Action Creators
export const addToWishList = payload => {
  return {
    type: ADD_TO_WISHLIST,
    payload,
  };
};

export const removeFromWishList = payload => {
  return {
    type: REMOVE_FROM_WISHLIST,
    payload,
  };
};

export const wishlist = {
  [ADD_TO_WISHLIST] (previousState = [], payload) {
    return [...previousState, payload];
  },
  [REMOVE_FROM_WISHLIST] (previousState = [], payload) {
    return previousState.filter(product => product.id !== payload.id);
  },
};
