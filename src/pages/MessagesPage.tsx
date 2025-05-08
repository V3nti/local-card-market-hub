
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ChatConversation } from "@/components/ChatConversation";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const MESSAGES = [
  {
    id: "1",
    sender: "Alex Thompson",
    avatar: "",
    message: "Hi, is the Charizard card still available?",
    time: "2d ago"
  },
  {
    id: "2",
    sender: "Morgan Lee",
    avatar: "",
    message: "Would you take $200 for the Black Lotus?",
    time: "1w ago"
  },
  {
    id: "3",
    sender: "Jamie Wilson",
    avatar: "",
    message: "Thanks for the trade! Great condition.",
    time: "2w ago"
  }
];

export default function MessagesPage() {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  
  const handleMessageClick = (id: string) => {
    setSelectedChat(id);
    toast({
      title: "Conversation",
      description: "Opening chat with " + MESSAGES.find(m => m.id === id)?.sender
    });
  };

  const selectedChatDetails = selectedChat ? MESSAGES.find(m => m.id === selectedChat) : null;
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Messages</h2>
      
      <div className="space-y-4">
        {MESSAGES.map((message) => (
          <div 
            key={message.id}
            className="bg-card rounded-lg p-4 shadow flex items-center gap-3 cursor-pointer hover:bg-card/80 transition-colors"
            onClick={() => handleMessageClick(message.id)}
          >
            <div className="h-12 w-12 rounded-full bg-muted"></div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="font-medium">{message.sender}</p>
                <span className="text-xs text-muted-foreground">{message.time}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{message.message}</p>
            </div>
          </div>
        ))}
      </div>

      <Sheet open={!!selectedChat} onOpenChange={() => setSelectedChat(null)}>
        <SheetContent side="right" className="p-0 w-full sm:max-w-md">
          {selectedChatDetails && (
            <ChatConversation 
              contact={{
                id: selectedChatDetails.id,
                sender: selectedChatDetails.sender,
                avatar: selectedChatDetails.avatar
              }}
              onClose={() => setSelectedChat(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
