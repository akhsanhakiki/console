"use client";
import React, { useState } from "react";
import ChangelogCard from "./changelogCard";
import { Button, Divider } from "@heroui/react";

const changelogCards = [
  {
    date: "March 20, 2024",
    title: "Released Ezdocs.ai 3.0 Beta",
    version: "3.0",
    description:
      "Introducing our most powerful update yet with AI-driven document processing and advanced automation capabilities. This major release brings revolutionary features that transform how you work with documents.",
    remarks: [
      "AI-powered document classification with 95% accuracy",
      "Smart content tagging system with custom taxonomy support",
      "Automated metadata extraction using machine learning",
      "Advanced document summarization powered by GPT-4",
      "Real-time document insights and analytics",
      "Intelligent document routing based on content",
      "Multi-language support for 50+ languages",
    ],
  },
  {
    date: "March 5, 2024",
    title: "Released Ezdocs.ai 2.9",
    version: "2.9",
    description:
      "A significant enhancement to our collaboration suite, bringing real-time editing capabilities and advanced version control. This update focuses on making team collaboration seamless and more efficient.",
    remarks: [
      "Real-time collaborative editing with conflict resolution",
      "Advanced document version history with diff comparison",
      "Smart commenting system with @mentions and threading",
      "Document access controls and permission management",
      "Team workspace improvements and organization",
      "Activity tracking and audit logs",
      "Integration with popular team communication tools",
    ],
  },
  {
    date: "February 20, 2024",
    title: "Released Ezdocs.ai 2.8",
    version: "2.8",
    description:
      "Major performance improvements and template management system update. This release focuses on speed optimization and making document processing more efficient than ever.",
    remarks: [
      "Processing speed improved by 50% for all document types",
      "Advanced template creation with dynamic fields",
      "Bulk template application with smart field mapping",
      "Template version control and management",
      "Custom validation rules for templates",
      "Template sharing and collaboration features",
      "Performance optimization for large documents",
    ],
  },
  {
    date: "February 5, 2024",
    title: "Released Ezdocs.ai 2.7",
    version: "2.7",
    description:
      "Introducing advanced workflow automation capabilities. This update brings powerful tools for creating and managing document workflows, making document processing more efficient than ever.",
    remarks: [
      "Visual workflow builder with drag-and-drop interface",
      "Conditional document routing based on content",
      "Automated approval workflows with role-based actions",
      "Custom trigger events and webhook support",
      "Integration with external systems via API",
      "Workflow templates and sharing capabilities",
      "Real-time workflow monitoring and analytics",
    ],
  },
  {
    date: "January 20, 2024",
    title: "Released Ezdocs.ai 2.6",
    version: "2.6",
    description:
      "Enhanced security features and compliance updates to meet enterprise requirements. This release focuses on making document management more secure while maintaining ease of use.",
    remarks: [
      "GDPR compliance improvements with data privacy controls",
      "Enhanced encryption for document storage and transfer",
      "Advanced audit logging with detailed activity tracking",
      "Custom security policies and enforcement",
      "Multi-factor authentication improvements",
      "IP-based access controls and restrictions",
      "Security dashboard with real-time monitoring",
    ],
  },
  {
    date: "January 5, 2024",
    title: "Released Ezdocs.ai 2.5",
    version: "2.5",
    description:
      "Major improvements to our OCR capabilities and language support. This update brings significant enhancements to text recognition accuracy and multilingual support.",
    remarks: [
      "OCR accuracy improved by 25% across all document types",
      "Support for 10 new languages including Arabic and Japanese",
      "Enhanced handwriting recognition with ML models",
      "Improved table and form field detection",
      "Custom OCR training capabilities",
      "Batch OCR processing with higher accuracy",
      "Advanced character recognition for complex scripts",
    ],
  },
  {
    date: "December 20, 2023",
    title: "Released Ezdocs.ai 2.4",
    version: "2.4",
    description:
      "Introducing batch processing capabilities and improved document validation. This release focuses on handling large volumes of documents efficiently.",
    remarks: [
      "Support for processing up to 1000 documents simultaneously",
      "Advanced JSON schema validation with custom rules",
      "Improved performance for large document sets",
      "Batch processing status monitoring",
      "Error handling and recovery improvements",
      "Custom validation rule creation",
      "Bulk document property editing",
    ],
  },
  {
    date: "December 5, 2023",
    title: "Released Ezdocs.ai 2.3",
    version: "2.3",
    description:
      "Complete UI/UX overhaul focusing on user experience and performance. This update brings a modern, intuitive interface designed for productivity.",
    remarks: [
      "Modern interface redesign with improved navigation",
      "Enhanced dashboard with customizable widgets",
      "Improved document preview and editing interface",
      "New dark mode support and theme customization",
      "Keyboard shortcuts for common actions",
      "Responsive design for all screen sizes",
      "Improved accessibility features",
    ],
  },
  {
    date: "November 20, 2023",
    title: "Released Ezdocs.ai 2.2",
    version: "2.2",
    description: "Enhanced document collaboration features.",
    remarks: [
      "Real-time collaboration tools",
      "Advanced sharing permissions",
      "Version control improvements",
    ],
  },
  {
    date: "November 5, 2023",
    title: "Released Ezdocs.ai 2.1",
    version: "2.1",
    description: "Added support for additional file formats.",
    remarks: [
      "Support for PDF/A and EPUB",
      "Enhanced export options",
      "Improved error handling",
    ],
  },
  {
    date: "October 20, 2023",
    title: "Released Ezdocs.ai 2.0",
    version: "2.0",
    description: "Major platform update with advanced search capabilities.",
    remarks: [
      "Full-text search implementation",
      "Advanced filtering options",
      "Improved search indexing",
    ],
  },
  {
    date: "October 5, 2023",
    title: "Released Ezdocs.ai 1.9",
    version: "1.9",
    description: "Enhanced security and authentication features.",
    remarks: [
      "Two-factor authentication",
      "Improved document encryption",
      "Regular security audits",
    ],
  },
  {
    date: "September 20, 2023",
    title: "Released Ezdocs.ai 1.8",
    version: "1.8",
    description: "Analytics dashboard introduction.",
    remarks: [
      "Real-time usage analytics",
      "Custom reporting tools",
      "User engagement tracking",
    ],
  },
  {
    date: "September 5, 2023",
    title: "Released Ezdocs.ai 1.7",
    version: "1.7",
    description: "Third-party integration expansion.",
    remarks: [
      "Cloud storage integration",
      "API access implementation",
      "Enhanced compatibility",
    ],
  },
  {
    date: "August 20, 2023",
    title: "Released Ezdocs.ai 1.6",
    version: "1.6",
    description: "Accessibility improvements.",
    remarks: [
      "Screen reader optimization",
      "Keyboard navigation",
      "Color contrast enhancement",
    ],
  },
];

const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;

const changelogContent = () => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>("3.0");

  return (
    <>
      <style>{styles}</style>
      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap-2 min-w-[240px] h-[calc(100vh-6rem)] overflow-scroll scrollbar-hide">
          <h2 className="text-base font-medium font-poppins mb-4 text-foreground-500">
            Version History
          </h2>
          {changelogCards.map((releaseDate) => {
            const isActive = selectedVersion === releaseDate.version;
            return (
              <div
                key={releaseDate.version}
                className={`
                  flex items-center justify-center rounded-xl w-full
                  transition-all duration-500 ease-in-out
                  ${isActive ? "p-[2px] bg-gradient-to-r from-[#49FFDB] to-[#00E5FF]" : "p-[2px] bg-transparent"}
                `}
              >
                <Button
                  variant="bordered"
                  className={`
                    w-full min-h-[64px] px-4 py-2 rounded-xl
                    transition-all duration-500 ease-in-out
                    font-poppins relative overflow-hidden
                    ${
                      isActive
                        ? "bg-background border-none text-foreground-900 font-medium rounded-[10px] shadow-sm"
                        : "border-foreground-200 text-foreground-700 font-medium hover:border-[#49FFDB] hover:text-foreground-900 hover:shadow-sm"
                    }
                    before:absolute before:inset-0 before:transition-opacity before:duration-500
                    before:bg-gradient-to-r before:from-[#49FFDB]/10 before:to-[#00E5FF]/10
                    before:opacity-0 hover:before:opacity-100
                  `}
                  onPress={() => setSelectedVersion(releaseDate.version)}
                >
                  <div className="flex flex-col items-start w-full gap-1 relative z-10">
                    <div className="flex items-center justify-between w-full">
                      <p className="text-sm font-semibold transition-colors duration-500">
                        Ezdocs {releaseDate.version}
                      </p>
                      {isActive && (
                        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-[#49FFDB] to-[#00E5FF] transition-transform duration-500 ease-out animate-fadeIn" />
                      )}
                    </div>
                    <p className="text-xs font-normal text-foreground-500 transition-colors duration-500">
                      {releaseDate.date}
                    </p>
                  </div>
                </Button>
              </div>
            );
          })}
        </div>

        <Divider orientation="vertical" className="h-auto" />

        <div className="flex flex-col gap-4 flex-1 max-w-[800px] h-[calc(100vh-6rem)] overflow-scroll">
          <h2 className="text-base font-medium font-poppins mb-4 text-foreground-500">
            Release Details
          </h2>
          {changelogCards
            .filter((card) => card.version === selectedVersion)
            .map((card) => (
              <div
                className="flex flex-col gap-6 animate-fadeIn"
                key={card.version}
              >
                <ChangelogCard key={card.version} {...card} />
                <div className="h-1 border-b border-foreground-200"></div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default changelogContent;
