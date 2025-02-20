"use client";

import clsx from "clsx";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Tooltip } from "@heroui/react";

// Import SVG icons for navigation items

import CollapseIcon from "@/public/images/icons/collapseIcon";
import composerIconOut from "@/public/images/icons/composerIconOut";
import composerIcon from "@/public/images/icons/composerIcon";
import dashboardIconOut from "@/public/images/icons/dashboardIconOut";
import dashboardIcon from "@/public/images/icons/dashboardIcon";
import documentationIconOut from "@/public/images/icons/documentationIconOut";
import documentationIcon from "@/public/images/icons/documentationIcon";
import helpnsupportIconOut from "@/public/images/icons/helpnsupportIconOut";
import integrationIconOut from "@/public/images/icons/integrationIconOut";
import integrationIcon from "@/public/images/icons/integrationicon";
import manageIconOut from "@/public/images/icons/manageIconOut";
import manageIcon from "@/public/images/icons/manageIcon";
import BurgerIcon from "@/public/images/icons/menuIcon";
import scanIconOut from "@/public/images/icons/scanIconOut";
import scanIcon from "@/public/images/icons/scanIcon";
import settingsIconOut from "@/public/images/icons/settingsIconOut";
import settingsIcon from "@/public/images/icons/settingsIcon";
import ChevronDown from "@/public/images/icons/chevronDown";
import SchemaIconOut from "@/public/images/icons/schemaIconOut";
import SchemaIcon from "@/public/images/icons/schemaIcon";
import PipelineIconOut from "@/public/images/icons/pipelineIconOut";
import PipelineIcon from "@/public/images/icons/pipelineIcon";
import DocTypeIconOut from "@/public/images/icons/docTypeIconOut";
import DocTypeIcon from "@/public/images/icons/docTypeIcon";
import helpnsupportIcon from "@/public/images/icons/helpnsupportIcon";
import changeLogIconOut from "@/public/images/icons/changeLogIconOut";
import changeLogIcon from "@/public/images/icons/changeLogIcon";

// Import SVG icons with proper typing
interface IconType extends StaticImageData {
  src: string;
  height: number;
  width: number;
}

// Interface for navigation items structure
interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  activeIcon: React.ComponentType<{ className?: string }>;
  subItems?: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    activeIcon: React.ComponentType<{ className?: string }>;
  }[];
  disabled?: boolean;
}

// Navigation items configuration
const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: dashboardIconOut,
    activeIcon: dashboardIcon,
  },
  {
    name: "Playground",
    href: "/playground",
    icon: scanIconOut,
    activeIcon: scanIcon,
  },
  {
    name: "Manage",
    href: "#",
    icon: manageIconOut,
    activeIcon: manageIcon,
    subItems: [
      {
        name: "Pipeline",
        href: "/manage/pipeline",
        icon: PipelineIconOut,
        activeIcon: PipelineIcon,
      },
      {
        name: "Doc Type",
        href: "/manage/doctype",
        icon: DocTypeIconOut,
        activeIcon: DocTypeIcon,
      },
      {
        name: "Schema",
        href: "/manage/schema",
        icon: SchemaIconOut,
        activeIcon: SchemaIcon,
      },
    ],
  },
  {
    name: "Composer",
    href: "/composer",
    icon: composerIconOut,
    activeIcon: composerIcon,
    disabled: true,
  },
  {
    name: "Integration",
    href: "/integration",
    icon: integrationIconOut,
    activeIcon: integrationIcon,
    disabled: true,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: settingsIconOut,
    activeIcon: settingsIcon,
  },
  {
    name: "Change Log",
    href: "/changeLog",
    icon: changeLogIconOut,
    activeIcon: changeLogIcon,
  },
  {
    name: "Documentation",
    href: "/documentation",
    icon: documentationIconOut,
    activeIcon: documentationIcon,
  },
  {
    name: "Help & Support",
    href: "/helpnSupport",
    icon: helpnsupportIconOut,
    activeIcon: helpnsupportIcon,
  },
];

// Add this helper function at the top of the component
function isActiveLink(itemPath: string, currentPath: string) {
  if (currentPath === "/") {
    // When on root path, make Dashboard active
    return itemPath === "/dashboard";
  }
  if (itemPath === "/") {
    return currentPath === itemPath;
  }
  return currentPath.startsWith(itemPath);
}

// Helper function to get menu item styles
const getMenuItemStyles = (isActive: boolean) => {
  const baseStyles = [
    "group",
    "flex",
    "items-center",
    "gap-2",
    "px-3",
    "py-2",
    "text-sm",
    "font-medium",
    "font-poppins",
    "rounded-lg",
    "transition-all",
    "duration-200",
  ].join(" ");

  if (isActive) {
    return `${baseStyles} bg-foreground-100 text-foreground-900`;
  }
  return `${baseStyles} text-foreground-700 hover:bg-foreground-100 hover:text-foreground-800`;
};

// Helper function to get icon styles
const getIconStyles = (isActive: boolean, isExpanded: boolean) => {
  const styles = ["flex-shrink-0"];

  if (isExpanded) {
    styles.push("mr-3");
  }

  if (isActive) {
    styles.push("text-foreground-900");
  } else {
    styles.push("text-foreground-600", "group-hover:text-foreground-900");
  }

  return styles.join(" ");
};

const SideNavbar = () => {
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Handle mounting state and initial active state
  useEffect(() => {
    setMounted(true);
    // Handle initial Dashboard active state
    if (pathname === "/") {
      const dashboardPath = "/dashboard";
      if (!isActiveLink(dashboardPath, pathname)) {
        setMounted(false); // Force a re-render
        setTimeout(() => setMounted(true), 0);
      }
    }
  }, [pathname]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setExpandedItem(null);
    }
  };

  const toggleSubItems = (itemName: string) => {
    // If sidebar is collapsed, expand it and the menu
    if (!isExpanded) {
      setIsExpanded(true);
      setExpandedItem(itemName); // Force expand the menu
      return;
    }
    // Normal toggle behavior when sidebar is expanded
    setExpandedItem(expandedItem === itemName ? null : itemName);
  };

  const isSubMenuActive = (path: string) => pathname === path;

  // Create a loading skeleton that matches final styling
  if (!mounted) {
    return (
      <div className="w-64 h-full bg-background border-r border-foreground-200">
        <div className="flex items-center justify-end p-4">
          <div className="w-5 h-5" />
        </div>
        <nav className="flex-1 px-2">
          <div className="flex flex-col gap-2">
            {navItems.map((item, index) => (
              <div
                key={index}
                className="h-9 rounded-lg bg-foreground-100/50 animate-pulse"
              />
            ))}
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div
      data-testid="sidebar-container"
      className={clsx(
        "flex flex-col h-full bg-background border-r border-foreground-200 transition-[width] duration-200 ease-in-out",
        {
          "w-64": isExpanded,
          "w-16": !isExpanded,
        }
      )}
    >
      {/* Sidebar toggle button */}
      <div className="flex items-center justify-center px-3 pb-3">
        <div
          className={clsx("flex items-center w-full gap-2", {
            "justify-between": isExpanded,
            "justify-center": !isExpanded,
          })}
        >
          {isExpanded && (
            <div className="flex-1 min-w-0">
              <span className="text-base font-medium text-foreground-600 pl-2 transition-opacity duration-200 ease-in-out truncate font-poppins">
                Menu
              </span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="py-2 rounded-lg text-foreground-600 hover:text-foreground-900"
          >
            {isExpanded ? <CollapseIcon /> : <BurgerIcon />}
          </button>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-2">
        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = isActiveLink(item.href, pathname);

            return (
              <Tooltip
                key={item.name}
                content={item.disabled ? "Coming Soon" : item.name}
                placement="right"
                isDisabled={item.disabled ? false : isExpanded}
              >
                <div className="flex flex-col">
                  {item.subItems ? (
                    <button
                      data-testid="manage-button"
                      className={clsx(
                        getMenuItemStyles(isActive),
                        "justify-between"
                      )}
                      onClick={() => toggleSubItems(item.name)}
                    >
                      <div className="flex items-center gap-2">
                        {typeof item.icon === "function" ? (
                          React.createElement(
                            (expandedItem === item.name &&
                              !navItems.find(
                                (nav) =>
                                  !nav.subItems &&
                                  isActiveLink(nav.href, pathname)
                              )) ||
                              item.subItems?.some((subItem) =>
                                isActiveLink(subItem.href, pathname)
                              )
                              ? item.activeIcon
                              : item.icon,
                            {
                              className: clsx(
                                "flex-shrink-0 w-5 h-5 text-foreground-900"
                              ),
                            }
                          )
                        ) : (
                          <Image
                            src={item.icon}
                            alt={`${item.name} icon`}
                            width={20}
                            height={20}
                            className={getIconStyles(isActive, isExpanded)}
                            loading="eager"
                            priority={true}
                          />
                        )}
                        {isExpanded && (
                          <span className="transition-opacity duration-200 ease-in-out truncate font-poppins">
                            {item.name}
                          </span>
                        )}
                      </div>
                      {isExpanded && (
                        <ChevronDown
                          className={clsx("w-4 h-4 transition-transform", {
                            "-rotate-180": expandedItem === item.name,
                          })}
                        />
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.disabled ? "#" : item.href}
                      className={clsx(getMenuItemStyles(isActive), {
                        "opacity-50 cursor-not-allowed": item.disabled,
                      })}
                      onClick={(e) => {
                        if (item.disabled) {
                          e.preventDefault();
                        }
                      }}
                    >
                      {typeof item.icon === "function" ? (
                        React.createElement(
                          isActive ? item.activeIcon : item.icon,
                          {
                            className: clsx(
                              "flex-shrink-0 w-5 h-5 text-foreground-900",
                              {
                                "opacity-50": item.disabled,
                              }
                            ),
                          }
                        )
                      ) : (
                        <Image
                          src={item.icon}
                          alt={`${item.name} icon`}
                          width={20}
                          height={20}
                          className={clsx(getIconStyles(isActive, isExpanded), {
                            "opacity-50": item.disabled,
                          })}
                          style={{ width: "auto", height: "auto" }}
                          loading="eager"
                          priority={true}
                        />
                      )}
                      {isExpanded && (
                        <span
                          className={clsx("flex-1 truncate font-poppins", {
                            "opacity-50": item.disabled,
                          })}
                        >
                          {item.name}
                        </span>
                      )}
                    </Link>
                  )}

                  {/* Submenu items */}
                  {isExpanded &&
                    item.subItems &&
                    expandedItem === item.name && (
                      <div className="flex flex-col gap-1 mt-1 ml-6 transition-all duration-200 ease-in-out">
                        {item.subItems.map((subItem) => {
                          const isSubActive = isActiveLink(
                            subItem.href,
                            pathname
                          );

                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className={getMenuItemStyles(isSubActive)}
                            >
                              {typeof subItem.icon === "function" ? (
                                React.createElement(
                                  isSubActive
                                    ? subItem.activeIcon
                                    : subItem.icon,
                                  {
                                    className: clsx(
                                      "flex-shrink-0 w-5 h-5",
                                      isSubActive
                                        ? "text-foreground-900"
                                        : "text-foreground-600"
                                    ),
                                  }
                                )
                              ) : (
                                <Image
                                  src={subItem.icon}
                                  alt={`${subItem.name} icon`}
                                  width={20}
                                  height={20}
                                  className={getIconStyles(isSubActive, true)}
                                  style={{ width: "auto", height: "auto" }}
                                  loading="eager"
                                  priority={true}
                                />
                              )}
                              <span className="truncate font-poppins">
                                {subItem.name}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                </div>
              </Tooltip>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default SideNavbar;
