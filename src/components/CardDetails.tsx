
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

  // Generate dynamic display of card fields based on TCG type
  const renderCardFields = () => {
    const baseFields = [
      { label: "Card Name", value: card.name },
      { label: "Rarity", value: card.rarity },
    ];

    const specificFields = Object.entries(card)
      .filter(([key]) => 
        !['id', 'name', 'rarity', 'image', 'condition', 'price', 'seller', 'description'].includes(key))
      .map(([key, value]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        value
      }));
      
    const conditionField = isMarketCard ? [
      { label: "Condition", value: card.condition, highlight: true }
    ] : [];
    
    const marketFields = isMarketCard ? [
      { label: "Price", value: `$${card.price}`, highlight: false },
      { label: "Seller", value: card.seller, highlight: false },
    ] : [];

    return [...baseFields, ...specificFields, ...conditionField, ...marketFields];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{card.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="flex justify-center">
            {card.image ? (
              <img 
                src={card.image} 
                alt={card.name} 
                className="h-64 object-contain rounded-md"
              />
            ) : (
              <div className="bg-muted h-64 w-48 rounded-md"></div>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {renderCardFields().map((field, index) => (
                <React.Fragment key={index}>
                  <div className="text-sm text-muted-foreground">{field.label}:</div>
                  <div className="font-medium">
                    {field.highlight ? (
                      <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">{field.value}</span>
                    ) : (
                      field.value || "-"
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
            
            {(isMarketCard || card.description) && (
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
