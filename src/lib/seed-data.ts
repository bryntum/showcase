import { Prisma } from "@prisma/client";

export const userData: Prisma.UserCreateInput[] = [
  {
    name: "Alice",
    email: "alice@bryntum.com",
  },
  {
    name: "Bob",
    email: "bob@bryntum.com",
  },
];

export const depotData: Prisma.DepotCreateInput[] = [
  {
    name: "Central Food Distribution Center",
    address: "123 Logistics Park, Food Valley, 12345",
    lat: 40.709023594717536,
    lng: -74.00700174450272,
  },
  {
    name: "North Regional Food Hub",
    address: "456 Cold Storage Lane, North City, 67890",
    lat: 40.71229054527143,
    lng: -73.97979278862823,
  },
  {
    name: "South Fresh Food Center",
    address: "789 Refrigeration Road, South Town, 54321",
    lat: 40.765789909971986,
    lng: -73.98665539905849,
  },
];

export const driverData: Prisma.DriverCreateInput[] = [
  { name: "John Smith" },
  { name: "Maria Garcia" },
  { name: "David Chen" },
  { name: "Sarah Johnson" },
  { name: "James Brown" },
  { name: "Emily White" },
  { name: "Michael Davis" },
  { name: "Olivia Martinez" },
  { name: "William Miller" },
  { name: "Sophia Wilson" },
];

export const clientData: Prisma.ClientCreateInput[] = [
  { name: "Fresh Market Supermarket", lat: 40.72693554783477, lng: -74.00210848248311 },
  { name: "Organic Foods Co-op", lat: 40.730419654603104, lng: -73.98248742332565 },
  { name: "Gourmet Restaurant Chain", lat: 40.73503812705434, lng: -73.99743208999335 },
  { name: "School District Food Services", lat: 40.72003511014683, lng: -74.0096603895488 },
  { name: "Urban Health Food Market", lat: 40.759746495690514, lng: -73.97039373369812 },
  { name: "Corporate Cafeteria Services", lat: 40.75119725885228, lng: -73.96952247827048 },
  { name: "Luxury Hotel Chain", lat: 40.742324437568364, lng: -73.98371965982513 },
  { name: "Regional Hospital Network", lat: 40.72835737849349, lng: -73.97886239183941 },
  { name: "Airport Food Services", lat: 40.7173748026169, lng: -73.98421745164303 },
  { name: "University Dining Services", lat: 40.702978141818676, lng: -73.9822659824251 },
  { name: "Premium Catering Company", lat: 40.690908803033, lng: -73.99626928061231 },
];

export const sellerData: Prisma.SellerCreateInput[] = [
  { name: "Local Organic Farms", lat: 40.722401755310045, lng: -74.03624209933261 },
  { name: "Seafood Distributors Inc", lat: 40.7274516719603, lng: -74.00723953677519 },
  { name: "Dairy Producers Co-op", lat: 40.73712827207811, lng: -73.99643865422384 },
  { name: "Fresh Produce Imports", lat: 40.729382118747445, lng: -74.04796243191379 },
  { name: "Sustainable Meat Producers", lat: 40.71790826644307, lng: -74.0477804242731 },
  { name: "Artisanal Bakery Network", lat: 40.70409787063922, lng: -74.00896499385335 },
  { name: "Organic Dairy Collective", lat: 40.695580349715925, lng: -73.99392456907164 },
  { name: "Specialty Coffee Importers", lat: 40.713640504902166, lng: -73.96287389938529 },
  { name: "Local Fishermen Cooperative", lat: 40.721666868230905, lng: -73.98045282011412 },
  { name: "Premium Wine & Spirits Distributor", lat: 40.726520970472286, lng: -74.04938614289846 },
  { name: "Organic Grain Farmers Association", lat: 40.733009926945236, lng: -73.99064530476005 },
];

export const itemData: Prisma.ItemCreateInput[] = [
  { name: "Organic Apples", description: "Fresh organic apples from local farms", buyPrice: 200, sellPrice: 300, currency: "USD", weight: 1000 },
  { name: "Fresh Salmon", description: "Premium grade salmon, temperature controlled", buyPrice: 1500, sellPrice: 2000, currency: "USD", weight: 500 },
  { name: "Organic Milk", description: "Pasteurized organic whole milk", buyPrice: 300, sellPrice: 400, currency: "USD", weight: 2000 },
  { name: "Fresh Vegetables Mix", description: "Assorted seasonal vegetables", buyPrice: 400, sellPrice: 600, currency: "USD", weight: 1500 },
  { name: "Organic Chicken Breast", description: "Free-range organic chicken breast, vacuum sealed", buyPrice: 800, sellPrice: 1200, currency: "USD", weight: 1000 },
  { name: "Artisanal Cheese Selection", description: "Assorted premium cheeses from local dairies", buyPrice: 1200, sellPrice: 1800, currency: "USD", weight: 800 },
  { name: "Fresh Berries Mix", description: "Seasonal organic berries, temperature controlled", buyPrice: 600, sellPrice: 900, currency: "USD", weight: 500 },
  { name: "Whole Grain Bread", description: "Freshly baked organic whole grain bread", buyPrice: 250, sellPrice: 350, currency: "USD", weight: 800 },
  { name: "Premium Ground Coffee", description: "Fair-trade organic coffee beans, freshly ground", buyPrice: 900, sellPrice: 1400, currency: "USD", weight: 1000 },
  { name: "Organic Eggs", description: "Free-range organic eggs, 30-count pack", buyPrice: 450, sellPrice: 650, currency: "USD", weight: 1500 },
  { name: "Fresh Seafood Mix", description: "Assorted fresh seafood, temperature controlled", buyPrice: 1800, sellPrice: 2500, currency: "USD", weight: 1000 },
];
