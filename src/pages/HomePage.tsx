
import React from "react";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Home</h2>
      
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Latest News</h3>
        <div className="bg-card rounded-lg p-4 shadow">
          <h4 className="font-medium">New Sets Released</h4>
          <p className="text-muted-foreground">Check out the latest TCG releases and updates.</p>
        </div>
      </section>
      
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Notifications</h3>
        <div className="bg-card rounded-lg p-4 shadow">
          <p>You have no new notifications</p>
        </div>
      </section>
      
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Featured Cards</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-lg p-4 shadow flex flex-col items-center">
            <div className="bg-muted w-full h-40 rounded-md mb-2"></div>
            <p className="font-medium">Charizard</p>
            <p className="text-sm text-muted-foreground">Pokemon</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow flex flex-col items-center">
            <div className="bg-muted w-full h-40 rounded-md mb-2"></div>
            <p className="font-medium">Black Lotus</p>
            <p className="text-sm text-muted-foreground">MTG</p>
          </div>
        </div>
      </section>
    </div>
  );
}
