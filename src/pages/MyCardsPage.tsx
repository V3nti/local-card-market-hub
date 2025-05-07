
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Plus, Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const TCG_TYPES = ["MTG", "Pokemon", "Yu-Gi-Oh", "One Piece", "Flesh and Blood"];

// Sample card data structure
const SAMPLE_CARDS = {
  "MTG": [
    { id: "1", name: "Jace, the Mind Sculptor", rarity: "Mythic Rare", image: "" },
    { id: "2", name: "Lightning Bolt", rarity: "Common", image: "" }
  ],
  "Pokemon": [
    { id: "3", name: "Charizard", rarity: "Holo Rare", image: "" }
  ],
  "Yu-Gi-Oh": [],
  "One Piece": [],
  "Flesh and Blood": []
};

export default function MyCardsPage() {
  const [selectedTcg, setSelectedTcg] = useState("MTG");
  const navigate = useNavigate();
  
  const handleCardClick = (id: string) => {
    toast({
      title: "Card details",
      description: "Opening card details view",
    });
    // This would navigate to a detail page in a real app
    console.log("Card clicked:", id);
  };

  const handleEditCard = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent triggering the card click
    toast({
      title: "Edit Card",
      description: "Opening card edit form",
    });
    console.log("Edit card:", id);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Cards</h2>
        <Link to="/my-cards/add">
          <Button size="sm" className="flex items-center gap-1">
            <Plus size={16} /> Add Card
          </Button>
        </Link>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TCG_TYPES.map((tcg) => (
          <Toggle
            key={tcg}
            pressed={selectedTcg === tcg}
            onPressedChange={() => setSelectedTcg(tcg)}
            variant="outline"
            className="whitespace-nowrap"
          >
            {tcg}
          </Toggle>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {SAMPLE_CARDS[selectedTcg as keyof typeof SAMPLE_CARDS]?.length > 0 ? (
          SAMPLE_CARDS[selectedTcg as keyof typeof SAMPLE_CARDS].map((card) => (
            <div 
              key={card.id}
              className="bg-card rounded-lg p-4 shadow flex flex-col items-center cursor-pointer relative"
              onClick={() => handleCardClick(card.id)}
            >
              <div className="bg-muted w-full h-40 rounded-md mb-2"></div>
              <p className="font-medium">{card.name}</p>
              <p className="text-sm text-muted-foreground">{card.rarity}</p>
              <button 
                className="absolute top-2 right-2 p-1 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors"
                onClick={(e) => handleEditCard(e, card.id)}
              >
                <Pencil size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-8 text-center text-muted-foreground">
            No cards added for {selectedTcg} yet. Click Add Card to get started.
          </div>
        )}
      </div>
    </div>
  );
}
