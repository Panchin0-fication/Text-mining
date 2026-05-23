export type Dictionary = { [key: string]: number };
export type OneHot = { [key: string]: number[] };
export type Pairs = string[]; //Just two values per pair
export type Tokens = string[];

export type checkResponse = {
  word_to_index: Dictionary;
  one_hot: OneHot;
  pairs: Pairs[];
  idf: Dictionary[];
  tokens: Tokens;
};
