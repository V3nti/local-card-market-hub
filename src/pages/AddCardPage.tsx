
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Search } from "lucide-react";

const TCG_TYPES = ["MTG", "Pokemon", "Yu-Gi-Oh", "One Piece", "Flesh and Blood"];

// TCG-specific fields
const TCG_FIELDS = {
  "MTG": [
    { name: "colorIdentity", label: "Color Identity", type: "select", options: ["White", "Blue", "Black", "Red", "Green", "Colorless", "Multicolor"] },
    { name: "cardType", label: "Card Type", type: "select", options: ["Creature", "Instant", "Sorcery", "Artifact", "Enchantment", "Planeswalker", "Land"] },
    { name: "manaCost", label: "Mana Cost", type: "input" },
  ],
  "Pokemon": [
    { name: "pokemonType", label: "Pokémon Type", type: "select", options: ["Normal", "Fire", "Water", "Grass", "Electric", "Fighting", "Psychic", "Darkness", "Metal", "Fairy", "Dragon"] },
    { name: "hp", label: "HP", type: "input" },
    { name: "stage", label: "Evolution Stage", type: "select", options: ["Basic", "Stage 1", "Stage 2", "V", "VMAX", "VSTAR", "GX", "EX"] },
  ],
  "Yu-Gi-Oh": [
    { name: "cardType", label: "Card Type", type: "select", options: ["Monster", "Spell", "Trap"] },
    { name: "monsterType", label: "Monster Type", type: "select", options: ["Normal", "Effect", "Fusion", "Ritual", "Synchro", "Xyz", "Pendulum", "Link"] },
    { name: "attribute", label: "Attribute", type: "select", options: ["DARK", "LIGHT", "EARTH", "WATER", "FIRE", "WIND", "DIVINE"] },
    { name: "level", label: "Level/Rank", type: "input" },
  ],
  "One Piece": [
    { name: "color", label: "Color", type: "select", options: ["Red", "Green", "Blue", "Purple", "Black", "Yellow"] },
    { name: "cardType", label: "Card Type", type: "select", options: ["Leader", "Character", "Event", "Stage", "Don!!"] },
    { name: "cost", label: "Cost", type: "input" },
  ],
  "Flesh and Blood": [
    { name: "class", label: "Class", type: "select", options: ["Ninja", "Warrior", "Brute", "Guardian", "Wizard", "Ranger", "Mechanologist", "Runeblade", "Generic"] },
    { name: "cardType", label: "Card Type", type: "select", options: ["Attack", "Defense", "Attack Reaction", "Defense Reaction", "Instant", "Action", "Equipment"] },
    { name: "pitValue", label: "Pitch Value", type: "select", options: ["1 (Red)", "2 (Yellow)", "3 (Blue)"] },
  ]
};

// API endpoints for card lookup
const API_ENDPOINTS = {
  "MTG": "https://api.scryfall.com/cards/named?fuzzy=",
  "Pokemon": "https://api.pokemontcg.io/v2/cards?q=name:",
  "Yu-Gi-Oh": "https://db.ygoprodeck.com/api/v7/cardinfo.php?name=",
  "One Piece": null, // No public API available
  "Flesh and Blood": null, // No public API available
};

export default function AddCardPage() {
  const [formData, setFormData] = useState({
    name: "",
    tcgType: "MTG",
    rarity: "",
    condition: "NM",
    description: "",
  });
  const [tcgSpecificData, setTcgSpecificData] = useState<Record<string, any>>({});
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Limit description to 128 characters
    if (name === "description" && value.length > 128) {
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "tcgType") {
      // Reset TCG-specific fields when changing TCG type
      setTcgSpecificData({});
      setSearchResults(null);
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleTcgSpecificChange = (name: string, value: string) => {
    setTcgSpecificData({ ...tcgSpecificData, [name]: value });
  };

  const searchCard = async () => {
    if (!formData.name || !API_ENDPOINTS[formData.tcgType as keyof typeof API_ENDPOINTS]) {
      return;
    }

    setIsSearching(true);
    
    try {
      const apiUrl = API_ENDPOINTS[formData.tcgType as keyof typeof API_ENDPOINTS];
      if (!apiUrl) {
        toast({
          title: "API Not Available",
          description: `No API support for ${formData.tcgType} cards yet.`,
        });
        setIsSearching(false);
        return;
      }

      const response = await fetch(`${apiUrl}${encodeURIComponent(formData.name)}`);
      const data = await response.json();
      
      // Process data based on TCG type
      let processedData: any = null;
      
      if (formData.tcgType === "MTG") {
        // Scryfall API
        if (data.object === "card") {
          processedData = {
            name: data.name,
            rarity: data.rarity,
            colorIdentity: data.color_identity?.join(", ") || "",
            cardType: data.type_line || "",
            manaCost: data.mana_cost || "",
            image: data.image_uris?.normal || "",
          };
        }
      } else if (formData.tcgType === "Pokemon") {
        // Pokemon TCG API
        if (data.data && data.data.length > 0) {
          const card = data.data[0];
          processedData = {
            name: card.name,
            rarity: card.rarity || "",
            pokemonType: card.types?.join(", ") || "",
            hp: card.hp || "",
            stage: card.subtypes?.includes("Stage 1") ? "Stage 1" : 
                  card.subtypes?.includes("Stage 2") ? "Stage 2" :
                  card.subtypes?.includes("VMAX") ? "VMAX" :
                  card.subtypes?.includes("V") ? "V" : "Basic",
            image: card.images?.small || "",
          };
        }
      } else if (formData.tcgType === "Yu-Gi-Oh") {
        // YGOProDeck API
        if (data.data && data.data.length > 0) {
          const card = data.data[0];
          processedData = {
            name: card.name,
            rarity: card.card_sets?.[0]?.set_rarity || "",
            cardType: card.type || "",
            monsterType: card.race || "",
            attribute: card.attribute || "",
            level: card.level?.toString() || "",
            image: card.card_images?.[0]?.image_url || "",
          };
        }
      }
      
      if (processedData) {
        setSearchResults(processedData);
        
        // Update form with found data
        setFormData(prev => ({
          ...prev,
          name: processedData.name,
          rarity: processedData.rarity || prev.rarity,
        }));
        
        // Update TCG-specific data
        const newTcgData: Record<string, any> = {};
        Object.keys(processedData).forEach(key => {
          if (key !== "name" && key !== "rarity" && key !== "image") {
            newTcgData[key] = processedData[key];
          }
        });
        
        setTcgSpecificData(newTcgData);
        
        toast({
          title: "Card Found",
          description: `Found data for ${processedData.name}`
        });
      } else {
        toast({
          title: "Card Not Found",
          description: "Could not find card with that name"
        });
      }
    } catch (error) {
      console.error("Error searching card:", error);
      toast({
        title: "Search Error",
        description: "Failed to search for card data"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCard = {
      name: formData.name,
      rarity: formData.rarity,
      condition: formData.condition,
      image: searchResults?.image || "", 
      description: formData.description,
      ...tcgSpecificData
    };
    
    // Store in localStorage directly
    const storedCards = localStorage.getItem('cardCollections');
    let cardCollections = storedCards ? JSON.parse(storedCards) : {
      "MTG": [],
      "Pokemon": [],
      "Yu-Gi-Oh": [],
      "One Piece": [],
      "Flesh and Blood": []
    };
    
    // Add new card with unique ID
    cardCollections[formData.tcgType] = [
      ...cardCollections[formData.tcgType],
      {
        ...newCard,
        id: Date.now().toString()
      }
    ];
    
    // Save back to localStorage
    localStorage.setItem('cardCollections', JSON.stringify(cardCollections));
    
    toast({
      title: "Card Added",
      description: `${formData.name} has been added to your collection`
    });
    
    // Navigate back to My Cards
    navigate("/my-cards");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Add Card</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tcgType">TCG Type</Label>
          <Select 
            name="tcgType" 
            value={formData.tcgType}
            onValueChange={(value) => handleSelectChange("tcgType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select TCG Type" />
            </SelectTrigger>
            <SelectContent>
              {TCG_TYPES.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="name">Card Name</Label>
              <Input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            {API_ENDPOINTS[formData.tcgType as keyof typeof API_ENDPOINTS] && (
              <Button 
                type="button" 
                onClick={searchCard} 
                disabled={isSearching || !formData.name}
                className="mb-0.5"
              >
                <Search className="mr-1 h-4 w-4" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
            )}
          </div>
          {!API_ENDPOINTS[formData.tcgType as keyof typeof API_ENDPOINTS] && (
            <p className="text-xs text-muted-foreground">
              No API lookup available for {formData.tcgType} cards.
            </p>
          )}
        </div>
        
        {/* TCG-specific fields */}
        {TCG_FIELDS[formData.tcgType as keyof typeof TCG_FIELDS]?.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            {field.type === "input" ? (
              <Input
                id={field.name}
                name={field.name}
                value={tcgSpecificData[field.name] || ""}
                onChange={(e) => handleTcgSpecificChange(field.name, e.target.value)}
              />
            ) : field.type === "select" ? (
              <Select
                value={tcgSpecificData[field.name] || ""}
                onValueChange={(value) => handleTcgSpecificChange(field.name, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${field.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
          </div>
        ))}
        
        <div className="space-y-2">
          <Label htmlFor="rarity">Rarity</Label>
          <Input 
            id="rarity"
            name="rarity"
            value={formData.rarity}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Condition</Label>
          <RadioGroup 
            defaultValue={formData.condition}
            onValueChange={(value) => handleSelectChange("condition", value)}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="NM" id="nm" />
              <Label htmlFor="nm">NM (Near Mint)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="LP" id="lp" />
              <Label htmlFor="lp">LP (Lightly Played)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="MP" id="mp" />
              <Label htmlFor="mp">MP (Moderately Played)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="HP" id="hp" />
              <Label htmlFor="hp">HP (Heavily Played)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="DMG" id="dmg" />
              <Label htmlFor="dmg">DMG (Damaged)</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="description">Description (Optional)</Label>
            <span className="text-xs text-muted-foreground">
              {formData.description.length}/128
            </span>
          </div>
          <Textarea 
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            maxLength={128}
          />
        </div>
        
        {searchResults?.image && (
          <div className="flex justify-center">
            <div className="border rounded p-2">
              <img src={searchResults.image} alt={formData.name} className="h-48 object-contain" />
            </div>
          </div>
        )}
        
        <div className="pt-4 flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate("/my-cards")}
          >
            Cancel
          </Button>
          <Button type="submit">Save Card</Button>
        </div>
      </form>
    </div>
  );
}
