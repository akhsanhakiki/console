import {
  Button,
  Checkbox,
  Divider,
  ScrollShadow,
  Select,
  SelectItem,
  Input,
} from "@heroui/react";
import React, { useState } from "react";
import { FiArrowRight, FiTrash2, FiX, FiEdit2, FiPlus } from "react-icons/fi";
import { Rectangle, Token } from "./types";
import DocSample from "@/public/sample/Ezdocs OCR Pages.json";

interface TableColumn {
  id: string;
  name: string;
  token: Token;
  normalizedX: number;
  normalizedWidth: number;
}

interface RightSidebarProps {
  currentPage: number;
  numPages: number;
  scale: number;
  rectangles: Rectangle[];
  selectedRect: Rectangle | null;
  setSelectedRect: (rect: Rectangle | null) => void;
  deleteRectangle: (id: string) => void;
  cursorPosition: { x: number; y: number };
  setRectangles: (rectangles: Rectangle[]) => void;
  tokens: Token[];
  isSelectingToken: boolean;
  setIsSelectingToken: (isSelecting: boolean) => void;
  isTableEnabled: boolean;
  setIsTableEnabled: (enabled: boolean) => void;
  startOfTableToken: Token | null;
  setStartOfTableToken: (token: Token | null) => void;
  endOfTableToken: Token | null;
  setEndOfTableToken: (token: Token | null) => void;
  tableColumns: TableColumn[];
  setTableColumns: (columns: TableColumn[]) => void;
  isEditingTableHeader: boolean;
  setIsEditingTableHeader: (editing: boolean) => void;
  tableHeaderRect: Rectangle | null;
  setTableHeaderRect: (rect: Rectangle | null) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  currentPage,
  numPages,
  scale,
  rectangles,
  selectedRect,
  setSelectedRect,
  deleteRectangle,
  cursorPosition,
  setRectangles,
  tokens,
  isSelectingToken,
  setIsSelectingToken,
  isTableEnabled,
  setIsTableEnabled,
  startOfTableToken,
  setStartOfTableToken,
  endOfTableToken,
  setEndOfTableToken,
  tableColumns,
  setTableColumns,
  isEditingTableHeader,
  setIsEditingTableHeader,
  tableHeaderRect,
  setTableHeaderRect,
}) => {
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [newColumnName, setNewColumnName] = useState("");

  const handleAddColumn = () => {
    if (!newColumnName.trim() || !tableHeaderRect) return;

    const newColumn: TableColumn = {
      id: crypto.randomUUID(),
      name: newColumnName.trim(),
      token: {
        id: crypto.randomUUID(),
        text: "",
        bounding_box: { x: 0, y: 0, width: 0, height: 0 },
        confidence: 0,
      },
      normalizedX: tableHeaderRect.normalizedX,
      normalizedWidth: 0,
    };

    // Calculate positions and widths for all columns
    const numColumns = tableColumns.length + 1;
    const columnWidth = tableHeaderRect.normalizedWidth / numColumns; // Divide header width equally

    const updatedColumns = [
      ...tableColumns.map((col, index) => ({
        ...col,
        normalizedX: tableHeaderRect.normalizedX + index * columnWidth,
        normalizedWidth: columnWidth,
      })),
      {
        ...newColumn,
        normalizedX:
          tableHeaderRect.normalizedX + (numColumns - 1) * columnWidth,
        normalizedWidth: columnWidth,
      },
    ];

    setTableColumns(updatedColumns);
    setNewColumnName("");
  };

  return (
    <div className="flex flex-col w-2/12 border-1 overflow-scroll">
      {/* Document Info */}
      <div className="p-4 border-b">
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-foreground-600 font-poppins">
            Document Info
          </span>
          {/* Document name */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-foreground-500 font-poppins">
              Document name
            </span>
            <span className="text-sm font-normal truncate font-poppins">
              Sample Document
            </span>
          </div>
          {/* Pages and Dimensions */}
          <div className="flex flex-row gap-4">
            {/* Pages */}
            <div className="flex flex-col w-1/2 gap-1">
              <span className="text-xs text-foreground-500 font-poppins">
                Pages
              </span>
              <span className="text-sm font-normal font-poppins">
                {numPages}
              </span>
            </div>
            {/* Dimensions */}
            <div className="flex flex-col w-1/2 gap-1">
              <span className="text-xs text-foreground-500 font-poppins">
                Dimensions
              </span>
              <span className="text-sm font-normal font-poppins">
                {DocSample[currentPage - 1]?.dimensions.width || 0} x{" "}
                {DocSample[currentPage - 1]?.dimensions.height || 0}
              </span>
            </div>
          </div>
          {/* Cursor position */}
          <div className="flex flex-row gap-4">
            <div className="flex flex-col w-full gap-1">
              <span className="text-xs text-foreground-500 font-poppins w-full">
                Cursor position
              </span>
              <div className="flex flex-row gap-2 w-full">
                <div className="flex flex-row text-sm font-normal font-poppins bg-foreground-100 px-2 py-1 rounded-md gap-1 w-1/2">
                  <span>X:</span>
                  {(() => {
                    const normalizedX =
                      cursorPosition.x /
                      (DocSample[currentPage - 1]?.dimensions.width * scale ||
                        1);
                    return normalizedX >= 0 && normalizedX <= 1
                      ? normalizedX.toFixed(6)
                      : "-";
                  })()}
                </div>
                <div className="flex flex-row text-sm font-normal font-poppins bg-foreground-100 px-2 py-1 rounded-md gap-1 w-1/2">
                  <span>Y:</span>
                  {(() => {
                    const normalizedY =
                      cursorPosition.y /
                      (DocSample[currentPage - 1]?.dimensions.height * scale ||
                        1);
                    return normalizedY >= 0 && normalizedY <= 1
                      ? normalizedY.toFixed(6)
                      : "-";
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table annotations */}
      <div className="p-4 ">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row items-center justify-start">
            <Checkbox
              size="sm"
              isSelected={isTableEnabled}
              onValueChange={setIsTableEnabled}
            />
            <span className="text-sm font-medium text-foreground-600 font-poppins">
              Table
            </span>
          </div>

          {isTableEnabled && (
            <>
              <div className="flex flex-col w-full gap-1">
                <span className="text-xs text-foreground-500 font-poppins w-full">
                  Start of table
                </span>
                <div className="flex flex-row gap-2 w-full">
                  <div className="flex flex-row text-sm font-normal font-poppins bg-foreground-100 px-2 py-1 rounded-md gap-1 w-full items-center justify-between">
                    {startOfTableToken ? (
                      <>
                        <div className="text-sm font-poppins truncate">
                          {startOfTableToken.text}
                        </div>
                        <span
                          className="cursor-pointer"
                          onClick={() => {
                            setStartOfTableToken(null);
                            setIsSelectingToken(false);
                          }}
                        >
                          <FiX className="w-4 h-4" />
                        </span>
                      </>
                    ) : (
                      <span className="text-foreground-400">
                        select a token
                      </span>
                    )}
                  </div>
                  <Button
                    className={
                      isSelectingToken && !startOfTableToken
                        ? "bg-primary"
                        : "bg-foreground-200"
                    }
                    size="sm"
                    variant="solid"
                    isIconOnly
                    isDisabled={!!endOfTableToken}
                    onPress={() => {
                      if (!startOfTableToken) {
                        setIsSelectingToken(true);
                      }
                    }}
                  >
                    <FiArrowRight />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col w-full gap-1">
                <span className="text-xs text-foreground-500 font-poppins w-full">
                  End of table
                </span>
                <div className="flex flex-row gap-2 w-full">
                  <div className="flex flex-row text-sm font-normal font-poppins bg-foreground-100 px-2 py-1 rounded-md gap-1 w-full items-center justify-between">
                    {endOfTableToken ? (
                      <>
                        <div className="text-sm font-poppins truncate">
                          {endOfTableToken.text}
                        </div>
                        <span
                          className="cursor-pointer"
                          onClick={() => {
                            setEndOfTableToken(null);
                            setIsSelectingToken(false);
                          }}
                        >
                          <FiX className="w-4 h-4" />
                        </span>
                      </>
                    ) : (
                      <span className="text-foreground-400">
                        select a token
                      </span>
                    )}
                  </div>
                  <Button
                    className={
                      isSelectingToken && !endOfTableToken
                        ? "bg-primary"
                        : "bg-foreground-200"
                    }
                    size="sm"
                    variant="solid"
                    isIconOnly
                    isDisabled={!startOfTableToken || !!endOfTableToken}
                    onPress={() => {
                      if (!endOfTableToken && startOfTableToken) {
                        setIsSelectingToken(true);
                      }
                    }}
                  >
                    <FiArrowRight />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col w-full gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-foreground-500 font-poppins w-full">
                    Table header
                  </span>
                  <Button
                    size="sm"
                    variant="light"
                    onPress={() => {
                      if (tableColumns.length > 0) {
                        // Clear table columns and rectangle when re-selecting
                        setTableColumns([]);
                        setTableHeaderRect(null);
                      }
                      setIsEditingTableHeader(!isEditingTableHeader);
                    }}
                  >
                    {tableColumns.length > 0
                      ? "Re-select"
                      : isEditingTableHeader
                        ? "Cancel"
                        : "Draw"}
                  </Button>
                </div>
                <ScrollShadow className="flex flex-col h-[calc(100vh-690px)]">
                  <div className="flex flex-col gap-2 mt-2">
                    {tableColumns.map((column) => (
                      <div
                        key={column.id}
                        className="flex flex-col gap-1 bg-foreground-100 p-2 rounded-md"
                      >
                        {editingColumnId === column.id ? (
                          <Input
                            size="sm"
                            placeholder="Column name"
                            value={column.name}
                            onChange={(e) => {
                              const newColumns = tableColumns.map((c) =>
                                c.id === column.id
                                  ? { ...c, name: e.target.value }
                                  : c
                              );
                              setTableColumns(newColumns);
                            }}
                            onBlur={() => setEditingColumnId(null)}
                            autoFocus
                          />
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-poppins truncate flex-1">
                              {column.name}
                            </span>
                            <Button
                              size="sm"
                              variant="light"
                              isIconOnly
                              onPress={() => setEditingColumnId(column.id)}
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                        <div className="flex flex-col gap-0.5 text-xs text-foreground-500 font-mono">
                          {tableHeaderRect && (
                            <>
                              <div className="flex justify-between">
                                <span>X:</span>
                                <span>
                                  {(
                                    tableHeaderRect.normalizedX +
                                    column.normalizedX *
                                      tableHeaderRect.normalizedWidth
                                  ).toFixed(6)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Width:</span>
                                <span>
                                  {(
                                    column.normalizedWidth *
                                    tableHeaderRect.normalizedWidth
                                  ).toFixed(6)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Y:</span>
                                <span>
                                  {tableHeaderRect.normalizedY.toFixed(6)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Height:</span>
                                <span>
                                  {tableHeaderRect.normalizedHeight.toFixed(6)}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollShadow>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
