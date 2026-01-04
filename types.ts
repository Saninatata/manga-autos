import React from 'react';

export interface Car {
  id: number;
  model: string;
  brand: string;
  price: number;
  category: 'Sport' | 'SUV' | 'Electric' | 'Sedan';
  image: string;
  engine?: string; // Added for AI details
  specs: {
    hp: number;
    zeroToSixty: string;
    topSpeed: string;
  };
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}