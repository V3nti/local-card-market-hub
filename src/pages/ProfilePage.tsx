
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profile</h2>
      
      <section className="bg-card rounded-lg p-5 shadow space-y-4">
        <h3 className="text-xl font-medium">Account Information</h3>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Name</label>
            <Input defaultValue="John Smith" />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input defaultValue="john@example.com" />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Address</label>
            <Input defaultValue="123 Card St, Trading City" />
          </div>
          
          <Button className="w-full">Update Profile</Button>
        </div>
      </section>
      
      <section className="bg-card rounded-lg p-5 shadow space-y-4">
        <h3 className="text-xl font-medium">Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Maximum Travel Distance</p>
              <p className="text-sm text-muted-foreground">Distance you're willing to travel</p>
            </div>
            <div className="w-16">
              <Input defaultValue="25" suffix="km" />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">Change app appearance</p>
            </div>
            <ThemeToggle />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications</p>
              <p className="text-sm text-muted-foreground">Receive app notifications</p>
            </div>
            <Switch />
          </div>
        </div>
      </section>
    </div>
  );
}
