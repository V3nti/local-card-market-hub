
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { NumberInput } from "@/components/ui/number-input";
import { CardAutoComplete } from "@/components/ui/card-autocomplete";
import { ConditionSlider } from "@/components/ui/condition-slider";
import { MtgCard, PokemonCard, YuGiOhCard, CardFormData, TcgSpecificData } from "@/types/card-types";

const TCG_TYPES = ["MTG", "Pokemon", "Yu-Gi-Oh", "One Piece", "Flesh and Blood"];
const RARITY_OPTIONS = ["Common", "Uncommon", "Rare", "Super Rare", "Ultra Rare", "Secret Rare", "Mythic Rare", "Holo Rare"];
const LANGUAGE_OPTIONS = ["English", "Japanese", "Korean", "Chinese (S)", "Chinese (T)", "German", "French", "Italian", "Portuguese", "Spanish", "Russian"];
const GRADING_COMPANIES = ["PSA", "BGS", "CGC", "SGC"];

export default function AddCardPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CardFormData>({
    name: "",
    tcgType: "MTG",
    rarity: "",
    condition: "Near Mint",
    description: "",
    copies: "1",
    isGraded: false,
    gradingCompany: "",
    grade: "",
    language: "English",
    isFoil: false,
  });
  
  const [tcgSpecificData, setTcgSpecificData] = useState<TcgSpecificData>({});
  const [printings, setPrintings] = useState<Array<{label: string, value: string, image?: string}>>([]);
  const [selectedPrinting, setSelectedPrinting] = useState<string>("");
  const [cardImage, setCardImage] = useState<string>("");
  
  const handleInputChange = (field: keyof CardFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleTcgDataChange = (field: keyof TcgSpecificData, value: string | number | boolean) => {
    setTcgSpecificData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleCardSelection = (card: MtgCard | PokemonCard | YuGiOhCard) => {
    console.log("Selected card:", card);
    
    if ('name' in card) {
      handleInputChange('name', card.name);
    }
    
    if ('rarity' in card && card.rarity) {
      handleInputChange('rarity', card.rarity);
    }
    
    // Set card image based on TCG type
    if (formData.tcgType === "MTG") {
      const mtgCard = card as MtgCard;
      if (mtgCard.image_uris?.normal) {
        setCardImage(mtgCard.image_uris.normal);
      } else if (mtgCard.card_faces?.[0]?.image_uris?.normal) {
        setCardImage(mtgCard.card_faces[0].image_uris.normal);
      }
      
      // Set TCG specific data
      setTcgSpecificData({
        colorIdentity: mtgCard.color_identity?.join(', ') || '',
        cardType: mtgCard.type_line || '',
        manaCost: mtgCard.mana_cost || '',
      });
      
    } else if (formData.tcgType === "Pokemon") {
      const pokemonCard = card as PokemonCard;
      if (pokemonCard.images?.large) {
        setCardImage(pokemonCard.images.large);
      }
      
      setTcgSpecificData({
        pokemonType: pokemonCard.types?.join(', ') || '',
        hp: pokemonCard.hp || '',
        stage: pokemonCard.subtypes?.join(', ') || '',
      });
      
    } else if (formData.tcgType === "Yu-Gi-Oh") {
      const yugiohCard = card as YuGiOhCard;
      if (yugiohCard.card_images?.[0]?.image_url) {
        setCardImage(yugiohCard.card_images[0].image_url);
      }
      
      setTcgSpecificData({
        monsterType: yugiohCard.race || '',
        attribute: yugiohCard.attribute || '',
        level: yugiohCard.level?.toString() || '',
      });
    }
    
    // Generate printings based on card sets
    let cardPrintings: Array<{label: string, value: string, image?: string}> = [];
    
    if (formData.tcgType === "MTG") {
      const mtgCard = card as MtgCard;
      if (mtgCard.set && mtgCard.set_name) {
        cardPrintings.push({
          label: mtgCard.set_name,
          value: mtgCard.set,
        });
      }
    } else if (formData.tcgType === "Pokemon") {
      const pokemonCard = card as PokemonCard;
      if (pokemonCard.set?.name) {
        cardPrintings.push({
          label: pokemonCard.set.name,
          value: pokemonCard.set.name,
        });
      }
    } else if (formData.tcgType === "Yu-Gi-Oh") {
      const yugiohCard = card as YuGiOhCard;
      if (yugiohCard.card_sets) {
        cardPrintings = yugiohCard.card_sets.map(set => ({
          label: `${set.set_name} (${set.set_rarity})`,
          value: set.set_name || "",
        }));
      }
    }
    
    setPrintings(cardPrintings);
    if (cardPrintings.length > 0) {
      setSelectedPrinting(cardPrintings[0].value);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name) {
      toast({
        title: "Missing Information",
        description: "Please provide a card name.",
        variant: "destructive",
      });
      return;
    }
    
    // Combine form data with TCG specific data
    const cardData = {
      ...formData,
      ...tcgSpecificData,
      image: cardImage,
      printing: selectedPrinting,
    };
    
    console.log("Submitting card data:", cardData);
    
    // Show success message
    toast({
      title: "Card Added",
      description: `${formData.name} has been added to your collection.`,
    });
    
    // Navigate back to collection with new card data
    navigate("/my-cards", { 
      state: { 
        newCard: {
          name: formData.name,
          rarity: formData.rarity,
          image: cardImage,
          condition: formData.condition,
        },
        tcgType: formData.tcgType 
      } 
    });
  };
  
  // Reset TCG specific data when TCG type changes
  useEffect(() => {
    setTcgSpecificData({});
    setPrintings([]);
    setSelectedPrinting("");
    setCardImage("");
  }, [formData.tcgType]);
  
  return (
    <div className="space-y-6 pb-16">
      <div>
        <h2 className="text-2xl font-bold">Add Card to Collection</h2>
        <p className="text-muted-foreground">Search for a card or fill in the details manually</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column: Card Selection and Basic Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Trading Card Game</Label>
              <Select
                value={formData.tcgType}
                onValueChange={(value) => handleInputChange('tcgType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select TCG type" />
                </SelectTrigger>
                <SelectContent>
                  {TCG_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Card Search</Label>
              <CardAutoComplete 
                tcgType={formData.tcgType} 
                onSelect={handleCardSelection}
                value={formData.name}
                onChange={(value) => handleInputChange('name', value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Card Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter card name"
              />
            </div>
            
            {printings.length > 0 && (
              <div className="space-y-2">
                <Label>Set / Printing</Label>
                <Select
                  value={selectedPrinting}
                  onValueChange={setSelectedPrinting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select printing" />
                  </SelectTrigger>
                  <SelectContent>
                    {printings.map((printing) => (
                      <SelectItem key={printing.value} value={printing.value}>
                        {printing.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Rarity</Label>
              <Select
                value={formData.rarity}
                onValueChange={(value) => handleInputChange('rarity', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rarity" />
                </SelectTrigger>
                <SelectContent>
                  {RARITY_OPTIONS.map((rarity) => (
                    <SelectItem key={rarity} value={rarity}>{rarity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isFoil" 
                  checked={formData.isFoil}
                  onCheckedChange={(checked) => handleInputChange('isFoil', !!checked)} 
                />
                <Label htmlFor="isFoil">Foil / Holographic</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => handleInputChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((language) => (
                    <SelectItem key={language} value={language}>{language}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Right Column: Card Preview and Condition */}
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              {cardImage ? (
                <img 
                  src={cardImage} 
                  alt={formData.name} 
                  className="rounded-lg shadow-md max-h-80 object-contain" 
                />
              ) : (
                <div className="w-full h-80 bg-muted rounded-lg flex items-center justify-center">
                  <Search className="h-16 w-16 text-muted-foreground opacity-20" />
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Condition</Label>
                <ConditionSlider
                  value={formData.condition}
                  onChange={(value) => handleInputChange('condition', value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isGraded" 
                    checked={formData.isGraded}
                    onCheckedChange={(checked) => handleInputChange('isGraded', !!checked)} 
                  />
                  <Label htmlFor="isGraded">Professionally Graded</Label>
                </div>
                
                {formData.isGraded && (
                  <div className="pl-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Grading Company</Label>
                      <Select
                        value={formData.gradingCompany}
                        onValueChange={(value) => handleInputChange('gradingCompany', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADING_COMPANIES.map((company) => (
                            <SelectItem key={company} value={company}>{company}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Grade</Label>
                      <Input
                        value={formData.grade}
                        onChange={(e) => handleInputChange('grade', e.target.value)}
                        placeholder="e.g., 9.5, GEM-MT"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Number of Copies</Label>
                <NumberInput
                  value={formData.copies}
                  onChange={(value) => handleInputChange('copies', value)}
                  min={1}
                  max={999}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* TCG Specific Fields */}
        {formData.tcgType === "MTG" && (
          <div className="space-y-4 border rounded-lg p-4">
            <h3 className="font-medium">MTG Specific Details</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Color Identity</Label>
                <Input
                  value={tcgSpecificData.colorIdentity || ""}
                  onChange={(e) => handleTcgDataChange('colorIdentity', e.target.value)}
                  placeholder="e.g., W,U,B,R,G"
                />
              </div>
              <div className="space-y-2">
                <Label>Card Type</Label>
                <Input
                  value={tcgSpecificData.cardType || ""}
                  onChange={(e) => handleTcgDataChange('cardType', e.target.value)}
                  placeholder="e.g., Creature, Instant"
                />
              </div>
              <div className="space-y-2">
                <Label>Mana Cost</Label>
                <Input
                  value={tcgSpecificData.manaCost || ""}
                  onChange={(e) => handleTcgDataChange('manaCost', e.target.value)}
                  placeholder="e.g., {2}{W}{U}"
                />
              </div>
            </div>
          </div>
        )}
        
        {formData.tcgType === "Pokemon" && (
          <div className="space-y-4 border rounded-lg p-4">
            <h3 className="font-medium">Pokemon Specific Details</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Pokemon Type</Label>
                <Input
                  value={tcgSpecificData.pokemonType || ""}
                  onChange={(e) => handleTcgDataChange('pokemonType', e.target.value)}
                  placeholder="e.g., Fire, Water"
                />
              </div>
              <div className="space-y-2">
                <Label>HP</Label>
                <Input
                  value={tcgSpecificData.hp || ""}
                  onChange={(e) => handleTcgDataChange('hp', e.target.value)}
                  placeholder="e.g., 120"
                />
              </div>
              <div className="space-y-2">
                <Label>Stage</Label>
                <Input
                  value={tcgSpecificData.stage || ""}
                  onChange={(e) => handleTcgDataChange('stage', e.target.value)}
                  placeholder="e.g., Basic, Stage 1"
                />
              </div>
            </div>
          </div>
        )}
        
        {formData.tcgType === "Yu-Gi-Oh" && (
          <div className="space-y-4 border rounded-lg p-4">
            <h3 className="font-medium">Yu-Gi-Oh Specific Details</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Monster Type</Label>
                <Input
                  value={tcgSpecificData.monsterType || ""}
                  onChange={(e) => handleTcgDataChange('monsterType', e.target.value)}
                  placeholder="e.g., Dragon, Spellcaster"
                />
              </div>
              <div className="space-y-2">
                <Label>Attribute</Label>
                <Input
                  value={tcgSpecificData.attribute || ""}
                  onChange={(e) => handleTcgDataChange('attribute', e.target.value)}
                  placeholder="e.g., DARK, LIGHT"
                />
              </div>
              <div className="space-y-2">
                <Label>Level/Rank</Label>
                <Input
                  value={tcgSpecificData.level || ""}
                  onChange={(e) => handleTcgDataChange('level', e.target.value)}
                  placeholder="e.g., 4, 8"
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="description">Notes / Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Add any additional information about this card..."
            rows={4}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => navigate('/my-cards')}>
            Cancel
          </Button>
          <Button type="submit">
            Add to Collection
          </Button>
        </div>
      </form>
    </div>
  );
}
