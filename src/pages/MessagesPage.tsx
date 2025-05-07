
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

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
  
  const handleMessageClick = (id: string) => {
    toast({
      title: "Conversation",
      description: "Opening chat with " + MESSAGES.find(m => m.id === id)?.sender
    });
    // This would navigate to a conversation page in a real app
    console.log("Message clicked:", id);
  };
  
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
    </div>
  );
}
