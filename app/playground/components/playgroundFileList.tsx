"use client";
import React, { useState, useMemo, useCallback } from "react";
import { LuFileX2 } from "react-icons/lu";
import { Tabs, Tab } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Selection,
  SortDescriptor,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { motion } from "framer-motion";
import { HTMLMotionProps } from "framer-motion";

import { IoSearch } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { usePlaygrounds } from "../hooks/usePlayground";
import NewPlayground from "./playground";
import { IoArrowBack } from "react-icons/io5";
import ChevronDown from "@/public/images/icons/chevronDown";

const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "PIPELINE", uid: "type", sortable: true },
  { name: "DESCRIPTION", uid: "description", sortable: true },
  { name: "CREATION DATE", uid: "createdAt", sortable: true },
  { name: "", uid: "actions" },
];

const playgroundFiles = [
  {
    id: 1,
    name: "Bank Statement - January",
    type: "Bank Statement",
    description: "Monthly bank statement extraction for January 2024",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Bank Statement - February",
    type: "Bank Statement",
    description: "Monthly bank statement extraction for February 2024",
    createdAt: "2024-02-15",
  },
  {
    id: 3,
    name: "Bank Statement - March",
    type: "Bank Statement",
    description: "Monthly bank statement extraction for March 2024",
    createdAt: "2024-03-15",
  },
  {
    id: 4,
    name: "Bank Statement - April",
    type: "Bank Statement",
    description: "Monthly bank statement extraction for April 2024",
    createdAt: "2024-04-15",
  },
  {
    id: 5,
    name: "Bank Statement - May",
    type: "Bank Statement",
    description: "Monthly bank statement extraction for May 2024",
    createdAt: "2024-05-15",
  },
  {
    id: 6,
    name: "Bank Statement - June",
    type: "Bank Statement",
    description: "Monthly bank statement extraction for June 2024",
    createdAt: "2024-06-15",
  },
  {
    id: 7,
    name: "Bank Statement - July",
    type: "Bank Statement",
    description: "Monthly bank statement extraction for July 2024",
    createdAt: "2024-07-15",
  },
  {
    id: 8,
    name: "Bank Statement - August",
    type: "Bank Statement",
    description: "Monthly bank statement extraction for August 2024",
    createdAt: "2024-08-15",
  },
  {
    id: 9,
    name: "Bank Statement - September",
    type: "Bank Statement",
    description: "Monthly bank statement extraction for September 2024",
    createdAt: "2024-09-15",
  },
  {
    id: 10,
    name: "Bank Statement - October",
    type: "Bank Statement",
    description: "Monthly bank statement extraction for October 2024",
    createdAt: "2024-10-15",
  },
  {
    id: 11,
    name: "Bank Statement - November",
    type: "Bank Statement",
    description: "Monthly bank statement extraction for November 2024",
    createdAt: "2024-11-15",
  },
  {
    id: 12,
    name: "Bank Statement - December",
    type: "Bank Statement",
    description: "Monthly bank statement extraction for December 2024",
    createdAt: "2024-12-15",
  },
  {
    id: 13,
    name: "Bank Statement - January",
    type: "Bank Statement",
    description: "Monthly bank statement extraction for January 2025",
    createdAt: "2025-01-15",
  },
  {
    id: 14,
    name: "Bank Statement - February",
    type: "Bank Statement",
    description: "Monthly bank statement extraction for February 2025",
    createdAt: "2025-02-15",
  },
  {
    id: 15,
    name: "Bank Statement - March",
    type: "Bank Statement",
    description: "Monthly bank statement extraction for March 2025",
    createdAt: "2025-03-15",
  },
  {
    id: 16,
    name: "Bank Statement - April",
    type: "Bank Statement",
    description: "Monthly bank statement extraction for April 2025",
    createdAt: "2025-04-15",
  },
  {
    id: 17,
    name: "Bank Statement - May",
    type: "Bank Statement",
    description: "Monthly bank statement extraction for May 2025",
    createdAt: "2025-05-15",
  },
  {
    id: 18,
    name: "Bank Statement - June",
    type: "Bank Statement",
    description: "Monthly bank statement extraction for June 2025",
    createdAt: "2025-06-15",
  },
  {
    id: 19,
    name: "Bank Statement - July",
    type: "Bank Statement",
    description: "Monthly bank statement extraction for July 2025",
    createdAt: "2025-07-15",
  },
  {
    id: 20,
    name: "Bank Statement - August",
    type: "Bank Statement",
    description: "Monthly bank statement extraction for August 2025",
    createdAt: "2025-08-15",
  },

  // Add more mock data as needed
];

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "type",
  "description",
  "createdAt",
  "actions",
];

type PlaygroundFile = (typeof playgroundFiles)[0];

const PlaygroundFileList = () => {
  const { getAllPlaygrounds, deletePlayground } = usePlaygrounds();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "createdAt",
    direction: "descending",
  });
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPlayground, setSelectedPlayground] = useState<any>(null);

  // New state from page.tsx
  const [newPlayground, setNewPlayground] = useState("");
  const [currentView, setCurrentView] = useState<"list" | "new" | "playground">(
    "list"
  );
  const [playgroundName, setPlaygroundName] = useState("");

  const handleBack = () => {
    setNewPlayground("");
    setCurrentView("list");
    setPlaygroundName("");
  };

  const handleNewPlayground = (name: string) => {
    setNewPlayground(name);
    setCurrentView("new");
    setPlaygroundName(name);
  };

  const playgrounds = getAllPlaygrounds();
  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filtered = [...playgrounds];
    if (hasSearchFilter) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filtered;
  }, [playgrounds, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const handleEdit = (item: any) => {
    setPlaygroundName(item.name);
    setCurrentView("playground");
  };

  const handleDelete = (item: any) => {
    setSelectedPlayground(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPlayground) {
      deletePlayground(selectedPlayground.id.toString());
      setDeleteModalOpen(false);
      setSelectedPlayground(null);
    }
  };

  const renderCell = useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof typeof item];

    switch (columnKey) {
      case "actions":
        return (
          <div className="flex justify-end items-center gap-2 w-8">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <HiOutlineDotsVertical className="text-foreground-900" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="edit" onPress={() => handleEdit(item)}>
                  Edit
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  onPress={() => handleDelete(item)}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      case "name":
        return <div className="font-medium">{item.name}</div>;
      case "type":
        return <div className="text-foreground-600">{item.type}</div>;
      case "description":
        return (
          <div className="text-foreground-500 truncate max-w-md">
            {item.description || "No description"}
          </div>
        );
      case "createdAt":
        return (
          <div className="text-foreground-500">
            {new Date(cellValue).toLocaleDateString()}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-center">
          <h2 className="text-sm font-semibold font-poppins text-foreground-700">
            Recent Playgrounds
          </h2>
          <Input
            isClearable
            className="w-full sm:max-w-[20%]"
            placeholder="Search by name..."
            startContent={<IoSearch />}
            value={filterValue}
            onValueChange={setFilterValue}
          />
        </div>
      </div>
    );
  }, [filterValue]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="text-small text-default-400 w-1/5">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="flex w-1/5 justify-end gap-2">
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            value={rowsPerPage.toString()}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value="5">5 rows</option>
            <option value="10">10 rows</option>
            <option value="15">15 rows</option>
            <option value="20">20 rows</option>
          </select>
        </div>
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages]);

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
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1,
      },
    },
  };

  const tableRowVariants = {
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

  if (currentView !== "list") {
    return (
      <motion.div
        className="w-full h-full flex flex-col gap-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="flex flex-row gap-2 items-center"
          variants={itemVariants}
        >
          <div className="cursor-pointer" onClick={handleBack}>
            <h1 className="text-xl font-semibold font-poppins text-foreground-900">
              Playground
            </h1>
          </div>
          <ChevronDown className="-rotate-90" />
          <h2 className="text-sm font-medium font-poppins text-foreground-900">
            {playgroundName}
          </h2>
        </motion.div>
        <NewPlayground
          onBack={handleBack}
          onNext={() => {}}
          pipelineType={newPlayground}
          playgroundName={
            currentView === "playground" ? playgroundName : undefined
          }
        />
      </motion.div>
    );
  }

  if (playgrounds.length === 0) {
    return (
      <motion.div
        className="flex flex-col gap-2 h-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h2
          className="text-base font-semibold font-poppins text-foreground-700"
          variants={itemVariants}
        >
          Recent Playgrounds
        </motion.h2>
        <motion.div
          className="flex flex-col gap-4 justify-center items-center h-full"
          variants={itemVariants}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <LuFileX2 className="text-foreground-500 w-32 h-32 p-8 rounded-3xl" />
          </motion.div>
          <motion.div
            className="flex flex-col gap-2 justify-center items-center"
            variants={itemVariants}
          >
            <p className="text-foreground-800 font-poppins font-medium text-sm">
              No playgrounds found
            </p>
            <p className="text-foreground-500 font-poppins font-normal text-sm">
              Create a new playground to get started
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full h-full flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Top Content - Fixed Height */}
      <motion.div className="flex-none mb-4" variants={itemVariants}>
        {topContent}
      </motion.div>

      {/* Table Container - Flexible Height */}
      <motion.div className="flex-1 min-h-0" variants={itemVariants}>
        <Table
          isCompact
          removeWrapper
          aria-label="Extraction files table"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
          classNames={{
            table: "min-w-full",
            thead: "sticky top-0 z-20 bg-background",
            tbody: "overflow-y-auto",
            th: [
              "bg-transparent",
              "text-default-500",
              "border-b",
              "border-divider",
            ],
            base: ["flex flex-col h-[calc(100vh-28rem)] overflow-scroll"],
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "end" : "start"}
                allowsSorting={column.sortable}
                className={`font-poppins ${
                  column.uid === "actions" ? "w-8" : "w-auto"
                }`}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={"No files found"}
            items={items}
            className="overflow-y-auto"
          >
            {(item) => (
              <TableRow
                key={item.id}
                className="cursor-pointer font-poppins hover:bg-foreground-100"
                onClick={() => {
                  setPlaygroundName(item.name);
                  setCurrentView("playground");
                }}
              >
                {(columnKey) => (
                  <TableCell>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        mass: 1,
                        delay: items.indexOf(item) * 0.1,
                      }}
                    >
                      {renderCell(item, columnKey)}
                    </motion.div>
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* Bottom Content - Fixed Height */}
      <motion.div className="flex-none mt-4" variants={itemVariants}>
        {bottomContent}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ModalHeader className="font-poppins">Confirm Delete</ModalHeader>
            <ModalBody>
              <p className="text-foreground-700 font-poppins text-sm">
                Are you sure you want to delete the playground "
                <span className="font-medium">{selectedPlayground?.name}</span>
                "? This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="bordered"
                onPress={() => setDeleteModalOpen(false)}
                className="font-poppins"
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={confirmDelete}
                className="font-poppins"
              >
                Delete
              </Button>
            </ModalFooter>
          </motion.div>
        </ModalContent>
      </Modal>
    </motion.div>
  );
};

export default PlaygroundFileList;
