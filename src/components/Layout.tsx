
import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Home, CreditCard, ShoppingCart, User, MessageSquare } from "lucide-react";

export function Layout() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors flex flex-col">
      <header className="border-b border-border py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-xl font-semibold">TCG Marketplace</h1>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="container mx-auto p-4 flex-1 pb-16">
        <Outlet />
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-2 px-4">
        <div className="flex justify-between items-center">
          <NavLink 
            to="/" 
            className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </NavLink>
          
          <NavLink 
            to="/my-cards" 
            className={`flex flex-col items-center p-2 ${isActive('/my-cards') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <CreditCard size={24} />
            <span className="text-xs mt-1">Collection</span>
          </NavLink>
          
          <NavLink 
            to="/market" 
            className={`flex flex-col items-center p-2 ${isActive('/market') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <ShoppingCart size={24} />
            <span className="text-xs mt-1">Market</span>
          </NavLink>
          
          <NavLink 
            to="/messages" 
            className={`flex flex-col items-center p-2 ${isActive('/messages') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <MessageSquare size={24} />
            <span className="text-xs mt-1">Messages</span>
          </NavLink>
          
          <NavLink 
            to="/profile" 
            className={`flex flex-col items-center p-2 ${isActive('/profile') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <User size={24} />
            <span className="text-xs mt-1">Profile</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
