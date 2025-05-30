
import * as React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MtgCard, PokemonCard, YuGiOhCard } from "@/types/card-types";

// Union type for all card types
type CardData = MtgCard | PokemonCard | YuGiOhCard;

interface CardAutoCompleteProps {
  value?: string;
  onChange?: (value: string) => void;
  onSelect: (card: CardData) => void;
  tcgType: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

// API endpoints for card lookup
const API_ENDPOINTS: Record<string, string | null> = {
  "MTG": "https://api.scryfall.com/cards/autocomplete?q=",
  "Pokemon": "https://api.pokemontcg.io/v2/cards?q=name:",
  "Yu-Gi-Oh": "https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=",
  "One Piece": null, 
  "Flesh and Blood": null,
};

export function CardAutoComplete({
  value = "",
  onChange,
  onSelect,
  tcgType,
  className,
  placeholder = "Card name",
  disabled = false,
}: CardAutoCompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const minCharsToSearch = 3;

  // Update internal state if prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!inputValue || inputValue.length < minCharsToSearch || !API_ENDPOINTS[tcgType]) {
        setSuggestions([]);
        return;
      }
      
      setLoading(true);
      
      try {
        const endpoint = API_ENDPOINTS[tcgType];
        
        if (!endpoint) {
          setSuggestions([]);
          return;
        }
        
        if (tcgType === "MTG") {
          const response = await fetch(`${endpoint}${encodeURIComponent(inputValue)}`);
          const data: { data?: string[] } = await response.json();
          setSuggestions(data.data || []);
        } 
        else if (tcgType === "Pokemon") {
          const response = await fetch(`${endpoint}${encodeURIComponent(inputValue)}*`);
          const data: { data?: PokemonCard[] } = await response.json();
          const names = data.data?.map((card) => card.name) || [];
          setSuggestions(names);
        }
        else if (tcgType === "Yu-Gi-Oh") {
          const response = await fetch(`${endpoint}${encodeURIComponent(inputValue)}`);
          const data: { data?: YuGiOhCard[] } = await response.json();
          if (data.data) {
            // Get unique card names
            const uniqueNames = Array.from(
              new Set(data.data.map((card) => card.name))
            ) as string[];
            setSuggestions(uniqueNames);
          } else {
            setSuggestions([]);
          }
        }
        
        setIsOpen(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce the API call
    const timerId = setTimeout(() => {
      fetchSuggestions();
    }, 300);
    
    return () => clearTimeout(timerId);
  }, [inputValue, tcgType]);
  
  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    handleInputChange(suggestion);
    setIsOpen(false);
    
    // Fetch full card data
    const fetchCardData = async () => {
      let endpoint = "";
      
      if (tcgType === "MTG") {
        endpoint = `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(suggestion)}`;
      } else if (tcgType === "Pokemon") {
        endpoint = `https://api.pokemontcg.io/v2/cards?q=name:"${encodeURIComponent(suggestion)}"`;
      } else if (tcgType === "Yu-Gi-Oh") {
        endpoint = `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(suggestion)}`;
      } else {
        return;
      }
      
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        
        let cardData: CardData | null = null;
        
        if (tcgType === "MTG") {
          cardData = data as MtgCard;
        } else if (tcgType === "Pokemon") {
          cardData = (data.data && data.data[0]) as PokemonCard;
        } else if (tcgType === "Yu-Gi-Oh") {
          cardData = (data.data && data.data[0]) as YuGiOhCard;
        }
        
        if (cardData) {
          onSelect(cardData);
        }
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    };
    
    fetchCardData();
  };

  return (
    <Popover open={isOpen && suggestions.length > 0} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className={cn("relative", className)}>
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => inputValue.length >= minCharsToSearch && suggestions.length > 0 && setIsOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandList>
            <CommandGroup>
              {suggestions.slice(0, 10).map((suggestion, index) => (
                <CommandItem 
                  key={index}
                  onSelect={() => handleSelectSuggestion(suggestion)}
                  className="cursor-pointer"
                >
                  {suggestion}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandEmpty>No results found</CommandEmpty>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
