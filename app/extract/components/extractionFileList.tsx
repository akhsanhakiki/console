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

const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "PIPELINE", uid: "pipeline", sortable: true },
  { name: "SCHEMA", uid: "schema", sortable: true },
  { name: "CREATION DATE", uid: "creationDate", sortable: true },
  { name: "", uid: "actions" },
];

const extractionFiles = [
  {
    id: 1,
    name: "Bank Statement - January",
    pipeline: "Bank Statement",
    schema: "Bank Statement Schema",
    creationDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Bank Statement - February",
    pipeline: "Bank Statement",
    schema: "Bank Statement Schema",
    creationDate: "2024-02-15",
  },
  {
    id: 3,
    name: "Bank Statement - March",
    pipeline: "Bank Statement",
    schema: "Bank Statement Schema",
    creationDate: "2024-03-15",
  },
  {
    id: 4,
    name: "Bank Statement - April",
    pipeline: "Bank Statement",
    schema: "Bank Statement Schema",
    creationDate: "2024-04-15",
  },
  {
    id: 5,
    name: "Bank Statement - May",
    pipeline: "Bank Statement",
    schema: "Bank Statement Schema",
    creationDate: "2024-05-15",
  },
  {
    id: 6,
    name: "Bank Statement - June",
    pipeline: "Bank Statement",
    schema: "Bank Statement Schema",
    creationDate: "2024-06-15",
  },
  {
    id: 7,
    name: "Bank Statement - July",
    pipeline: "Bank Statement",
    schema: "Bank Statement Schema",
    creationDate: "2024-07-15",
  },
  {
    id: 8,
    name: "Bank Statement - August",
    pipeline: "Bank Statement",
    schema: "Bank Statement Schema",
    creationDate: "2024-08-15",
  },
  {
    id: 9,
    name: "Bank Statement - September",
    pipeline: "Bank Statement",
    schema: "Bank Statement Schema",
    creationDate: "2024-09-15",
  },
  {
    id: 10,
    name: "Bank Statement - October",
    pipeline: "Bank Statement",
    schema: "Bank Statement Schema",
    creationDate: "2024-10-15",
  },
  {
    id: 11,
    name: "Bank Statement - November",
    pipeline: "Bank Statement",
    schema: "Bank Statement Schema",
    creationDate: "2024-11-15",
  },
  {
    id: 12,
    name: "Bank Statement - December",
    pipeline: "Bank Statement",
    schema: "Bank Statement Schema",
    creationDate: "2024-12-15",
  },
  {
    id: 13,
    name: "Bank Statement - January",
    pipeline: "Bank Statement",
    schema: "Bank Statement Schema",
    creationDate: "2025-01-15",
  },
  {
    id: 14,
    name: "Bank Statement - February",
    pipeline: "Bank Statement",
    schema: "Bank Statement Schema",
    creationDate: "2025-02-15",
  },
  {
    id: 15,
    name: "Bank Statement - March",
    pipeline: "Bank Statement",
    schema: "Bank Statement Schema",
    creationDate: "2025-03-15",
  },
  {
    id: 16,
    name: "Bank Statement - April",
    pipeline: "Bank Statement",
    schema: "Bank Statement Schema",
    creationDate: "2025-04-15",
  },
  {
    id: 17,
    name: "Bank Statement - May",
    pipeline: "Bank Statement",
    schema: "Bank Statement Schema",
    creationDate: "2025-05-15",
  },
  {
    id: 18,
    name: "Bank Statement - June",
    pipeline: "Bank Statement",
    schema: "Bank Statement Schema",
    creationDate: "2025-06-15",
  },
  {
    id: 19,
    name: "Bank Statement - July",
    pipeline: "Bank Statement",
    schema: "Bank Statement Schema",
    creationDate: "2025-07-15",
  },
  {
    id: 20,
    name: "Bank Statement - August",
    pipeline: "Bank Statement",
    schema: "Bank Statement Schema",
    creationDate: "2025-08-15",
  },

  // Add more mock data as needed
];

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "pipeline",
  "schema",
  "creationDate",
  "actions",
];

type ExtractionFile = (typeof extractionFiles)[0];

const ExtractionFileList = () => {
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
    let filtered = [...extractionFiles];
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

  const renderCell = useCallback(
    (item: ExtractionFile, columnKey: React.Key) => {
      const cellValue = item[columnKey as keyof ExtractionFile];

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
      } else {
        return cellValue;
      }
    },
    []
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Tabs variant="underlined" className="font-poppins">
            <Tab key="Draft" title="Draft" />
            <Tab key="Published" title="Published" />
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
          selectionMode="multiple"
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
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
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

export default ExtractionFileList;
