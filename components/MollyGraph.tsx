import { Image } from "@heroui/react";
import React from "react";

const MollyGraph = ({
  className,
  mollies,
}: {
  className?: string;
  mollies: {
    name: string;
    icon_url: string;
    radius: number;
    colour?: string;
  }[];
}) => {
  return (
    <div className={className}>
      <div className="flex gap-2">
        <div className="h-min rounded-md bg-foreground-50 p-1">
          <div>
            {mollies.map((molly) => (
              <div key={molly.name} className="flex items-center gap-2">
                <div
                  className={`h-2 w-2`}
                  style={{ backgroundColor: molly.colour || "#fff" }}
                />

                <div className="flex items-center gap-1">
                  <Image
                    alt={molly.name}
                    className="h-4 w-4"
                    src={molly.icon_url}
                  />
                  <span>{`${molly.name} (${molly.radius}m)`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`h-[12.5rem] w-[12.5rem] rounded-md bg-foreground-50`}>
          <svg fill="none" height="100%" width="100%">
            <g>
              {/* <g>
            <text dy="0.35rem" fontSize="1rem" x="50%" y="54%">
            <tspan fill="#000">0</tspan>
            </text>
            </g> */}
              <g stroke="#888">
                <g>
                  <line strokeWidth="2" x1="0%" x2="100%" y1="50%" y2="50%" />
                </g>

                <g>
                  {/* y-axis */}
                  <line strokeWidth="2" x1="50%" x2="50%" y1="0%" y2="100%" />
                </g>
              </g>
            </g>

            {mollies.map((molly) => (
              <circle
                key={molly.name}
                cx="50%"
                cy="50%"
                r={molly.radius * 10}
                stroke={molly.colour || "#fff"}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MollyGraph;
