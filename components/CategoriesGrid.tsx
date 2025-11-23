"use client";

import React from "react";
import CategoryIcon from "./CategoryIcon";

type Category = {
  id: string;
  displayName: string;
  imageUrl?: string | null;
  icon?: string | null;
};

export default function CategoriesGrid({ categories }: { categories: Category[] }) {
  if (!categories || categories.length === 0) {
    return <div>Nenhuma categoria disponível.</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="p-2 bg-white rounded shadow flex flex-col items-center"
        >
          <CategoryIcon
            imageUrl={cat.imageUrl ?? null}
            icon={cat.icon ?? null}
            alt={cat.displayName}
            size={96}
          />
          <div className="mt-2 text-sm text-center">{cat.displayName}</div>
        </div>
      ))}
    </div>
  );
}