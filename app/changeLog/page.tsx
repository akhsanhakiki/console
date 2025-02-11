import React from "react";
import ChangelogCard from "./components/changelogCard";

const changelogCards = [
  {
    date: "December 15, 2024",
    title: "Released Ezdocs.ai 2.3 Beta",
    description:
      "Introduced enhanced OCR capabilities for improved accuracy in text extraction from scanned documents. Added support for handwritten text recognition in multiple languages.",
    remarks: [
      "Improved text recognition accuracy by 25%",
      "Added support for 10 new languages",
      "Enhanced machine learning models for better handwriting detection",
    ],
  },
  {
    date: "December 1, 2024",
    title: "Released Ezdocs.ai 2.2",
    description:
      "Launched batch processing for large-scale document conversions. Added JSON schema validation to ensure structured output conforms to user specifications.",
    remarks: [
      "Supports batch processing of up to 1000 documents simultaneously",
      "Implemented advanced JSON schema validation",
      "Improved performance for large document sets",
    ],
  },
  {
    date: "November 20, 2024",
    title: "Released Ezdocs.ai 2.1",
    description:
      "Added support for multilingual OCR in over 50 languages. Introduced the ability to extract tables and complex layouts into JSON format.",
    remarks: [
      "Expanded language support to 50+ languages",
      "Added table extraction capabilities",
      "Improved complex layout parsing",
    ],
  },
  {
    date: "October 10, 2024",
    title: "Released Ezdocs.ai 2.0",
    description:
      "Major update with a complete redesign of the user interface and improved user experience.",
    remarks: [
      "New user interface with enhanced navigation",
      "Improved performance and loading times",
      "Added user feedback system for better support",
    ],
  },
  {
    date: "September 5, 2024",
    title: "Released Ezdocs.ai 1.9",
    description:
      "Introduced new features for document collaboration and sharing.",
    remarks: [
      "Real-time collaboration on documents",
      "Enhanced sharing options with permissions",
      "Improved version control for documents",
    ],
  },
  {
    date: "August 1, 2024",
    title: "Released Ezdocs.ai 1.8",
    description:
      "Added support for additional file formats and improved export options.",
    remarks: [
      "Support for PDF/A and EPUB formats",
      "Enhanced export options for various formats",
      "Improved error handling during file uploads",
    ],
  },
  {
    date: "July 15, 2024",
    title: "Released Ezdocs.ai 1.7",
    description:
      "Implemented advanced search capabilities for better document retrieval.",
    remarks: [
      "Full-text search across all documents",
      "Search filters for date and file type",
      "Improved indexing for faster search results",
    ],
  },
  {
    date: "June 10, 2024",
    title: "Released Ezdocs.ai 1.6",
    description: "Enhanced security features to protect user data.",
    remarks: [
      "Two-factor authentication for user accounts",
      "Improved encryption for document storage",
      "Regular security audits and updates",
    ],
  },
  {
    date: "May 5, 2024",
    title: "Released Ezdocs.ai 1.5",
    description: "Introduced analytics dashboard for user insights.",
    remarks: [
      "Real-time analytics on document usage",
      "User engagement metrics and reports",
      "Customizable dashboard for user preferences",
    ],
  },
  {
    date: "April 1, 2024",
    title: "Released Ezdocs.ai 1.4",
    description: "Added integration with third-party applications.",
    remarks: [
      "Integration with popular cloud storage services",
      "API access for developers",
      "Improved compatibility with existing tools",
    ],
  },
  {
    date: "March 15, 2024",
    title: "Released Ezdocs.ai 1.3",
    description: "Improved accessibility features for users with disabilities.",
    remarks: [
      "Screen reader support for all features",
      "Keyboard navigation enhancements",
      "Color contrast improvements for better visibility",
    ],
  },
  {
    date: "February 10, 2024",
    title: "Released Ezdocs.ai 1.2",
    description: "Added support for offline document access.",
    remarks: [
      "Download documents for offline use",
      "Sync changes when back online",
      "Improved performance for offline mode",
    ],
  },
  {
    date: "January 5, 2024",
    title: "Released Ezdocs.ai 1.1",
    description: "Initial release with basic OCR capabilities.",
    remarks: [
      "Basic text recognition from images",
      "Support for common document formats",
      "User-friendly interface for document uploads",
    ],
  },
];

const ChangeLog = () => {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <h1 className="text-xl font-semibold font-poppins text-foreground-900">
        Change Log
      </h1>
      <div className="w-full flex flex-col gap-4 h-[calc(100vh-7rem)] overflow-scroll">
        {changelogCards.map((card) => (
          <div className="flex flex-col gap-4">
            <ChangelogCard key={card.date} {...card} />
            <div className="h-1 border-b border-foreground-200"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChangeLog;
