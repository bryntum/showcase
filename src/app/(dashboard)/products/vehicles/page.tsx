
"use client";

import { Table2 } from 'lucide-react';

const Grid = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <div className="mr-4 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Table2 size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Grid Product</h1>
            <p className="text-muted-foreground">Data presentation and manipulation with interactive grid components</p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-12 text-center">
        <h2 className="text-2xl font-semibold mb-3">Grid Product Details</h2>
        <p className="text-muted-foreground mb-6">Detailed statistics and features will be displayed here</p>
      </div>
    </div>
  );
};

export default Grid;
