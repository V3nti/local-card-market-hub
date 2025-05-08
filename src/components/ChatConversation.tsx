
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isMe: boolean;
}

interface ChatConversationProps {
  contact: {
    id: string;
    sender: string;
    avatar: string;
  };
  onClose: () => void;
}

export function ChatConversation({ contact, onClose }: ChatConversationProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: contact.sender,
      content: "Hi, is the Charizard card still available?",
      timestamp: "2d ago",
      isMe: false,
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: "You",
        content: newMessage,
        timestamp: "Just now",
        isMe: true,
      };
      
      setMessages([...messages, message]);
      setNewMessage("");
      
      // Simulate a reply after a short delay
      setTimeout(() => {
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          sender: contact.sender,
          content: "Thanks for the reply! Are you willing to negotiate on the price?",
          timestamp: "Just now",
          isMe: false,
        };
        setMessages(prev => [...prev, reply]);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Back
        </Button>
        <div className="h-10 w-10 rounded-full bg-muted"></div>
        <span className="font-medium">{contact.sender}</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.isMe 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}
            >
              <p>{message.content}</p>
              <span className="text-xs opacity-70 block text-right mt-1">
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4 flex gap-2">
        <Textarea 
          placeholder="Type a message..." 
          className="min-h-[60px] resize-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Button 
          className="self-end" 
          size="icon" 
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
