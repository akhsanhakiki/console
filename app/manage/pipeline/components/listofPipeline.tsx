"use client";
import React, { useState, useMemo, useCallback } from "react";
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
} from "@heroui/react";

import { IoSearch } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FiPlus } from "react-icons/fi";
import { pipeline } from "stream";

const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "ID", uid: "id", sortable: true },
  { name: "DESCRIPTION", uid: "description", sortable: true },
  { name: "CREATION DATE", uid: "creationDate", sortable: true },
  { name: "", uid: "actions" },
];

const pipelines = [
  {
    id: "GD-001",
    name: "General Documents",
    description:
      "Extracts multiple document types automatically without category selection.",
    creationDate: "Jan 15, 2024",
  },
  {
    id: "BS-002",
    name: "Bank Statement",
    description: "Extracts bank statements from PDF files.",
    creationDate: "Jan 15, 2024",
  },
  {
    id: "IN-003",
    name: "Invoice Processing",
    description: "Automates the extraction of data from invoices.",
    creationDate: "Jan 16, 2024",
  },
  {
    id: "RE-004",
    name: "Receipt Capture",
    description: "Extracts information from receipts for expense tracking.",
    creationDate: "Jan 17, 2024",
  },
  {
    id: "CO-005",
    name: "Contract Analysis",
    description: "Analyzes contracts to extract key terms and conditions.",
    creationDate: "Jan 18, 2024",
  },
  {
    id: "PO-006",
    name: "Purchase Order",
    description: "Extracts data from purchase orders for processing.",
    creationDate: "Jan 19, 2024",
  },
  {
    id: "HR-007",
    name: "HR Documents",
    description: "Extracts information from HR-related documents.",
    creationDate: "Jan 20, 2024",
  },
  {
    id: "LE-008",
    name: "Legal Documents",
    description: "Extracts data from various legal documents.",
    creationDate: "Jan 21, 2024",
  },
  {
    id: "RE-009",
    name: "Research Papers",
    description: "Extracts key information from academic research papers.",
    creationDate: "Jan 22, 2024",
  },
  {
    id: "ME-010",
    name: "Medical Records",
    description: "Extracts data from medical records for analysis.",
    creationDate: "Jan 23, 2024",
  },
  {
    id: "TE-011",
    name: "Technical Manuals",
    description: "Extracts information from technical manuals and guides.",
    creationDate: "Jan 24, 2024",
  },
  {
    id: "TR-012",
    name: "Travel Itineraries",
    description: "Extracts details from travel itineraries and bookings.",
    creationDate: "Jan 25, 2024",
  },

  // Add more mock data as needed
];

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "id",
  "description",
  "creationDate",
  "actions",
];

type Pipeline = (typeof pipelines)[0];

interface ListofPipelineProps {
  setCurrentView: (view: "list" | "new") => void;
}

const ListofPipeline = ({ setCurrentView }: ListofPipelineProps) => {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "creationDate",
    direction: "descending",
  });
  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filtered = [...pipelines];
    if (hasSearchFilter) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filtered;
  }, [filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const renderCell = useCallback((item: Pipeline, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof Pipeline];

    if (columnKey === "actions") {
      return (
        <div className="flex justify-end items-center gap-2 w-8">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <HiOutlineDotsVertical className="text-foreground-900" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="edit">Edit</DropdownItem>
              <DropdownItem key="delete">Delete</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    }
    if (columnKey === "name") {
      return <div>{item.name}</div>;
    } else if (
      columnKey === "id" ||
      columnKey === "description" ||
      columnKey === "creationDate"
    ) {
      return <div className="text-foreground-500">{cellValue}</div>;
    } else {
      return cellValue;
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Tabs variant="underlined" className="font-poppins">
            <Tab key="Default" title="Default" />
            <Tab key="Custom" title="Custom" />
          </Tabs>
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
        <div className="flex items-start gap-2 w-1/5">
          <span className="text-small text-default-400">
            {selectedKeys === "all"
              ? "All items selected"
              : `${selectedKeys.size} of ${filteredItems.length} selected`}
          </span>
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
          <Button
            className="text-foreground-800 border-foreground-300"
            variant="bordered"
            onPress={() => setCurrentView("new")}
          >
            <FiPlus className="text-foreground-800" />
            New Pipeline
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages, setCurrentView]);

  // Add a stable key for the table
  const tableKey = "pipeline-table";

  return (
    <div className="w-full h-full flex flex-col">
      {/* Top Content - Fixed Height */}
      <div className="flex-none mb-4">{topContent}</div>

      {/* Table Container - Flexible Height */}
      <div className="flex-1 min-h-0">
        {" "}
        {/* min-h-0 is crucial for flex child scrolling */}
        <Table
          key={tableKey}
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
                className="cursor-pointer hover:bg-foreground-100 transition-all duration-200 ease-in-out"
              >
                {(columnKey) => (
                  <TableCell
                    key={`${item.id}-${columnKey}`}
                    className="text-sm font-poppins"
                  >
                    {renderCell(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Bottom Content - Fixed Height */}
      <div className="flex-none mt-4">{bottomContent}</div>
    </div>
  );
};

export default ListofPipeline;
