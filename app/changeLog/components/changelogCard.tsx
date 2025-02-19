import React from "react";

interface ChangelogCardProps {
  date: string;
  title: string;
  description: string;
  remarks?: string[];
}

const ChangelogCard = ({
  date,
  title,
  description,
  remarks,
}: ChangelogCardProps) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium font-poppins text-foreground-700">
        {date}
      </p>
      <h2 className="text-lg font-semibold font-poppins text-foreground-900">
        {title}
      </h2>
      <p className="text-sm font-normal font-poppins text-foreground-500">
        {description}
      </p>
      {remarks && remarks.length > 0 && (
        <ul className="list-disc list-inside text-sm font-normal font-poppins text-foreground-500 pl-2">
          {remarks.map((remark, index) => (
            <li key={index}>{remark}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChangelogCard;
