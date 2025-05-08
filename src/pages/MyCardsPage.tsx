
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Plus, Pencil } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { CardDetails } from "@/components/CardDetails";

const TCG_TYPES = ["MTG", "Pokemon", "Yu-Gi-Oh", "One Piece", "Flesh and Blood"];

// Create an object to store cards with TCG type as key
interface Card {
  id: string;
  name: string;
  rarity: string;
  image: string;
}

// Initial empty state for card collections
const initialCardState = () => {
  const storedCards = localStorage.getItem('cardCollections');
  if (storedCards) {
    return JSON.parse(storedCards);
  }
  
  return {
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
};

export default function MyCardsPage() {
  const [selectedTcg, setSelectedTcg] = useState("MTG");
  const [cardCollections, setCardCollections] = useState<Record<string, Card[]>>(initialCardState);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for new card data from navigation state
  useEffect(() => {
    if (location.state?.newCard) {
      const { newCard, tcgType } = location.state;
      
      // Add the new card to the collection
      setCardCollections(prev => {
        const updatedCollection = {
          ...prev,
          [tcgType]: [...(prev[tcgType] || []), {
            ...newCard,
            id: Date.now().toString() // Ensure unique ID
          }]
        };
        
        // Store updated collection in localStorage
        localStorage.setItem('cardCollections', JSON.stringify(updatedCollection));
        
        return updatedCollection;
      });
      
      // Show success toast
      toast({
        title: "Card Added",
        description: `${newCard.name} has been added to your collection`
      });
      
      // Clear navigation state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);
  
  const handleCardClick = (id: string) => {
    const card = cardCollections[selectedTcg].find(c => c.id === id) || null;
    setSelectedCard(card);
  };

  const handleEditCard = (id: string) => {
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
        {cardCollections[selectedTcg]?.length > 0 ? (
          cardCollections[selectedTcg].map((card) => (
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditCard(card.id);
                }}
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

      {/* Card Details Dialog */}
      <CardDetails
        card={selectedCard}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        onEdit={() => selectedCard && handleEditCard(selectedCard.id)}
      />
    </div>
  );
}
