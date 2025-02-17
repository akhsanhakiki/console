import { Button } from "@heroui/react";
import React from "react";

interface ModuleSwitcherProps<T extends string> {
  isActive: boolean;
  title: T;
  setCurrentModule: (module: T) => void;
}

const ModuleSwitcher = <T extends string>({
  isActive,
  title,
  setCurrentModule,
}: ModuleSwitcherProps<T>) => {
  return (
    <div
      className={`
        flex items-center justify-center rounded-lg w-fit h-8 transition-all duration-300 ease-in-out
        ${isActive ? "p-[2px] bg-gradient-to-r from-[#49FFDB] to-[#00E5FF]" : "bg-transparent"}
      `}
    >
      <Button
        variant="bordered"
        size="sm"
        className={`
          w-full h-full transition-all duration-200 ease-in-out font-poppins rounded-lg
          ${
            isActive
              ? "bg-background border-none text-foreground-900 font-medium rounded-[6px]"
              : "border-foreground-300 text-foreground-900 font-medium h-8 hover:border-[#49FFDB]"
          }
        `}
        onPress={() => setCurrentModule(title)}
      >
        {title}
      </Button>
    </div>
  );
};

export default ModuleSwitcher;
