
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

export default function MarketPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
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
        
        <div className="bg-card rounded-lg p-4 shadow flex gap-4">
          <div className="bg-muted h-24 w-16 rounded-md flex-shrink-0"></div>
          <div className="flex flex-col justify-between">
            <div>
              <p className="font-medium">Black Lotus</p>
              <p className="text-sm text-muted-foreground">Magic: The Gathering</p>
              <div className="flex items-center gap-2 text-sm mt-1">
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">NM</span>
                <span className="text-muted-foreground">PSA 9</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">$10,000</span>
              <Button size="sm">Contact</Button>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-4 shadow flex gap-4">
          <div className="bg-muted h-24 w-16 rounded-md flex-shrink-0"></div>
          <div className="flex flex-col justify-between">
            <div>
              <p className="font-medium">Charizard</p>
              <p className="text-sm text-muted-foreground">Pokemon</p>
              <div className="flex items-center gap-2 text-sm mt-1">
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">LP</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">$250</span>
              <Button size="sm">Contact</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
