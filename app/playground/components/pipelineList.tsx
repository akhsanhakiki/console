"use client";
import React, { useRef, useState, useEffect } from "react";
import PipelineCard from "./playgroundCard";
import ChevronIcon from "@/public/images/icons/chevronDown";
import PlaygroundModal from "./playgorundModal";
import { useDisclosure } from "@heroui/react";
import { usePlaygrounds } from "../hooks/usePlayground";
import { useRouter } from "next/navigation";
import ExtractFileIcon from "@/public/images/icons/extractFileIcon";
import { motion } from "framer-motion";

const pipelineCards = [
  {
    title: "Bank Statement",
    icon: ExtractFileIcon,
    description:
      "Extract information from bank statements such as account number, balance, and other financial information.",
    state: "active" as const,
  },
  {
    title: "General Documents",
    icon: ExtractFileIcon,
    description:
      "Extract information from general documents such as invoices, receipts, and other business documents.",
    state: "disabled" as const,
  },
  {
    title: "Credit Card Application",
    icon: ExtractFileIcon,
    description:
      "Extract information from credit card applications such as name, address, and other personal information.",
    state: "disabled" as const,
  },
  {
    title: "Insurance Policy",
    icon: ExtractFileIcon,
    description:
      "Extract information from insurance policies such as policy number, coverage, and other insurance details.",
    state: "disabled" as const,
  },
  {
    title: "Loan Agreement",
    icon: ExtractFileIcon,
    description:
      "Extract information from loan agreements such as loan amount, interest rate, and other loan details.",
    state: "disabled" as const,
  },
  {
    title: "Mortgage Agreement",
    icon: ExtractFileIcon,
    description:
      "Extract information from mortgage agreements such as property details, loan amount, and other mortgage details.",
    state: "disabled" as const,
  },
  {
    title: "Property Deed",
    icon: ExtractFileIcon,
    description:
      "Extract information from property deeds such as property details, ownership, and other property details.",
    state: "disabled" as const,
  },
  {
    title: "Vehicle Registration",
    icon: ExtractFileIcon,
    description:
      "Extract information from vehicle registration documents such as vehicle details, ownership, and other vehicle details.",
    state: "disabled" as const,
  },
];

interface PipelineListProps {}

interface PipelineData {
  name: string;
  type: string;
  createdAt: string;
}

const PipelineList = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(true);
  const [selectedPipeline, setSelectedPipeline] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { addPlayground } = usePlaygrounds();
  const router = useRouter();

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

  const handlePipelineClick = (
    title: string,
    description: string,
    state: "active" | "disabled"
  ) => {
    if (state === "disabled") return;

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
    onClose();
    // Navigate to the new playground
    router.push(`/playground/new?type=${encodeURIComponent(data.type)}`);
  };

  const handleNewPlayground = (name: string) => {
    // Instead of using router.push directly, open the modal first
    setSelectedPipeline(name);
    setSelectedDescription(
      pipelineCards.find((card) => card.title === name)?.description || ""
    );
    onOpen();
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1,
      },
    },
  };

  return (
    <>
      <motion.div
        className="flex flex-row items-center relative w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {showLeftChevron && (
          <motion.button
            onClick={() => handleScroll("left")}
            className="p-2 hover:bg-foreground-100 rounded-full transition-opacity duration-300 ease-in-out"
            aria-label="Scroll left"
            variants={cardVariants}
          >
            <ChevronIcon className="rotate-90 w-5 h-5 text-foreground-500" />
          </motion.button>
        )}

        <div className="relative w-full overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          >
            <motion.div
              className="flex flex-nowrap gap-4"
              variants={containerVariants}
            >
              {pipelineCards.map((card, index) => (
                <motion.div
                  key={index}
                  className="flex-none w-[320px] snap-start first:ml-0"
                  onClick={() => {
                    if (card.state === "active") {
                      handleNewPlayground(card.title);
                    }
                  }}
                  variants={cardVariants}
                >
                  <PipelineCard
                    title={card.title}
                    icon={card.icon}
                    description={card.description}
                    state={card.state}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {showRightChevron && (
          <motion.button
            onClick={() => handleScroll("right")}
            className="p-2 hover:bg-foreground-100 rounded-full transition-opacity duration-300 ease-in-out"
            aria-label="Scroll right"
            variants={cardVariants}
          >
            <ChevronIcon className="-rotate-90 w-5 h-5 text-foreground-500" />
          </motion.button>
        )}
      </motion.div>

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

export default PipelineList;
