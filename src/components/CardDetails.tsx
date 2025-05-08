
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, MessageSquare } from "lucide-react";

interface CardDetailsProps {
  card: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onContact?: () => void;
  isMarketCard?: boolean;
}

export function CardDetails({ 
  card, 
  isOpen, 
  onClose, 
  onEdit, 
  onContact,
  isMarketCard = false
}: CardDetailsProps) {
  if (!card) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{card.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="flex justify-center">
            <div className="bg-muted h-64 w-48 rounded-md"></div>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Card Name:</div>
              <div className="font-medium">{card.name}</div>
              
              <div className="text-sm text-muted-foreground">Type:</div>
              <div className="font-medium">{isMarketCard ? card.type : ""}</div>
              
              <div className="text-sm text-muted-foreground">Rarity:</div>
              <div className="font-medium">{card.rarity}</div>
              
              {isMarketCard && (
                <>
                  <div className="text-sm text-muted-foreground">Condition:</div>
                  <div className="font-medium">
                    <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">{card.condition}</span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">Price:</div>
                  <div className="font-semibold">${card.price}</div>
                  
                  <div className="text-sm text-muted-foreground">Seller:</div>
                  <div className="font-medium">{card.seller}</div>
                </>
              )}
            </div>
            
            {isMarketCard && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Description:</div>
                <p className="text-sm">
                  {card.description || "No description provided."}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3">
            {onEdit && (
              <Button 
                variant="outline" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onClose();
                  onEdit(); 
                }}
              >
                <Pencil className="mr-1 h-4 w-4" /> Edit Card
              </Button>
            )}
            
            {onContact && (
              <Button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onClose();
                  onContact(); 
                }}
              >
                <MessageSquare className="mr-1 h-4 w-4" /> Contact Seller
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
