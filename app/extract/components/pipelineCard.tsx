import React from "react";

interface PipelineCardProps {
  title: string;
  icon?: React.ComponentType<{ className: string }>;
  description: string;
  state: "active" | "disabled";
}

const PipelineCard = ({
  title,
  icon: Icon,
  description,
  state,
}: PipelineCardProps) => {
  return (
    <div
      className={`flex flex-col gap-3 border-1 border-foreground-200 rounded-2xl p-4 w-80 h-32 overflow-hidden transition-all duration-200 
      ${
        state === "active"
          ? "hover:bg-foreground-100"
          : "opacity-60 cursor-not-allowed"
      }`}
    >
      <div className="flex flex-row items-center gap-3 h-6">
        {Icon && (
          <div className="text-foreground-900 p-2 bg-foreground-100 rounded-lg">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <h2 className="text-base font-poppins font-medium text-foreground-900">
          {title}
        </h2>
      </div>
      <div className="flex flex-col overflow-hidden text-ellipsis">
        <p className="text-sm font-poppins font-normal text-foreground-500">
          {description}
        </p>
      </div>
    </div>
  );
};

export default PipelineCard;
