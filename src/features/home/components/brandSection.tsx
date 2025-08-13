"use client";

interface BrandSectionProps {
  brands: string[];
}

export function BrandSection({ brands }: BrandSectionProps) {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-textHeading mb-4">
        🏷️ 인기 브랜드
      </h2>
      <div className="flex flex-wrap gap-3">
        {brands.map((brand, index) => (
          <button
            key={index}
            className="px-4 py-2 bg-grayLighter text-grayDark font-medium rounded-lg text-base border border-grayLight"
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  );
}