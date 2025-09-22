import React from 'react';

interface DroneIconProps {
  className?: string;
  size?: number;
}

export function DroneIcon({ className, size = 20 }: DroneIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main body */}
      <rect
        x="9"
        y="10"
        width="6"
        height="4"
        rx="1"
        fill="currentColor"
      />
      
      {/* Front camera/sensor */}
      <circle
        cx="12"
        cy="10.5"
        r="0.5"
        fill="currentColor"
        opacity="0.7"
      />
      
      {/* Propeller arms */}
      <rect
        x="7"
        y="11.5"
        width="10"
        height="1"
        rx="0.5"
        fill="currentColor"
        opacity="0.8"
      />
      <rect
        x="11.5"
        y="8"
        width="1"
        height="8"
        rx="0.5"
        fill="currentColor"
        opacity="0.8"
      />
      
      {/* Propellers */}
      <g>
        {/* Top left propeller */}
        <ellipse
          cx="8.5"
          cy="9"
          rx="2"
          ry="0.5"
          fill="currentColor"
          opacity="0.6"
        />
        <ellipse
          cx="8.5"
          cy="9"
          rx="0.5"
          ry="2"
          fill="currentColor"
          opacity="0.6"
        />
        
        {/* Top right propeller */}
        <ellipse
          cx="15.5"
          cy="9"
          rx="2"
          ry="0.5"
          fill="currentColor"
          opacity="0.6"
        />
        <ellipse
          cx="15.5"
          cy="9"
          rx="0.5"
          ry="2"
          fill="currentColor"
          opacity="0.6"
        />
        
        {/* Bottom left propeller */}
        <ellipse
          cx="8.5"
          cy="15"
          rx="2"
          ry="0.5"
          fill="currentColor"
          opacity="0.6"
        />
        <ellipse
          cx="8.5"
          cy="15"
          rx="0.5"
          ry="2"
          fill="currentColor"
          opacity="0.6"
        />
        
        {/* Bottom right propeller */}
        <ellipse
          cx="15.5"
          cy="15"
          rx="2"
          ry="0.5"
          fill="currentColor"
          opacity="0.6"
        />
        <ellipse
          cx="15.5"
          cy="15"
          rx="0.5"
          ry="2"
          fill="currentColor"
          opacity="0.6"
        />
      </g>
      
      {/* Propeller centers */}
      <circle cx="8.5" cy="9" r="1" fill="currentColor" opacity="0.9" />
      <circle cx="15.5" cy="9" r="1" fill="currentColor" opacity="0.9" />
      <circle cx="8.5" cy="15" r="1" fill="currentColor" opacity="0.9" />
      <circle cx="15.5" cy="15" r="1" fill="currentColor" opacity="0.9" />
      
      {/* Landing gear */}
      <rect
        x="10"
        y="14"
        width="0.5"
        height="2"
        rx="0.25"
        fill="currentColor"
        opacity="0.7"
      />
      <rect
        x="13.5"
        y="14"
        width="0.5"
        height="2"
        rx="0.25"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}

