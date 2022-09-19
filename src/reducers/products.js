// Actions
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT';

// Action Creators
export const addProduct = payload => {
  return {
    type: ADD_PRODUCT,
    payload,
  };
};

export const removeProduct = payload => {
  return {
    type: REMOVE_PRODUCT,
    payload,
  };
};

export const products = {
  [ADD_PRODUCT] (previousState = [], payload) {
    return [...previousState, payload];
  },
  [REMOVE_PRODUCT] (previousState = [], payload) {
    return previousState.filter(product => product.id !== payload.id);
  },
};
