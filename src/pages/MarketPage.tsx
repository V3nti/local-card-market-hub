
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CardDetails } from "@/components/CardDetails";
import { ChatConversation } from "@/components/ChatConversation";
import { toast } from "@/hooks/use-toast";

// Sample market listings
const MARKET_LISTINGS = [
  {
    id: "1",
    name: "Black Lotus",
    type: "Magic: The Gathering",
    condition: "NM",
    grading: "PSA 9",
    price: 10000,
    seller: "VintageCollector",
    description: "Authentic Black Lotus in near-mint condition. PSA graded 9. One of the most iconic cards in MTG history.",
    image: ""
  },
  {
    id: "2",
    name: "Charizard",
    type: "Pokemon",
    condition: "LP",
    price: 250,
    seller: "PokeMaster99",
    description: "Original Base Set Charizard in lightly played condition. No scratches on the holo.",
    image: ""
  }
];

export default function MarketPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<string>("");
  
  const handleCardClick = (card: any) => {
    setSelectedCard(card);
  };
  
  const handleContactSeller = (sellerId: string) => {
    setSelectedSeller(sellerId);
    setShowChat(true);
    toast({
      title: "Chat Opened",
      description: `Starting conversation with ${sellerId}`
    });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Market</h2>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search cards..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium">Available Near You</h3>
        
        {MARKET_LISTINGS.map((listing) => (
          <div 
            key={listing.id}
            className="bg-card rounded-lg p-4 shadow flex gap-4 cursor-pointer hover:bg-card/90 transition-colors"
            onClick={() => handleCardClick(listing)}
          >
            <div className="bg-muted h-24 w-16 rounded-md flex-shrink-0"></div>
            <div className="flex flex-col justify-between flex-1">
              <div>
                <p className="font-medium">{listing.name}</p>
                <p className="text-sm text-muted-foreground">{listing.type}</p>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">{listing.condition}</span>
                  {listing.grading && <span className="text-muted-foreground">{listing.grading}</span>}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">${listing.price}</span>
                <Button 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContactSeller(listing.seller);
                  }}
                >
                  Contact
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Card Details Dialog */}
      <CardDetails
        card={selectedCard}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        onContact={() => selectedCard && handleContactSeller(selectedCard.seller)}
        isMarketCard={true}
      />

      {/* Chat Sheet */}
      <Sheet open={showChat} onOpenChange={setShowChat}>
        <SheetContent side="right" className="p-0 w-full sm:max-w-md">
          {showChat && (
            <ChatConversation 
              contact={{
                id: "market",
                sender: selectedSeller,
                avatar: ""
              }}
              onClose={() => setShowChat(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
