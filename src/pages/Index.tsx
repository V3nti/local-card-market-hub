
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to TCG Marketplace</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Cards</CardTitle>
            <CardDescription>View and manage your card collection</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Organize your cards by game and manage your collection.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Market</CardTitle>
            <CardDescription>Browse cards for sale in your area</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Find cards for sale, trade or auction from local collectors.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Chat with other collectors</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Negotiate deals and arrange meetups with other TCG enthusiasts.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
