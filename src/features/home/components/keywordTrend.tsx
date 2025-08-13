"use client";

import { memo } from 'react';

interface KeywordTrendProps {
  popularKeywords: string[];
}

function KeywordTrendComponent({ popularKeywords }: KeywordTrendProps) {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-textHeading mb-4">
        🔥 지금 인기있는 키워드
      </h2>
      <div className="flex flex-wrap gap-3">
        {popularKeywords.map((keyword, index) => (
          <button
            key={`keyword-${index}`}
            className="px-4 py-2 bg-primaryLight text-primary font-medium rounded-full text-base"
          >
            #{keyword}
          </button>
        ))}
      </div>
    </div>
  );
}

export const KeywordTrend = memo(KeywordTrendComponent);