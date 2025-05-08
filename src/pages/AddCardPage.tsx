
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

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

export default function AddCardPage() {
  const [formData, setFormData] = useState({
    name: "",
    tcgType: "MTG",
    rarity: "",
    condition: "NM",
    description: "",
  });
  const [tcgSpecificData, setTcgSpecificData] = useState<Record<string, any>>({});
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "tcgType") {
      // Reset TCG-specific fields when changing TCG type
      setTcgSpecificData({});
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleTcgSpecificChange = (name: string, value: string) => {
    setTcgSpecificData({ ...tcgSpecificData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCard = {
      name: formData.name,
      rarity: formData.rarity,
      condition: formData.condition,
      image: "", // Placeholder for image
      description: formData.description,
      ...tcgSpecificData
    };
    
    toast({
      title: "Card Added",
      description: `${formData.name} has been added to your collection`
    });
    
    // Navigate back to My Cards and pass the new card data
    navigate("/my-cards", { 
      state: { 
        newCard, 
        tcgType: formData.tcgType 
      } 
    });
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
          <Label htmlFor="name">Card Name</Label>
          <Input 
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
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
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea 
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
          />
        </div>
        
        {/* Add Image Upload functionality here in the future */}
        
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
