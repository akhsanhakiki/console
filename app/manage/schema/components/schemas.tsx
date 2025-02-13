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
import { pipeline } from "stream";

const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "ID", uid: "id", sortable: true },
  { name: "DOC TYPE", uid: "docType", sortable: true },
  { name: "DESCRIPTION", uid: "description", sortable: true },
  { name: "CREATION DATE", uid: "creationDate", sortable: true },
  { name: "", uid: "actions" },
];

const schemas = [
  {
    id: "SBS-001",
    name: "Simple Bank Statement",
    docType: "Bank Statement",
    description:
      "Basic schema for capturing essential bank statement details like balance and transactions.",
    creationDate: "Jan 15, 2024",
  },
  {
    id: "SI-002",
    name: "Simple Invoice",
    docType: "Invoice",
    description:
      "Basic schema for capturing essential invoice details like customer name, invoice number, and total amount.",
    creationDate: "Jan 15, 2024",
  },
  {
    id: "SI-003",
    name: "Simple Receipt",
    docType: "Receipt",
    description:
      "Basic schema for capturing essential receipt details like date, amount, and vendor.",
    creationDate: "Jan 16, 2024",
  },
  {
    id: "SI-004",
    name: "Simple Contract",
    docType: "Contract",
    description:
      "Basic schema for capturing essential contract details like parties involved and terms.",
    creationDate: "Jan 17, 2024",
  },
  {
    id: "SI-005",
    name: "Simple Purchase Order",
    docType: "Purchase Order",
    description:
      "Basic schema for capturing essential purchase order details like items and quantities.",
    creationDate: "Jan 18, 2024",
  },
  {
    id: "SI-006",
    name: "Simple Invoice with Tax",
    docType: "Invoice",
    description:
      "Basic schema for capturing essential invoice details including tax calculations.",
    creationDate: "Jan 19, 2024",
  },
  {
    id: "SI-007",
    name: "Simple Delivery Note",
    docType: "Delivery Note",
    description:
      "Basic schema for capturing essential delivery note details like items delivered and recipient.",
    creationDate: "Jan 20, 2024",
  },
  {
    id: "SI-008",
    name: "Simple Expense Report",
    docType: "Expense Report",
    description:
      "Basic schema for capturing essential expense report details like expenses incurred and approvals.",
    creationDate: "Jan 21, 2024",
  },
  {
    id: "SI-009",
    name: "Simple HR Document",
    docType: "HR Document",
    description:
      "Basic schema for capturing essential HR document details like employee information and policies.",
    creationDate: "Jan 22, 2024",
  },
  {
    id: "SI-010",
    name: "Simple Legal Document",
    docType: "Legal Document",
    description:
      "Basic schema for capturing essential legal document details like clauses and parties involved.",
    creationDate: "Jan 23, 2024",
  },
  {
    id: "SI-011",
    name: "Simple Research Proposal",
    docType: "Research Proposal",
    description:
      "Basic schema for capturing essential research proposal details like objectives and methodology.",
    creationDate: "Jan 24, 2024",
  },
  {
    id: "SI-012",
    name: "Simple Medical Report",
    docType: "Medical Report",
    description:
      "Basic schema for capturing essential medical report details like patient information and diagnosis.",
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

type Schema = (typeof schemas)[0];

const Schemas = () => {
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
    let filtered = [...schemas];
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

  const renderCell = useCallback((item: Schema, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof Schema];

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
      columnKey === "docType" ||
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

  return (
    <div className="w-full h-full flex flex-col">
      {/* Top Content - Fixed Height */}
      <div className="flex-none mb-4">{topContent}</div>

      {/* Table Container - Flexible Height */}
      <div className="flex-1 min-h-0">
        {" "}
        {/* min-h-0 is crucial for flex child scrolling */}
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
                className="cursor-pointer hover:bg-foreground-100 transition-all duration-200 ease-in-out"
              >
                {(columnKey) => (
                  <TableCell className="text-sm font-poppins">
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

export default Schemas;
