import { gql } from "apollo-boost";

import { addItemToCart } from "./cart.utils";

export const typeDefs = gql`
  extend type Item {
    quantity: Int
  }
  extend type Mutation {
    ToggleCartHidden: Boolean!
    AddItemToCart(item: Item): [Item]!
  }
`;

const GET_CARD_HIDDEN = gql`
  {
    cartHidden @client
  }
`;

const GET_CARD_ITEMS = gql`
  {
    cartItems @client
  }
`;

export const resolvers = {
  Mutation: {
    toggleCartHidden: (_root, _args, { cache }, _info) => {
      const { cartHidden } = cache.readQuery({
        query: GET_CARD_HIDDEN,
      });
      cache.writeQuery({
        query: GET_CARD_HIDDEN,
        data: { cartHidden: !cartHidden },
      });
      return !cartHidden;
    },
    addItemToCart: (_root, { item }, { cache }) => {
      const { cartItems } = cache.readQuery({
        query: GET_CARD_ITEMS,
      });

      const newCartItems = addItemToCart(cartItems, item);
      cache.writeQuery({
        query: GET_CARD_ITEMS,
        data: { cartItems: newCartItems },
      });
      return newCartItems;
    },
  },
};
