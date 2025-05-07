
import React from "react";

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Messages</h2>
      
      <div className="space-y-4">
        <div className="bg-card rounded-lg p-4 shadow flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-muted"></div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="font-medium">Alex Thompson</p>
              <span className="text-xs text-muted-foreground">2d ago</span>
            </div>
            <p className="text-sm text-muted-foreground truncate">Hi, is the Charizard card still available?</p>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-4 shadow flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-muted"></div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="font-medium">Morgan Lee</p>
              <span className="text-xs text-muted-foreground">1w ago</span>
            </div>
            <p className="text-sm text-muted-foreground truncate">Would you take $200 for the Black Lotus?</p>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-4 shadow flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-muted"></div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="font-medium">Jamie Wilson</p>
              <span className="text-xs text-muted-foreground">2w ago</span>
            </div>
            <p className="text-sm text-muted-foreground truncate">Thanks for the trade! Great condition.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
