import React from "react";

export function NutritionHeroIllustration() {
  return (
    <div className="relative mx-auto mt-10 h-64 max-w-3xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/60 shadow-xl shadow-brand-900/10 backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/70">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(16,185,129,0.22),transparent_58%)]" />
      <svg
        viewBox="0 0 720 280"
        role="img"
        aria-labelledby="nutrition-illustration-title nutrition-illustration-description"
        className="relative h-full w-full"
      >
        <title id="nutrition-illustration-title">3D nutrition intelligence illustration</title>
        <desc id="nutrition-illustration-description">
          A stylized bowl of colorful whole foods surrounded by nutrient bubbles.
        </desc>
        <defs>
          <linearGradient id="bowl" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#0f766e" />
            <stop offset="1" stopColor="#064e3b" />
          </linearGradient>
          <linearGradient id="bowlHighlight" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#5eead4" stopOpacity=".9" />
            <stop offset="1" stopColor="#14b8a6" stopOpacity=".15" />
          </linearGradient>
          <filter id="softShadow" x="-30%" y="-30%" width="160%" height="180%">
            <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#064e3b" floodOpacity=".22" />
          </filter>
        </defs>

        <g opacity=".55">
          <circle cx="100" cy="62" r="3" fill="#10b981" />
          <circle cx="630" cy="72" r="4" fill="#f59e0b" />
          <circle cx="580" cy="215" r="3" fill="#14b8a6" />
          <path d="M110 90C160 35 210 42 250 70" fill="none" stroke="#a7f3d0" strokeDasharray="4 8" strokeWidth="2" />
          <path d="M470 75C525 40 590 54 625 105" fill="none" stroke="#fde68a" strokeDasharray="4 8" strokeWidth="2" />
        </g>

        <g filter="url(#softShadow)">
          <ellipse cx="360" cy="218" rx="182" ry="24" fill="#022c22" opacity=".18" />
          <path d="M180 145C194 219 250 250 360 250s166-31 180-105H180Z" fill="url(#bowl)" />
          <ellipse cx="360" cy="144" rx="181" ry="54" fill="#064e3b" />
          <ellipse cx="360" cy="139" rx="163" ry="43" fill="#14532d" />
          <path d="M204 143c25-26 86-43 156-43s131 17 156 43c-25 19-86 31-156 31s-131-12-156-31Z" fill="url(#bowlHighlight)" opacity=".55" />
        </g>

        <g>
          <circle cx="280" cy="132" r="28" fill="#f97316" />
          <circle cx="280" cy="132" r="20" fill="#fb923c" />
          <path d="M280 111c7 5 11 12 12 21-8-3-15-10-17-18" fill="#fed7aa" opacity=".75" />
          <circle cx="346" cy="116" r="30" fill="#dc2626" />
          <circle cx="346" cy="116" r="21" fill="#ef4444" />
          <path d="M336 101c11 1 18 7 22 16-11 0-18-5-22-16" fill="#fecaca" opacity=".8" />
          <circle cx="414" cy="128" r="28" fill="#eab308" />
          <circle cx="414" cy="128" r="20" fill="#facc15" />
          <path d="M402 116c9-4 18-2 25 5-9 5-18 4-25-5" fill="#fef08a" opacity=".8" />
          <circle cx="468" cy="142" r="25" fill="#16a34a" />
          <circle cx="468" cy="142" r="18" fill="#22c55e" />
          <path d="M456 133c8-4 15-2 21 4-8 4-14 3-21-4" fill="#bbf7d0" opacity=".75" />
          <ellipse cx="328" cy="158" rx="38" ry="16" fill="#f5f5f4" />
          <ellipse cx="328" cy="154" rx="32" ry="12" fill="#e7e5e4" />
          <ellipse cx="390" cy="157" rx="34" ry="15" fill="#f5f5f4" />
          <ellipse cx="390" cy="153" rx="28" ry="11" fill="#d6d3d1" />
        </g>

        <g fontFamily="Arial, sans-serif" fontWeight="700">
          <g transform="translate(72 111)">
            <rect width="104" height="42" rx="14" fill="white" fillOpacity=".92" />
            <circle cx="20" cy="21" r="8" fill="#10b981" />
            <text x="35" y="19" fill="#065f46" fontSize="11">Fiber</text>
            <text x="35" y="32" fill="#64748b" fontSize="9">Daily balance</text>
          </g>
          <g transform="translate(540 138)">
            <rect width="108" height="42" rx="14" fill="white" fillOpacity=".92" />
            <circle cx="20" cy="21" r="8" fill="#f59e0b" />
            <text x="35" y="19" fill="#92400e" fontSize="11">Fuel</text>
            <text x="35" y="32" fill="#64748b" fontSize="9">Made personal</text>
          </g>
          <g transform="translate(276 35)">
            <rect width="168" height="35" rx="17" fill="#064e3b" fillOpacity=".93" />
            <text x="84" y="22" textAnchor="middle" fill="#d1fae5" fontSize="11">Whole-food intelligence</text>
          </g>
        </g>
      </svg>
    </div>
  );
}
