
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CardDetails } from "@/components/CardDetails";
import { ChatConversation } from "@/components/ChatConversation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

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
    image: "",
    distance: 5,
    location: "San Francisco, CA",
  },
  {
    id: "2",
    name: "Charizard",
    type: "Pokemon",
    condition: "LP",
    price: 250,
    seller: "PokeMaster99",
    description: "Original Base Set Charizard in lightly played condition. No scratches on the holo.",
    image: "",
    distance: 12,
    location: "Oakland, CA",
  },
  {
    id: "3",
    name: "Blue-Eyes White Dragon",
    type: "Yu-Gi-Oh!",
    condition: "M",
    price: 120,
    seller: "DuelistKing",
    description: "Original LOB Blue-Eyes White Dragon in mint condition.",
    image: "",
    distance: 8,
    location: "Berkeley, CA",
  }
];

const TCG_TYPES = ["All", "Magic: The Gathering", "Pokemon", "Yu-Gi-Oh!"];
const CONDITION_OPTIONS = ["All", "M", "NM", "LP", "MP", "HP"];

export default function MarketPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<string>("");
  const [filterTcg, setFilterTcg] = useState("All");
  const [filterCondition, setFilterCondition] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [maxDistance, setMaxDistance] = useState(25); // Default from profile
  
  const handleCardClick = (card: any) => {
    setSelectedCard(card);
  };
  
  const handleContactSeller = (sellerId: string, card: any) => {
    setSelectedSeller(sellerId);
    setSelectedCard(card);
    setShowChat(true);
  };

  // Filter listings based on criteria
  const filteredListings = MARKET_LISTINGS.filter(listing => {
    // Search term filter
    const matchesSearch = listing.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // TCG type filter
    const matchesTcg = filterTcg === "All" || listing.type === filterTcg;
    
    // Condition filter
    const matchesCondition = filterCondition === "All" || listing.condition === filterCondition;
    
    // Price range filter
    const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
    
    // Distance filter
    const matchesDistance = listing.distance <= maxDistance;
    
    return matchesSearch && matchesTcg && matchesCondition && matchesPrice && matchesDistance;
  });
  
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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Game</h4>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {filterTcg}
                      <Filter className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {TCG_TYPES.map((type) => (
                      <DropdownMenuItem key={type} onClick={() => setFilterTcg(type)}>
                        {type}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Condition</h4>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {filterCondition}
                      <Filter className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {CONDITION_OPTIONS.map((condition) => (
                      <DropdownMenuItem key={condition} onClick={() => setFilterCondition(condition)}>
                        {condition}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Price Range ($)</h4>
                <div className="space-y-2">
                  <Slider 
                    value={priceRange}
                    min={0}
                    max={10000}
                    step={100}
                    onValueChange={setPriceRange}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Maximum Distance ({maxDistance} km)</h4>
                <Slider 
                  value={[maxDistance]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={([value]) => setMaxDistance(value)}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium">Available Near You</h3>
        
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
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
                  <div>
                    <span className="font-semibold">${listing.price}</span>
                    <span className="text-xs text-muted-foreground ml-2">{listing.distance} km away</span>
                  </div>
                  <Button 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContactSeller(listing.seller, listing);
                    }}
                  >
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Card className="bg-muted/40">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No cards match your filters</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Card Details Dialog */}
      <CardDetails
        card={selectedCard}
        isOpen={!!selectedCard && !showChat}
        onClose={() => setSelectedCard(null)}
        onContact={() => selectedCard && handleContactSeller(selectedCard.seller, selectedCard)}
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
              cardInfo={selectedCard}
              onClose={() => setShowChat(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
