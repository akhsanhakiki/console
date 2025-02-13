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
import TabControl from "./tabControl";
const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "SECRET KEY", uid: "secret", sortable: true },
  { name: "CREATED", uid: "created", sortable: true },
  { name: "LAST USED", uid: "lastUsed", sortable: true },
  { name: "CREATED BY", uid: "createdBy", sortable: true },
  { name: "EXPIRES", uid: "expires", sortable: true },
  { name: "", uid: "actions" },
];

const pipelines = [
  {
    id: "bk-001",
    name: "Bank Key",
    secret: "1234567890",
    created: "Jan 15, 2024",
    lastUsed: "Jan 15, 2024",
    createdBy: "John Doe",
    expires: "Jan 15, 2024",
    actions: "Edit, Delete",
  },
  {
    id: "ip-002",
    name: "Invoice Key",
    secret: "0987654321",
    created: "Jan 16, 2024",
    lastUsed: "Jan 16, 2024",
    createdBy: "Jane Smith",
    expires: "Jan 16, 2024",
    actions: "Edit, Delete",
  },
  {
    id: "um-003",
    name: "User Key",
    secret: "1122334455",
    created: "Jan 17, 2024",
    lastUsed: "Jan 17, 2024",
    createdBy: "Alice Johnson",
    expires: "Jan 17, 2024",
    actions: "Edit, Delete",
  },
  {
    id: "api-004",
    name: "API Key",
    secret: "2233445566",
    created: "Jan 18, 2024",
    lastUsed: "Jan 18, 2024",
    createdBy: "Bob Brown",
    expires: "Jan 18, 2024",
    actions: "View",
  },
  {
    id: "pg-005",
    name: "Payment Key",
    secret: "3344556677",
    created: "Jan 19, 2024",
    lastUsed: "Jan 19, 2024",
    createdBy: "Charlie Davis",
    expires: "Jan 19, 2024",
    actions: "Edit, Delete",
  },
  {
    id: "ds-006",
    name: "Doc Storage Key",
    secret: "4455667788",
    created: "Jan 20, 2024",
    lastUsed: "Jan 20, 2024",
    createdBy: "Diana Evans",
    expires: "Jan 20, 2024",
    actions: "Edit, Delete",
  },
  {
    id: "an-007",
    name: "Analytics Key",
    secret: "5566778899",
    created: "Jan 21, 2024",
    lastUsed: "Jan 21, 2024",
    createdBy: "Ethan Foster",
    expires: "Jan 21, 2024",
    actions: "View",
  },
  {
    id: "mk-008",
    name: "Marketing Key",
    secret: "6677889900",
    created: "Jan 22, 2024",
    lastUsed: "Jan 22, 2024",
    createdBy: "Fiona Green",
    expires: "Jan 22, 2024",
    actions: "Edit, Delete",
  },
  {
    id: "sk-009",
    name: "Support Key",
    secret: "7788990011",
    created: "Jan 23, 2024",
    lastUsed: "Jan 23, 2024",
    createdBy: "George Harris",
    expires: "Jan 23, 2024",
    actions: "Edit, Delete",
  },
  {
    id: "bk-010",
    name: "Backup Key",
    secret: "8899001122",
    created: "Jan 24, 2024",
    lastUsed: "Jan 24, 2024",
    createdBy: "Hannah Ives",
    expires: "Jan 24, 2024",
    actions: "Edit, Delete",
  },
];

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "id",
  "description",
  "creationDate",
  "actions",
];

type Pipeline = (typeof pipelines)[0];

interface ActiveTabs {
  setActiveTab: (tab: string) => void;
  filterValue: string;
}

const ApiKeys = ({ setActiveTab, filterValue }: ActiveTabs) => {
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

  const filteredItems = useMemo(() => {
    let filtered = [...pipelines];
    if (filterValue) {
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
    }
    if (columnKey === "secret") {
      const maskedSecret = item.secret.substring(0, 3) + "*".repeat(10);
      return <div className="font-mono">{maskedSecret}</div>;
    }
    return cellValue;
  }, []);

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

  // Add a stable key for the table
  const tableKey = "pipeline-table";

  return (
    <div className="w-full h-full flex flex-col">
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
                className="cursor-pointer hover:bg-foreground-100"
              >
                {(columnKey) => (
                  <TableCell key={`${item.id}-${columnKey}`}>
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

export default ApiKeys;
