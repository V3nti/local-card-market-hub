
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface CardAutoCompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (card: any) => void;
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
  value,
  onChange,
  onSelect,
  tcgType,
  className,
  placeholder = "Card name",
  disabled = false,
}: CardAutoCompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const minCharsToSearch = 3;

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value || value.length < minCharsToSearch || !API_ENDPOINTS[tcgType]) {
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
          const response = await fetch(`${endpoint}${encodeURIComponent(value)}`);
          const data = await response.json();
          setSuggestions(data.data || []);
        } 
        else if (tcgType === "Pokemon") {
          const response = await fetch(`${endpoint}${encodeURIComponent(value)}*`);
          const data = await response.json();
          setSuggestions(data.data.map((card: any) => card.name) || []);
        }
        else if (tcgType === "Yu-Gi-Oh") {
          const response = await fetch(`${endpoint}${encodeURIComponent(value)}`);
          const data = await response.json();
          if (data.data) {
            // Get unique card names
            const uniqueNames = Array.from(
              new Set(data.data.map((card: any) => card.name))
            );
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
  }, [value, tcgType]);
  
  const handleSelectSuggestion = (suggestion: string) => {
    onChange(suggestion);
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
        
        let cardData;
        
        if (tcgType === "MTG") {
          cardData = data;
        } else if (tcgType === "Pokemon") {
          cardData = data.data[0];
        } else if (tcgType === "Yu-Gi-Oh") {
          cardData = data.data[0];
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

  const showSuggestions = value.length >= minCharsToSearch && isOpen && suggestions.length > 0;

  return (
    <div className={cn("relative", className)} ref={wrapperRef}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.length >= minCharsToSearch && setSuggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>
      </div>
      
      {showSuggestions && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-background p-1 shadow-md">
          {suggestions.slice(0, 10).map((suggestion, index) => (
            <div
              key={index}
              className="cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
