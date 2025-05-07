
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";

const TCG_TYPES = ["MTG", "Pokemon", "Yu-Gi-Oh", "One Piece", "Flesh and Blood"];
const CONDITION_TYPES = ["M", "NM", "G", "P", "LP", "HP"];

// TCG-specific fields
const TCG_FIELDS = {
  "MTG": {
    rarities: ["Common", "Uncommon", "Rare", "Mythic Rare", "Special"],
    uniqueFields: [
      { name: "mana_cost", label: "Mana Cost", type: "text" },
      { name: "card_type", label: "Card Type", type: "text" }
    ]
  },
  "Pokemon": {
    rarities: ["Common", "Uncommon", "Rare", "Holo Rare", "Ultra Rare", "Secret Rare"],
    uniqueFields: [
      { name: "hp", label: "HP", type: "number" },
      { name: "pokemon_type", label: "Pokémon Type", type: "text" }
    ]
  },
  "Yu-Gi-Oh": {
    rarities: ["Common", "Rare", "Super Rare", "Ultra Rare", "Secret Rare"],
    uniqueFields: [
      { name: "attack", label: "ATK", type: "number" },
      { name: "defense", label: "DEF", type: "number" },
      { name: "level", label: "Level/Rank", type: "number" }
    ]
  },
  "One Piece": {
    rarities: ["Common", "Uncommon", "Rare", "Super Rare", "Secret Rare"],
    uniqueFields: [
      { name: "cost", label: "Cost", type: "number" },
      { name: "power", label: "Power", type: "number" }
    ]
  },
  "Flesh and Blood": {
    rarities: ["Common", "Rare", "Super Rare", "Majestic", "Legendary", "Fabled"],
    uniqueFields: [
      { name: "pitch", label: "Pitch Value", type: "number" },
      { name: "cost", label: "Resource Cost", type: "number" }
    ]
  }
};

export default function AddCardPage() {
  const navigate = useNavigate();
  const [selectedTcg, setSelectedTcg] = useState("");
  const [forSale, setForSale] = useState(false);
  const [saleMethod, setSaleMethod] = useState("price");
  const [formValues, setFormValues] = useState({
    name: "",
    set: "",
    rarity: "",
    condition: "",
    quantity: 1,
    foil: false,
    graded: false,
    price: 0
  });
  
  const handleInputChange = (field: string, value: any) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!selectedTcg || !formValues.name || !formValues.condition) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Success toast and navigate
    toast({
      title: "Card added successfully",
      description: `Your ${formValues.name} card has been added to your ${selectedTcg} collection`,
    });
    
    // Navigate back to the collection
    navigate("/my-cards");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/my-cards">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold">Add New Card</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">TCG Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Trading Card Game</label>
              <Select value={selectedTcg} onValueChange={setSelectedTcg}>
                <SelectTrigger>
                  <SelectValue placeholder="Select TCG..." />
                </SelectTrigger>
                <SelectContent>
                  {TCG_TYPES.map(tcg => (
                    <SelectItem key={tcg} value={tcg}>{tcg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {selectedTcg && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Card Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Card Name</label>
                <Input 
                  placeholder="Enter card name" 
                  value={formValues.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Set/Expansion</label>
                <Input 
                  placeholder="Enter set or expansion" 
                  value={formValues.set}
                  onChange={(e) => handleInputChange("set", e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Rarity</label>
                <Select 
                  value={formValues.rarity}
                  onValueChange={(value) => handleInputChange("rarity", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rarity..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TCG_FIELDS[selectedTcg as keyof typeof TCG_FIELDS].rarities.map(rarity => (
                      <SelectItem key={rarity} value={rarity}>{rarity}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* TCG-specific fields */}
              {TCG_FIELDS[selectedTcg as keyof typeof TCG_FIELDS].uniqueFields.map(field => (
                <div key={field.name}>
                  <label className="text-sm text-muted-foreground mb-1 block">{field.label}</label>
                  <Input
                    type={field.type} 
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                  />
                </div>
              ))}
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="foil" 
                  checked={formValues.foil}
                  onCheckedChange={(checked) => handleInputChange("foil", checked)}
                />
                <label htmlFor="foil" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Foil/Holo
                </label>
              </div>
            </CardContent>
          </Card>
        )}
        
        {selectedTcg && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Card Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Condition</label>
                <Select 
                  value={formValues.condition}
                  onValueChange={(value) => handleInputChange("condition", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITION_TYPES.map(condition => (
                      <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Quantity</label>
                <Input 
                  type="number" 
                  defaultValue="1" 
                  min="1"
                  value={formValues.quantity}
                  onChange={(e) => handleInputChange("quantity", parseInt(e.target.value))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="graded"
                  checked={formValues.graded}
                  onCheckedChange={(checked) => handleInputChange("graded", checked)}
                />
                <label htmlFor="graded" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Graded Card
                </label>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Upload Image (Optional)</label>
                <Input type="file" />
              </div>
            </CardContent>
          </Card>
        )}
        
        {selectedTcg && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Listing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Set for Sale</p>
                  <p className="text-sm text-muted-foreground">Make this card available in the marketplace</p>
                </div>
                <Switch checked={forSale} onCheckedChange={setForSale} />
              </div>
              
              {forSale && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Sale Method</label>
                    <Select value={saleMethod} onValueChange={setSaleMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose method..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">Fixed Price</SelectItem>
                        <SelectItem value="auction">Auction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {saleMethod === "price" && (
                    <>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Price</label>
                        <Input 
                          placeholder="Enter price" 
                          type="number" 
                          step="0.01" 
                          min="0"
                          value={formValues.price || ""}
                          onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox id="trades" />
                        <label htmlFor="trades" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Accept trades
                        </label>
                      </div>
                    </>
                  )}
                  
                  {saleMethod === "auction" && (
                    <>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Starting Price</label>
                        <Input placeholder="Enter starting price" type="number" step="0.01" min="0" />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">End Date</label>
                        <Input type="date" />
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        <Button type="submit" className="w-full">Add Card to Collection</Button>
      </form>
    </div>
  );
}
