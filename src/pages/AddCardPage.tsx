
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

const TCG_TYPES = ["MTG", "Pokemon", "Yu-Gi-Oh", "One Piece", "Flesh and Blood"];

// TCG-specific fields
const TCG_FIELDS = {
  "MTG": [
    { name: "colorIdentity", label: "Color Identity", type: "select", options: ["White", "Blue", "Black", "Red", "Green", "Colorless", "Multicolor"] },
    { name: "cardType", label: "Card Type", type: "select", options: ["Creature", "Instant", "Sorcery", "Artifact", "Enchantment", "Planeswalker", "Land"] },
    { name: "manaCost", label: "Mana Cost", type: "input" },
  ],
  "Pokemon": [
    { name: "pokemonType", label: "Pokémon Type", type: "select", options: ["Normal", "Fire", "Water", "Grass", "Electric", "Fighting", "Psychic", "Darkness", "Metal", "Fairy", "Dragon"] },
    { name: "hp", label: "HP", type: "input" },
    { name: "stage", label: "Evolution Stage", type: "select", options: ["Basic", "Stage 1", "Stage 2", "V", "VMAX", "VSTAR", "GX", "EX"] },
  ],
  "Yu-Gi-Oh": [
    { name: "cardType", label: "Card Type", type: "select", options: ["Monster", "Spell", "Trap"] },
    { name: "monsterType", label: "Monster Type", type: "select", options: ["Normal", "Effect", "Fusion", "Ritual", "Synchro", "Xyz", "Pendulum", "Link"] },
    { name: "attribute", label: "Attribute", type: "select", options: ["DARK", "LIGHT", "EARTH", "WATER", "FIRE", "WIND", "DIVINE"] },
    { name: "level", label: "Level/Rank", type: "input" },
  ],
  "One Piece": [
    { name: "color", label: "Color", type: "select", options: ["Red", "Green", "Blue", "Purple", "Black", "Yellow"] },
    { name: "cardType", label: "Card Type", type: "select", options: ["Leader", "Character", "Event", "Stage", "Don!!"] },
    { name: "cost", label: "Cost", type: "input" },
  ],
  "Flesh and Blood": [
    { name: "class", label: "Class", type: "select", options: ["Ninja", "Warrior", "Brute", "Guardian", "Wizard", "Ranger", "Mechanologist", "Runeblade", "Generic"] },
    { name: "cardType", label: "Card Type", type: "select", options: ["Attack", "Defense", "Attack Reaction", "Defense Reaction", "Instant", "Action", "Equipment"] },
    { name: "pitValue", label: "Pitch Value", type: "select", options: ["1 (Red)", "2 (Yellow)", "3 (Blue)"] },
  ]
};

// API endpoints for card lookup
const API_ENDPOINTS = {
  "MTG": "https://api.scryfall.com/cards/named?fuzzy=",
  "Pokemon": "https://api.pokemontcg.io/v2/cards?q=name:",
  "Yu-Gi-Oh": "https://db.ygoprodeck.com/api/v7/cardinfo.php?name=",
  "One Piece": null, // No public API available
  "Flesh and Blood": null, // No public API available
};

// Grading companies
const GRADING_COMPANIES = [
  { value: "psa", label: "PSA (Professional Sports Authenticator)" },
  { value: "bgs", label: "BGS (Beckett Grading Services)" },
  { value: "cgc", label: "CGC (Certified Guaranty Company)" },
  { value: "sgc", label: "SGC (Sportscard Guaranty)" },
  { value: "ags", label: "AGS (Alternate Grading System)" },
  { value: "other", label: "Other" }
];

// Grading scales by company
const GRADING_SCALES = {
  "psa": Array.from({ length: 11 }, (_, i) => ({ value: `${i}`, label: `${i}` })),
  "bgs": [
    ...[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]
      .map(grade => ({ value: `${grade}`, label: `${grade}` }))
  ],
  "cgc": [
    ...[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]
      .map(grade => ({ value: `${grade}`, label: `${grade}` }))
  ],
  "sgc": Array.from({ length: 11 }, (_, i) => ({ value: `${i}`, label: `${i}` })),
  "ags": Array.from({ length: 11 }, (_, i) => ({ value: `${i}`, label: `${i}` })),
  "other": Array.from({ length: 11 }, (_, i) => ({ value: `${i}`, label: `${i}` }))
};

// Language options
const LANGUAGE_OPTIONS = [
  "English", "Japanese", "Korean", "Chinese Simplified", "Chinese Traditional",
  "German", "Spanish", "French", "Italian", "Portuguese", "Russian"
];

export default function AddCardPage() {
  const [formData, setFormData] = useState({
    name: "",
    tcgType: "MTG",
    rarity: "",
    condition: "NM",
    description: "",
    copies: "1",
    isGraded: false,
    gradingCompany: "",
    grade: "",
    language: "English",
    isFoil: false,
  });
  const [tcgSpecificData, setTcgSpecificData] = useState<Record<string, any>>({});
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [availablePrintings, setAvailablePrintings] = useState<any[]>([]);
  const [selectedPrinting, setSelectedPrinting] = useState<any>(null);
  
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Limit description to 128 characters
    if (name === "description" && value.length > 128) {
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "tcgType") {
      // Reset TCG-specific fields when changing TCG type
      setTcgSpecificData({});
      setSearchResults(null);
      setAvailablePrintings([]);
      setSelectedPrinting(null);
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleTcgSpecificChange = (name: string, value: string) => {
    setTcgSpecificData({ ...tcgSpecificData, [name]: value });
  };

  const handleCardSelect = (cardData: any) => {
    // Update the form data with the selected card
    const tcgType = formData.tcgType;
    
    // Fetch card printings
    const fetchPrintings = async () => {
      try {
        setIsSearching(true);
        
        if (tcgType === "MTG") {
          const searchName = cardData.name.replace(/[/\\^$*+?.()|[\]{}]/g, '');
          const response = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(`!"${searchName}"`)}`);
          const data = await response.json();
          
          if (data.data && data.data.length > 0) {
            setAvailablePrintings(data.data);
            setSelectedPrinting(data.data[0]);
            
            // Update form data with the first printing's details
            updateFormFromMTGCard(data.data[0]);
          }
        }
        else if (tcgType === "Pokemon") {
          const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:"${encodeURIComponent(cardData.name)}"`);
          const data = await response.json();
          
          if (data.data && data.data.length > 0) {
            setAvailablePrintings(data.data);
            setSelectedPrinting(data.data[0]);
            
            // Update form data with the first printing's details
            updateFormFromPokemonCard(data.data[0]);
          }
        }
        else if (tcgType === "Yu-Gi-Oh") {
          const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(cardData.name)}`);
          const data = await response.json();
          
          if (data.data && data.data.length > 0) {
            const firstCard = data.data[0];
            
            // Yu-Gi-Oh cards often have multiple card_images for different printings
            const printings = firstCard.card_images?.map((img: any, index: number) => ({
              ...firstCard,
              printing_index: index,
              image: img.image_url,
              set_name: firstCard.card_sets?.[index]?.set_name || `Printing ${index + 1}`
            })) || [firstCard];
            
            setAvailablePrintings(printings);
            setSelectedPrinting(printings[0]);
            
            // Update form data with the first printing's details
            updateFormFromYuGiOhCard(printings[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching card printings:", error);
      } finally {
        setIsSearching(false);
      }
    };
    
    fetchPrintings();
  };

  const updateFormFromMTGCard = (card: any) => {
    setFormData(prev => ({
      ...prev,
      name: card.name,
      rarity: card.rarity || prev.rarity,
    }));
    
    // Update TCG-specific data
    const newTcgData: Record<string, any> = {};
    newTcgData.colorIdentity = card.color_identity?.join(", ") || "";
    newTcgData.cardType = card.type_line || "";
    newTcgData.manaCost = card.mana_cost || "";
    
    setTcgSpecificData(newTcgData);
    
    setSearchResults({
      name: card.name,
      rarity: card.rarity,
      image: card.image_uris?.normal || card.card_faces?.[0].image_uris?.normal || "",
    });
  };
  
  const updateFormFromPokemonCard = (card: any) => {
    setFormData(prev => ({
      ...prev,
      name: card.name,
      rarity: card.rarity || prev.rarity,
    }));
    
    // Update TCG-specific data
    const newTcgData: Record<string, any> = {};
    newTcgData.pokemonType = card.types?.join(", ") || "";
    newTcgData.hp = card.hp || "";
    newTcgData.stage = card.subtypes?.includes("Stage 1") ? "Stage 1" : 
            card.subtypes?.includes("Stage 2") ? "Stage 2" :
            card.subtypes?.includes("VMAX") ? "VMAX" :
            card.subtypes?.includes("V") ? "V" : "Basic";
    
    setTcgSpecificData(newTcgData);
    
    setSearchResults({
      name: card.name,
      rarity: card.rarity,
      image: card.images?.small || "",
    });
  };
  
  const updateFormFromYuGiOhCard = (card: any) => {
    setFormData(prev => ({
      ...prev,
      name: card.name,
      rarity: card.card_sets?.[0]?.set_rarity || prev.rarity,
    }));
    
    // Update TCG-specific data
    const newTcgData: Record<string, any> = {};
    newTcgData.cardType = card.type || "";
    newTcgData.monsterType = card.race || "";
    newTcgData.attribute = card.attribute || "";
    newTcgData.level = card.level?.toString() || "";
    
    setTcgSpecificData(newTcgData);
    
    setSearchResults({
      name: card.name,
      rarity: card.card_sets?.[0]?.set_rarity || "",
      image: card.image || card.card_images?.[0]?.image_url || "",
    });
  };

  const handleSelectPrinting = (printing: any) => {
    setSelectedPrinting(printing);
    
    // Update form with selected printing data
    if (printing) {
      const tcgType = formData.tcgType;
      
      if (tcgType === "MTG") {
        updateFormFromMTGCard(printing);
      } else if (tcgType === "Pokemon") {
        updateFormFromPokemonCard(printing);
      } else if (tcgType === "Yu-Gi-Oh") {
        updateFormFromYuGiOhCard(printing);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCard = {
      name: formData.name,
      rarity: formData.rarity,
      condition: formData.condition,
      language: formData.language,
      isFoil: formData.isFoil,
      image: selectedPrinting?.image_uris?.normal || 
             selectedPrinting?.image || 
             searchResults?.image || "", 
      description: formData.description,
      copies: parseInt(formData.copies),
      isGraded: formData.isGraded,
      gradingInfo: formData.isGraded ? {
        company: formData.gradingCompany,
        grade: formData.grade,
        subGrades: tcgSpecificData.gradingSubCategories || null
      } : null,
      ...tcgSpecificData
    };
    
    // Store in localStorage directly
    const storedCards = localStorage.getItem('cardCollections');
    let cardCollections = storedCards ? JSON.parse(storedCards) : {
      "MTG": [],
      "Pokemon": [],
      "Yu-Gi-Oh": [],
      "One Piece": [],
      "Flesh and Blood": []
    };
    
    // Add new card with unique ID
    cardCollections[formData.tcgType] = [
      ...cardCollections[formData.tcgType],
      {
        ...newCard,
        id: Date.now().toString()
      }
    ];
    
    // Save back to localStorage
    localStorage.setItem('cardCollections', JSON.stringify(cardCollections));
    
    // Only show error toasts, not success ones
    if (process.env.NODE_ENV === "development") {
      toast({
        variant: "default",
        title: "Card Added",
        description: `${formData.name} has been added to your collection`
      });
    }
    
    // Navigate back to Collection
    navigate("/my-cards");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Add Card</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tcgType">TCG Type</Label>
          <Select 
            name="tcgType" 
            value={formData.tcgType}
            onValueChange={(value) => handleSelectChange("tcgType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select TCG Type" />
            </SelectTrigger>
            <SelectContent>
              {TCG_TYPES.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="name">Card Name</Label>
              <CardAutoComplete
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value })}
                onSelect={handleCardSelect}
                tcgType={formData.tcgType}
                placeholder="Enter card name"
              />
            </div>
            {API_ENDPOINTS[formData.tcgType as keyof typeof API_ENDPOINTS] && formData.name && !isSearching && !searchResults && (
              <Button 
                type="button" 
                onClick={() => handleCardSelect({ name: formData.name })} 
                className="mb-0.5"
              >
                <Search className="mr-1 h-4 w-4" />
                Search
              </Button>
            )}
          </div>
          {!API_ENDPOINTS[formData.tcgType as keyof typeof API_ENDPOINTS] && (
            <p className="text-xs text-muted-foreground">
              No API lookup available for {formData.tcgType} cards.
            </p>
          )}
        </div>
        
        {/* Number of copies with +/- buttons */}
        <div className="space-y-2">
          <Label htmlFor="copies">Number of Copies</Label>
          <NumberInput
            value={formData.copies}
            onChange={(value) => setFormData({ ...formData, copies: value })}
            min={1}
            max={999}
          />
        </div>
        
        {/* Card condition as a slider */}
        <div className="space-y-2">
          <Label>Condition</Label>
          <ConditionSlider 
            value={formData.condition}
            onChange={(value) => handleSelectChange("condition", value)}
          />
        </div>
        
        {/* Foil/Holo option */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isFoil" 
              checked={formData.isFoil}
              onCheckedChange={(checked) => {
                setFormData({
                  ...formData,
                  isFoil: checked === true,
                });
              }}
            />
            <Label htmlFor="isFoil">
              {formData.tcgType === "Pokemon" ? "Holographic" : "Foil"}
            </Label>
          </div>
        </div>
        
        {/* Language selection */}
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select 
            value={formData.language}
            onValueChange={(value) => handleSelectChange("language", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map((lang) => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Grading Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isGraded" 
              checked={formData.isGraded}
              onCheckedChange={(checked) => {
                setFormData({
                  ...formData,
                  isGraded: checked === true,
                  gradingCompany: checked === true ? formData.gradingCompany : "",
                  grade: checked === true ? formData.grade : ""
                });
              }}
            />
            <Label htmlFor="isGraded">This card is graded</Label>
          </div>
          
          {formData.isGraded && (
            <div className="space-y-4 pl-6">
              <div className="space-y-2">
                <Label htmlFor="gradingCompany">Grading Company</Label>
                <Select 
                  value={formData.gradingCompany}
                  onValueChange={(value) => handleSelectChange("gradingCompany", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Grading Company" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADING_COMPANIES.map((company) => (
                      <SelectItem key={company.value} value={company.value}>
                        {company.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {formData.gradingCompany && (
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Select 
                    value={formData.grade}
                    onValueChange={(value) => handleSelectChange("grade", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {GRADING_SCALES[formData.gradingCompany as keyof typeof GRADING_SCALES]?.map((grade) => (
                        <SelectItem key={grade.value} value={grade.value}>
                          {grade.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {formData.gradingCompany === "bgs" && formData.grade && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="centering">Centering</Label>
                    <Select 
                      onValueChange={(value) => setTcgSpecificData({ 
                        ...tcgSpecificData, 
                        gradingSubCategories: { 
                          ...tcgSpecificData.gradingSubCategories, 
                          centering: value 
                        } 
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Centering Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADING_SCALES["bgs"].map(grade => (
                          <SelectItem key={`centering-${grade.value}`} value={grade.value}>
                            {grade.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="corners">Corners</Label>
                    <Select 
                      onValueChange={(value) => setTcgSpecificData({ 
                        ...tcgSpecificData, 
                        gradingSubCategories: { 
                          ...tcgSpecificData.gradingSubCategories, 
                          corners: value 
                        } 
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Corners Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADING_SCALES["bgs"].map(grade => (
                          <SelectItem key={`corners-${grade.value}`} value={grade.value}>
                            {grade.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edges">Edges</Label>
                    <Select 
                      onValueChange={(value) => setTcgSpecificData({ 
                        ...tcgSpecificData, 
                        gradingSubCategories: { 
                          ...tcgSpecificData.gradingSubCategories, 
                          edges: value 
                        } 
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Edges Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADING_SCALES["bgs"].map(grade => (
                          <SelectItem key={`edges-${grade.value}`} value={grade.value}>
                            {grade.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="surface">Surface</Label>
                    <Select 
                      onValueChange={(value) => setTcgSpecificData({ 
                        ...tcgSpecificData, 
                        gradingSubCategories: { 
                          ...tcgSpecificData.gradingSubCategories, 
                          surface: value 
                        } 
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Surface Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADING_SCALES["bgs"].map(grade => (
                          <SelectItem key={`surface-${grade.value}`} value={grade.value}>
                            {grade.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="description">Description (Optional)</Label>
            <span className="text-xs text-muted-foreground">
              {formData.description.length}/128
            </span>
          </div>
          <Textarea 
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            maxLength={128}
          />
        </div>
        
        {/* Printing selection */}
        {availablePrintings.length > 0 && (
          <div className="space-y-4">
            {searchResults?.image && (
              <div className="flex justify-center">
                <div className="border rounded p-2">
                  <img 
                    src={selectedPrinting?.image_uris?.normal || 
                          selectedPrinting?.image || 
                          searchResults.image} 
                    alt={formData.name} 
                    className="h-48 object-contain" 
                  />
                </div>
              </div>
            )}
            
            {availablePrintings.length > 1 && (
              <div className="space-y-2">
                <Label htmlFor="printing">Select Printing</Label>
                <Select 
                  value={selectedPrinting ? JSON.stringify(selectedPrinting) : ""}
                  onValueChange={(value) => handleSelectPrinting(JSON.parse(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Printing" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePrintings.map((printing, index) => {
                      const setName = printing.set_name || 
                                    printing.set || 
                                    (formData.tcgType === "MTG" && printing.set) || 
                                    `Printing ${index + 1}`;
                      return (
                        <SelectItem 
                          key={index} 
                          value={JSON.stringify(printing)}
                        >
                          {setName}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
        
        {/* Card details section - moved to bottom */}
        {searchResults && (
          <div className="space-y-4 p-4 bg-muted/40 rounded-lg">
            <h3 className="font-semibold">Card Details</h3>
            
            {/* TCG-specific fields - now read-only */}
            {TCG_FIELDS[formData.tcgType as keyof typeof TCG_FIELDS]?.map((field) => (
              <div key={field.name} className="space-y-1">
                <Label htmlFor={field.name}>{field.label}</Label>
                <div className="bg-background border rounded px-3 py-2 text-sm">
                  {tcgSpecificData[field.name] || "N/A"}
                </div>
              </div>
            ))}
            
            <div className="space-y-1">
              <Label htmlFor="rarity">Rarity</Label>
              <div className="bg-background border rounded px-3 py-2 text-sm">
                {formData.rarity || "N/A"}
              </div>
            </div>
          </div>
        )}
        
        <div className="pt-4 flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate("/my-cards")}
          >
            Cancel
          </Button>
          <Button type="submit">Save Card</Button>
        </div>
      </form>
    </div>
  );
}
