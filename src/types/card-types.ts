
// Card interfaces for different TCG types
export interface MtgCard {
  name: string;
  rarity?: string;
  color_identity?: string[];
  type_line?: string;
  mana_cost?: string;
  image_uris?: {
    normal?: string;
    small?: string;
  };
  card_faces?: Array<{
    image_uris?: {
      normal?: string;
      small?: string;
    };
  }>;
  set?: string;
  set_name?: string;
}

export interface PokemonCard {
  name: string;
  rarity?: string;
  types?: string[];
  hp?: string;
  subtypes?: string[];
  images?: {
    small?: string;
    large?: string;
  };
  set?: {
    name?: string;
  };
}

export interface YuGiOhCard {
  name: string;
  type?: string;
  race?: string;
  attribute?: string;
  level?: number;
  card_sets?: Array<{
    set_name?: string;
    set_rarity?: string;
  }>;
  card_images?: Array<{
    image_url?: string;
  }>;
}

// Union type for all card types
export type CardData = {
  id?: string;
  name: string;
  rarity?: string;
  image?: string;
  condition?: string;
  price?: number;
  seller?: string;
  description?: string;
  distance?: number;
  location?: string;
  grading?: string;
  type?: string;
};

// Form data for adding new cards
export interface CardFormData {
  name: string;
  tcgType: string;
  rarity: string;
  condition: string;
  description: string;
  copies: string;
  isGraded: boolean;
  gradingCompany: string;
  grade: string;
  language: string;
  isFoil: boolean;
}

// TCG specific data that changes based on card type
export interface TcgSpecificData {
  colorIdentity?: string;
  cardType?: string;
  manaCost?: string;
  pokemonType?: string;
  hp?: string;
  stage?: string;
  monsterType?: string;
  attribute?: string;
  level?: string;
}

// Market listing type for card sales
export interface CardListing {
  id: string;
  name: string;
  type: string;
  condition: string;
  grading?: string;
  price: number;
  seller: string;
  description: string;
  image: string;
  distance: number;
  location: string;
}
