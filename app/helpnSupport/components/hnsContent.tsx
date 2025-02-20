"use client";

import { Accordion, AccordionItem, Button, Divider } from "@heroui/react";
import { FiPlus } from "react-icons/fi";
import React from "react";
import { FiMinus } from "react-icons/fi";
import { LuClock4 } from "react-icons/lu";
import { LuPhone } from "react-icons/lu";
import { IoMailOutline } from "react-icons/io5";
import { motion } from "framer-motion";

const faq = [
  {
    question: "What is EZDocs?",
    answer:
      "EZDocs is an AI-powered document extractor that helps you efficiently manage and extract information from your documents.",
  },
  {
    question: "How does EZDocs work?",
    answer:
      "EZDocs uses advanced AI algorithms to analyze documents and extract relevant data automatically.",
  },
  {
    question: "What types of documents can I upload?",
    answer:
      "You can upload various document types, including PDFs, Word files, and images.",
  },
  {
    question: "Is my data secure with EZDocs?",
    answer:
      "Yes, EZDocs prioritizes data security and uses encryption to protect your information.",
  },
  {
    question: "Can I edit the extracted data?",
    answer:
      "Yes, you can review and edit the extracted data before finalizing it.",
  },
  {
    question: "What languages does EZDocs support?",
    answer:
      "EZDocs supports multiple languages, making it accessible for users worldwide.",
  },
  {
    question: "Is there a limit to the document size I can upload?",
    answer:
      "Yes, there is a maximum file size limit for uploads, which is specified in the user guidelines.",
  },
  {
    question: "Can I integrate EZDocs with other applications?",
    answer:
      "Yes, EZDocs offers integration options with various applications for seamless workflow.",
  },
  {
    question: "How can I get support if I encounter issues?",
    answer:
      "You can reach out to our support team via email or through the help section on our website.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes, EZDocs offers a free trial period for new users to explore its features.",
  },
];

const hnsContent = () => {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const contactCardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1,
      },
    },
  };

  return (
    <motion.div
      className="flex flex-row gap-6 h-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="flex flex-col gap-4 w-1/4" variants={itemVariants}>
        <motion.h1
          className="text-base font-medium font-poppins text-foreground-500"
          variants={itemVariants}
        >
          Get in touch with us
        </motion.h1>
        <motion.div
          className="flex flex-col gap-3"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
              },
            },
          }}
        >
          <motion.div
            className="flex flex-row gap-4 border-1 border-foreground-200 rounded-xl px-4 py-2 items-center hover:cursor-pointer hover:scale-103 transition-all duration-300 hover:shadow-md"
            onClick={() => {
              window.open("mailto:hello@ezdocs.ai", "_blank");
            }}
            variants={contactCardVariants}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          >
            <IoMailOutline className="text-foreground-900 p-2 rounded-lg bg-foreground-100 w-8 h-8" />
            <div className="flex flex-col">
              <h1 className="text-sm font-semibold font-poppins text-foreground-900">
                Email
              </h1>
              <p className="text-sm font-normal font-poppins text-foreground-900">
                hello@ezdocs.ai
              </p>
            </div>
          </motion.div>
          <motion.div
            className="flex flex-row gap-4 border-1 border-foreground-200 rounded-xl px-4 py-2 items-center hover:cursor-pointer hover:scale-103 transition-all duration-300 hover:shadow-md"
            onClick={() => {
              window.open("tel:+6588916709", "_blank");
            }}
            variants={contactCardVariants}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          >
            <LuPhone className="text-foreground-900 p-2 rounded-lg bg-foreground-100 w-8 h-8" />
            <div className="flex flex-col">
              <h1 className="text-sm font-semibold font-poppins text-foreground-900">
                Contact
              </h1>
              <p className="text-sm font-normal font-poppins text-foreground-900">
                +65 8891 6709
              </p>
            </div>
          </motion.div>
          <motion.div
            className="flex flex-row gap-4 border-1 border-foreground-200 rounded-xl px-4 py-2 items-center hover:cursor-pointer hover:scale-103 transition-all duration-300 hover:shadow-md"
            variants={contactCardVariants}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          >
            <LuClock4 className="text-foreground-900 p-2 rounded-lg bg-foreground-100 w-8 h-8" />
            <div className="flex flex-col">
              <h1 className="text-sm font-semibold font-poppins text-foreground-900">
                Availability
              </h1>
              <p className="text-sm font-normal font-poppins text-foreground-900">
                Mon - Fri: 9:00 AM - 5:00 PM
              </p>
            </div>
          </motion.div>
        </motion.div>
        <motion.p
          className="text-sm font-normal font-poppins text-foreground-900"
          variants={itemVariants}
        >
          <span className="font-semibold">Need help?</span> Contact us via chat,
          email, or phone—we're here to assist you!
        </motion.p>
        <motion.div
          className="flex flex-row gap-2 justify-end pr-4"
          variants={itemVariants}
        >
          <Button className="w-fit bg-gradient-to-r from-[#49FFDB] to-[#00E5FF] text-black font-poppins font-medium text-sm rounded-lg">
            Reach Out
          </Button>
        </motion.div>
      </motion.div>
      <Divider orientation="vertical" />
      <motion.div className="flex flex-col gap-2 w-2/4" variants={itemVariants}>
        <motion.h1
          className="text-base font-medium font-poppins mb-2 text-foreground-500"
          variants={itemVariants}
        >
          Top 10 FAQ
        </motion.h1>
        <motion.div
          className="flex flex-col gap-2 border-1 border-foreground-200 p-4 rounded-xl overflow-y-auto h-[calc(100vh-10rem)] overflow-scroll"
          variants={itemVariants}
        >
          {faq.map((item, index) => (
            <motion.div
              key={item.question}
              variants={itemVariants}
              custom={index}
            >
              <Accordion>
                <AccordionItem
                  aria-label={item.question}
                  indicator={({ isOpen }) =>
                    isOpen ? <FiMinus className="rotate-90" /> : <FiPlus />
                  }
                  title={
                    <span className="font-medium font-poppins text-sm">
                      {item.question}
                    </span>
                  }
                  className="-my-1 border-b-1 border-foreground-200"
                >
                  <p className="font-normal font-poppins -mt-4 text-sm">
                    {item.answer}
                  </p>
                </AccordionItem>
              </Accordion>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default hnsContent;
