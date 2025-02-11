"use client";
import React from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import { FiPlus, FiMinus } from "react-icons/fi";
import { IoMailOutline } from "react-icons/io5";
import { LuPhone } from "react-icons/lu";
import { LuClock4 } from "react-icons/lu";
import { Button } from "@heroui/react";
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
const HelpAndSupport = () => {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <h1 className="text-xl font-semibold font-poppins text-foreground-900">
        Help and Support
      </h1>
      <div className="flex flex-row gap-6 h-full">
        <div className="flex flex-col gap-2 w-4/6">
          <h1 className="text-lg font-semibold font-poppins text-foreground-900">
            Top 10 FAQ
          </h1>
          <div className="flex flex-col gap-2 overflow-y-auto h-[calc(100vh-10rem)] overflow-scroll">
            {faq.map((item) => (
              <Accordion key={item.question}>
                <AccordionItem
                  key={item.question}
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
            ))}
          </div>
        </div>
        <div className="flex flex-col border-r-1 border-foreground-200"></div>
        <div className="flex flex-col gap-4 w-2/6">
          <h1 className="text-lg font-semibold font-poppins text-foreground-900">
            Get in touch with us
          </h1>
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-row gap-4 border-1 border-foreground-200 rounded-xl px-4 py-2 items-center">
              <IoMailOutline className="text-foreground-900 p-2 rounded-lg bg-foreground-100 w-8 h-8" />
              <div
                className="flex flex-col"
                onClick={() => {
                  window.open("mailto:hello@ezdocs.ai", "_blank");
                }}
              >
                <h1 className="text-sm font-semibold font-poppins text-foreground-900">
                  Email
                </h1>
                <p className="text-sm font-normal font-poppins text-foreground-900">
                  hello@ezdocs.ai
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-4 border-1 border-foreground-200 rounded-xl px-4 py-2 items-center">
              <LuPhone className="text-foreground-900 p-2 rounded-lg bg-foreground-100 w-8 h-8" />
              <div
                className="flex flex-col"
                onClick={() => {
                  window.open("tel:+6588916709", "_blank");
                }}
              >
                <h1 className="text-sm font-semibold font-poppins text-foreground-900">
                  Contact
                </h1>
                <p className="text-sm font-normal font-poppins text-foreground-900">
                  +65 8891 6709
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-4 border-1 border-foreground-200 rounded-xl px-4 py-2 items-center">
              <LuClock4 className="text-foreground-900 p-2 rounded-lg bg-foreground-100 w-8 h-8" />
              <div className="flex flex-col">
                <h1 className="text-sm font-semibold font-poppins text-foreground-900">
                  Availability
                </h1>
                <p className="text-sm font-normal font-poppins text-foreground-900">
                  Mon - Fri: 9:00 AM - 5:00 PM
                </p>
              </div>
            </div>
          </div>
          <p className="text-sm font-normal font-poppins text-foreground-900">
            <span className="font-semibold">Need help?</span> Contact us via
            chat, email, or phone—we're here to assist you!
          </p>
          <div className="flex flex-row gap-2 justify-end pr-4">
            <Button className="w-fit bg-gradient-to-r from-[#49FFDB] to-[#00E5FF] text-black font-poppins font-medium text-sm rounded-lg">
              Reach Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupport;
