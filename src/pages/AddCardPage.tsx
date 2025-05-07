
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const TCG_TYPES = ["MTG", "Pokemon", "Yu-Gi-Oh", "One Piece", "Flesh and Blood"];
const CONDITION_TYPES = ["M", "NM", "G", "P", "LP", "HP"];

export default function AddCardPage() {
  const navigate = useNavigate();
  const [selectedTcg, setSelectedTcg] = useState("");
  const [forSale, setForSale] = useState(false);
  const [saleMethod, setSaleMethod] = useState("price");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Card added successfully",
      description: "Your card has been added to your collection",
    });
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
        <div className="bg-card rounded-lg p-5 shadow space-y-4">
          <h3 className="font-medium">TCG Selection</h3>
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
        </div>
        
        {selectedTcg && (
          <div className="bg-card rounded-lg p-5 shadow space-y-4">
            <h3 className="font-medium">Card Information</h3>
            
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Card Name</label>
              <Input placeholder="Enter card name" />
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Set/Expansion</label>
              <Input placeholder="Enter set or expansion" />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="foil" />
              <label htmlFor="foil" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Foil/Holo
              </label>
            </div>
          </div>
        )}
        
        {selectedTcg && (
          <div className="bg-card rounded-lg p-5 shadow space-y-4">
            <h3 className="font-medium">Card Specifications</h3>
            
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Condition</label>
              <Select>
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
              <Input type="number" defaultValue="1" min="1" />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="graded" />
              <label htmlFor="graded" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Graded Card
              </label>
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Upload Image (Optional)</label>
              <Input type="file" />
            </div>
          </div>
        )}
        
        {selectedTcg && (
          <div className="bg-card rounded-lg p-5 shadow space-y-4">
            <h3 className="font-medium">Listing Options</h3>
            
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
                      <Input placeholder="Enter price" type="number" step="0.01" min="0" />
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
          </div>
        )}
        
        <Button type="submit" className="w-full">Add Card to Collection</Button>
      </form>
    </div>
  );
}
