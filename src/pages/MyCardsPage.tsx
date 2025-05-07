
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const TCG_TYPES = ["MTG", "Pokemon", "Yu-Gi-Oh", "One Piece", "Flesh and Blood"];

export default function MyCardsPage() {
  const [selectedTcg, setSelectedTcg] = useState("MTG");
  
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
        {selectedTcg === "MTG" && (
          <>
            <div className="bg-card rounded-lg p-4 shadow flex flex-col items-center">
              <div className="bg-muted w-full h-40 rounded-md mb-2"></div>
              <p className="font-medium">Jace, the Mind Sculptor</p>
              <p className="text-sm text-muted-foreground">Mythic Rare</p>
            </div>
            <div className="bg-card rounded-lg p-4 shadow flex flex-col items-center">
              <div className="bg-muted w-full h-40 rounded-md mb-2"></div>
              <p className="font-medium">Lightning Bolt</p>
              <p className="text-sm text-muted-foreground">Common</p>
            </div>
          </>
        )}
        {selectedTcg === "Pokemon" && (
          <>
            <div className="bg-card rounded-lg p-4 shadow flex flex-col items-center">
              <div className="bg-muted w-full h-40 rounded-md mb-2"></div>
              <p className="font-medium">Charizard</p>
              <p className="text-sm text-muted-foreground">Holo Rare</p>
            </div>
          </>
        )}
        {(selectedTcg !== "MTG" && selectedTcg !== "Pokemon") && (
          <div className="col-span-2 p-8 text-center text-muted-foreground">
            No cards added for {selectedTcg} yet. Click Add Card to get started.
          </div>
        )}
      </div>
    </div>
  );
}
