"use client";
import React, { useRef, useState, useEffect } from "react";
import PipelineCard from "./playgroundCard";
import ChevronIcon from "@/public/images/icons/chevronDown";
import PlaygroundModal from "./playgorundModal";
import { useDisclosure } from "@heroui/react";
import { usePlaygrounds } from "../hooks/usePlayground";

interface PlaygroundListProps {
  cards: {
    title: string;
    icon: React.ComponentType<{ className: string }>;
    description: string;
    state: "active" | "disabled";
  }[];
  setNewPlayground: (name: string) => void;
}

interface PlaygroundData {
  name: string;
  type: string;
  createdAt: string;
}

const PlaygroundList = ({ cards, setNewPlayground }: PlaygroundListProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(true);
  const [selectedPipeline, setSelectedPipeline] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { addPlayground } = usePlaygrounds();

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = 320 + 16; // card width + gap
    const scrollPosition =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
  };

  const handleScrollPosition = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    setShowLeftChevron(container.scrollLeft > 0);
    setShowRightChevron(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  const handlePipelineClick = (title: string, description: string) => {
    setSelectedPipeline(title);
    setSelectedDescription(description);
    sessionStorage.setItem("selectedPipeline", title);
    sessionStorage.setItem("selectedPipelineDescription", description);
    onOpen();
  };

  const handleSubmit = (data: {
    name: string;
    type: string;
    description: string;
  }) => {
    // Add new playground using the hook
    const newPlayground = addPlayground(data.name, data.type, data.description);

    // Update parent component
    setNewPlayground(data.name);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScrollPosition);
      handleScrollPosition();
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScrollPosition);
      }
    };
  }, []);

  return (
    <>
      <div className="flex flex-row items-center relative w-full">
        {showLeftChevron && (
          <button
            onClick={() => handleScroll("left")}
            className="p-2 hover:bg-foreground-100 rounded-full transition-opacity duration-300 ease-in-out"
            aria-label="Scroll left"
          >
            <ChevronIcon className="rotate-90 w-5 h-5 text-foreground-500" />
          </button>
        )}

        <div className="relative w-full overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          >
            <div className="flex flex-nowrap gap-4">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="flex-none w-[320px] snap-start first:ml-0"
                  onClick={() =>
                    handlePipelineClick(card.title, card.description)
                  }
                >
                  <PipelineCard
                    title={card.title}
                    icon={card.icon}
                    description={card.description}
                    state={card.state}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {showRightChevron && (
          <button
            onClick={() => handleScroll("right")}
            className="p-2 hover:bg-foreground-100 rounded-full transition-opacity duration-300 ease-in-out"
            aria-label="Scroll right"
          >
            <ChevronIcon className="-rotate-90 w-5 h-5 text-foreground-500" />
          </button>
        )}
      </div>

      <PlaygroundModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        pipelineName={selectedPipeline}
        description={selectedDescription}
      />
    </>
  );
};

export default PlaygroundList;
