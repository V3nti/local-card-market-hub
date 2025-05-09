
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { NumberInput } from "@/components/ui/number-input";
import { CardAutoComplete } from "@/components/ui/card-autocomplete";
import { ConditionSlider } from "@/components/ui/condition-slider";
import { MtgCard, PokemonCard, YuGiOhCard } from "@/types/card-types";

// Create a types file for card-related types
<lov-write file_path="src/types/card-types.ts">
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

export type CardData = MtgCard | PokemonCard | YuGiOhCard;

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

export interface GradingSubCategories {
  centering?: string;
  corners?: string;
  edges?: string;
  surface?: string;
}

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
  color?: string;
  cost?: string;
  class?: string;
  pitValue?: string;
  gradingSubCategories?: GradingSubCategories;
}

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

export interface PrintingOption {
  label: string;
  value: string;
  image?: string;
}
