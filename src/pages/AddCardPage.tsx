
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

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

  const handleSelectPrinting = (printingData: any) => {
    setSelectedPrinting(printingData);
    
    // Update form with selected printing data
    if (printingData) {
      // Update the form data with the selected printing
      const tcgType = formData.tcgType;
      const newTcgData: Record<string, any> = {};
      
      if (tcgType === "MTG") {
        newTcgData.colorIdentity = printingData.color_identity?.join(", ") || "";
        newTcgData.cardType = printingData.type_line || "";
        newTcgData.manaCost = printingData.mana_cost || "";
        setFormData(prev => ({
          ...prev,
          rarity: printingData.rarity || prev.rarity,
        }));
      } else if (tcgType === "Pokemon") {
        newTcgData.pokemonType = printingData.types?.join(", ") || "";
        newTcgData.hp = printingData.hp || "";
        newTcgData.stage = printingData.subtypes?.includes("Stage 1") ? "Stage 1" : 
                printingData.subtypes?.includes("Stage 2") ? "Stage 2" :
                printingData.subtypes?.includes("VMAX") ? "VMAX" :
                printingData.subtypes?.includes("V") ? "V" : "Basic";
        setFormData(prev => ({
          ...prev,
          rarity: printingData.rarity || prev.rarity,
        }));
      } else if (tcgType === "Yu-Gi-Oh") {
        newTcgData.cardType = printingData.type || "";
        newTcgData.monsterType = printingData.race || "";
        newTcgData.attribute = printingData.attribute || "";
        newTcgData.level = printingData.level?.toString() || "";
        setFormData(prev => ({
          ...prev,
          rarity: printingData.card_sets?.[0]?.set_rarity || prev.rarity,
        }));
      }
      
      setTcgSpecificData(newTcgData);
    }
  };

  const searchCard = async () => {
    if (!formData.name || !API_ENDPOINTS[formData.tcgType as keyof typeof API_ENDPOINTS]) {
      return;
    }

    setIsSearching(true);
    
    try {
      const apiUrl = API_ENDPOINTS[formData.tcgType as keyof typeof API_ENDPOINTS];
      if (!apiUrl) {
        toast({
          variant: "destructive",
          title: "API Not Available",
          description: `No API support for ${formData.tcgType} cards yet.`,
        });
        setIsSearching(false);
        return;
      }

      // For MTG, search for all printings
      if (formData.tcgType === "MTG") {
        const response = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(formData.name)}`);
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          // Filter to get only cards with the exact name (case-insensitive)
          const exactMatches = data.data.filter((card: any) => 
            card.name.toLowerCase() === formData.name.toLowerCase());
          
          const printings = exactMatches.length > 0 ? exactMatches : [data.data[0]];
          
          setAvailablePrintings(printings);
          
          // Auto-select the first printing
          const firstCard = printings[0];
          setSelectedPrinting(firstCard);
          
          // Update the form with found data
          setFormData(prev => ({
            ...prev,
            name: firstCard.name,
            rarity: firstCard.rarity || prev.rarity,
          }));
          
          // Update TCG-specific data
          const newTcgData: Record<string, any> = {};
          newTcgData.colorIdentity = firstCard.color_identity?.join(", ") || "";
          newTcgData.cardType = firstCard.type_line || "";
          newTcgData.manaCost = firstCard.mana_cost || "";
          
          setTcgSpecificData(newTcgData);
          setSearchResults({
            name: firstCard.name,
            rarity: firstCard.rarity,
            image: firstCard.image_uris?.normal || "",
          });
          
          if (printings.length > 1) {
            // Only show success toast if we have more than one printing
            toast({
              title: "Multiple Printings Found",
              description: `Found ${printings.length} printings for ${firstCard.name}`
            });
          }
        } else {
          toast({
            variant: "destructive",
            title: "Card Not Found",
            description: "Could not find card with that name"
          });
        }
      } 
      // Pokemon TCG API
      else if (formData.tcgType === "Pokemon") {
        const response = await fetch(`${apiUrl}${encodeURIComponent(formData.name)}`);
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          setAvailablePrintings(data.data);
          
          // Auto-select the first printing
          const firstCard = data.data[0];
          setSelectedPrinting(firstCard);
          
          const processedData = {
            name: firstCard.name,
            rarity: firstCard.rarity || "",
            pokemonType: firstCard.types?.join(", ") || "",
            hp: firstCard.hp || "",
            stage: firstCard.subtypes?.includes("Stage 1") ? "Stage 1" : 
                  firstCard.subtypes?.includes("Stage 2") ? "Stage 2" :
                  firstCard.subtypes?.includes("VMAX") ? "VMAX" :
                  firstCard.subtypes?.includes("V") ? "V" : "Basic",
            image: firstCard.images?.small || "",
          };
          
          setSearchResults(processedData);
          
          // Update form with found data
          setFormData(prev => ({
            ...prev,
            name: processedData.name,
            rarity: processedData.rarity || prev.rarity,
          }));
          
          // Update TCG-specific data
          const newTcgData: Record<string, any> = {};
          newTcgData.pokemonType = processedData.pokemonType;
          newTcgData.hp = processedData.hp;
          newTcgData.stage = processedData.stage;
          
          setTcgSpecificData(newTcgData);
          
          if (data.data.length > 1) {
            toast({
              title: "Multiple Printings Found",
              description: `Found ${data.data.length} printings for ${processedData.name}`
            });
          }
        } else {
          toast({
            variant: "destructive",
            title: "Card Not Found",
            description: "Could not find card with that name"
          });
        }
      } 
      // Yu-Gi-Oh API
      else if (formData.tcgType === "Yu-Gi-Oh") {
        const response = await fetch(`${apiUrl}${encodeURIComponent(formData.name)}`);
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
          
          // Auto-select the first printing
          setSelectedPrinting(printings[0]);
          
          const processedData = {
            name: firstCard.name,
            rarity: firstCard.card_sets?.[0]?.set_rarity || "",
            cardType: firstCard.type || "",
            monsterType: firstCard.race || "",
            attribute: firstCard.attribute || "",
            level: firstCard.level?.toString() || "",
            image: printings[0].image || firstCard.card_images?.[0]?.image_url || "",
          };
          
          setSearchResults(processedData);
          
          // Update form with found data
          setFormData(prev => ({
            ...prev,
            name: processedData.name,
            rarity: processedData.rarity || prev.rarity,
          }));
          
          // Update TCG-specific data
          const newTcgData: Record<string, any> = {};
          newTcgData.cardType = processedData.cardType;
          newTcgData.monsterType = processedData.monsterType;
          newTcgData.attribute = processedData.attribute;
          newTcgData.level = processedData.level;
          
          setTcgSpecificData(newTcgData);
          
          if (printings.length > 1) {
            toast({
              title: "Multiple Printings Found",
              description: `Found ${printings.length} printings for ${processedData.name}`
            });
          }
        } else {
          toast({
            variant: "destructive",
            title: "Card Not Found",
            description: "Could not find card with that name"
          });
        }
      }
    } catch (error) {
      console.error("Error searching card:", error);
      toast({
        variant: "destructive",
        title: "Search Error",
        description: "Failed to search for card data"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCard = {
      name: formData.name,
      rarity: formData.rarity,
      condition: formData.condition,
      image: selectedPrinting?.image_uris?.normal || 
             selectedPrinting?.image || 
             searchResults?.image || "", 
      description: formData.description,
      copies: parseInt(formData.copies),
      isGraded: formData.isGraded,
      gradingInfo: formData.isGraded ? {
        company: formData.gradingCompany,
        grade: formData.grade
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
    
    toast({
      variant: "default",
      title: "Card Added",
      description: `${formData.name} has been added to your collection`
    });
    
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
              <Input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            {API_ENDPOINTS[formData.tcgType as keyof typeof API_ENDPOINTS] && (
              <Button 
                type="button" 
                onClick={searchCard} 
                disabled={isSearching || !formData.name}
                className="mb-0.5"
              >
                <Search className="mr-1 h-4 w-4" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
            )}
          </div>
          {!API_ENDPOINTS[formData.tcgType as keyof typeof API_ENDPOINTS] && (
            <p className="text-xs text-muted-foreground">
              No API lookup available for {formData.tcgType} cards.
            </p>
          )}
        </div>
        
        {/* Printing selection */}
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
        
        {/* Number of copies */}
        <div className="space-y-2">
          <Label htmlFor="copies">Number of Copies</Label>
          <Input 
            id="copies"
            name="copies"
            type="number"
            min="1"
            value={formData.copies}
            onChange={handleInputChange}
            required
          />
        </div>
        
        {/* TCG-specific fields */}
        {TCG_FIELDS[formData.tcgType as keyof typeof TCG_FIELDS]?.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            {field.type === "input" ? (
              <Input
                id={field.name}
                name={field.name}
                value={tcgSpecificData[field.name] || ""}
                onChange={(e) => handleTcgSpecificChange(field.name, e.target.value)}
              />
            ) : field.type === "select" ? (
              <Select
                value={tcgSpecificData[field.name] || ""}
                onValueChange={(value) => handleTcgSpecificChange(field.name, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${field.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
          </div>
        ))}
        
        <div className="space-y-2">
          <Label htmlFor="rarity">Rarity</Label>
          <Input 
            id="rarity"
            name="rarity"
            value={formData.rarity}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Condition</Label>
          <RadioGroup 
            defaultValue={formData.condition}
            onValueChange={(value) => handleSelectChange("condition", value)}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="NM" id="nm" />
              <Label htmlFor="nm">NM (Near Mint)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="LP" id="lp" />
              <Label htmlFor="lp">LP (Lightly Played)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="MP" id="mp" />
              <Label htmlFor="mp">MP (Moderately Played)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="HP" id="hp" />
              <Label htmlFor="hp">HP (Heavily Played)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="DMG" id="dmg" />
              <Label htmlFor="dmg">DMG (Damaged)</Label>
            </div>
          </RadioGroup>
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
