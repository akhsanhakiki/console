import {
  Button,
  Checkbox,
  Divider,
  ScrollShadow,
  Select,
  SelectItem,
  Input,
  Textarea,
} from "@heroui/react";
import React, { useState } from "react";
import { FiArrowRight, FiTrash2, FiX, FiEdit2, FiPlus } from "react-icons/fi";
import { Rectangle, Token, FixedField } from "./types";
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
  isEditingTableHeader: boolean;
  setIsEditingTableHeader: (editing: boolean) => void;
  isEditingTableEnd: boolean;
  setIsEditingTableEnd: (editing: boolean) => void;
  isEditingTableFooter: boolean;
  setIsEditingTableFooter: (editing: boolean) => void;
  tableHeaderRect: Rectangle | null;
  setTableHeaderRect: (rect: Rectangle | null) => void;
  tableEndRect: Rectangle | null;
  setTableEndRect: (rect: Rectangle | null) => void;
  tableFooterRect: Rectangle | null;
  setTableFooterRect: (rect: Rectangle | null) => void;
  tableColumns: TableColumn[];
  setTableColumns: (columns: TableColumn[]) => void;
  selectedColumnId?: string | null;
  setSelectedColumnId?: (id: string | null) => void;
  fixedFields: FixedField[];
  setFixedFields: (fields: FixedField[]) => void;
  drawingForFieldId: string | null;
  setDrawingForFieldId: (id: string | null) => void;
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
  isEditingTableHeader,
  setIsEditingTableHeader,
  isEditingTableEnd,
  setIsEditingTableEnd,
  isEditingTableFooter,
  setIsEditingTableFooter,
  tableHeaderRect,
  setTableHeaderRect,
  tableEndRect,
  setTableEndRect,
  tableFooterRect,
  setTableFooterRect,
  tableColumns,
  setTableColumns,
  selectedColumnId,
  setSelectedColumnId,
  fixedFields,
  setFixedFields,
  drawingForFieldId,
  setDrawingForFieldId,
}) => {
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [newColumnName, setNewColumnName] = useState("");
  const [newFieldKey, setNewFieldKey] = useState("");
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [isAddingField, setIsAddingField] = useState(false);

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
      normalizedX: 0,
      normalizedWidth: 0,
    };

    // Calculate positions and widths for all columns
    const numColumns = tableColumns.length + 1;
    const columnWidth = 1 / numColumns; // Each column takes equal portion of the total width (1.0)

    const updatedColumns = [
      ...tableColumns.map((col, index) => ({
        ...col,
        normalizedX: index * columnWidth,
        normalizedWidth: columnWidth,
      })),
      {
        ...newColumn,
        normalizedX: (numColumns - 1) * columnWidth,
        normalizedWidth: columnWidth,
      },
    ];

    setTableColumns(updatedColumns);
    setNewColumnName("");
  };

  const handleAddField = () => {
    if (!newFieldKey.trim()) return;

    const newField: FixedField = {
      id: crypto.randomUUID(),
      key: newFieldKey.trim(),
      description: "",
      exampleValue: "",
    };

    setFixedFields([...fixedFields, newField]);
    setNewFieldKey("");
    setIsAddingField(false);
  };

  const handleUpdateField = (id: string, updates: Partial<FixedField>) => {
    setFixedFields(
      fixedFields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const handleDeleteField = (id: string) => {
    setFixedFields(fixedFields.filter((field) => field.id !== id));
  };

  const handleTokenSelection = (field: FixedField) => {
    if (selectedRect && selectedRect.tokens) {
      handleUpdateField(field.id, {
        exampleValue: selectedRect.tokens.map((token) => token.text).join(" "),
        tokens: selectedRect.tokens,
      });
      setSelectedRect(null);
      setDrawingForFieldId(null);
    }
  };

  const startDrawingForField = (fieldId: string) => {
    setDrawingForFieldId(fieldId);
    // Clear any existing selection
    setSelectedRect(null);
  };

  // Effect to handle token selection when a rectangle is selected
  React.useEffect(() => {
    if (drawingForFieldId && selectedRect && selectedRect.tokens) {
      handleTokenSelection(
        fixedFields.find((f) => f.id === drawingForFieldId)!
      );
    }
  }, [selectedRect, drawingForFieldId]);

  return (
    <div className="flex flex-col w-3/12 rounded-lg border-1 overflow-scroll">
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
                      ? normalizedX.toFixed(3)
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
                      ? normalizedY.toFixed(3)
                      : "-";
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Field Section */}
      <div className="p-4 border-b">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground-600 font-poppins">
              Fixed Field
            </span>
            {drawingForFieldId && (
              <Button
                size="sm"
                variant="solid"
                className="bg-foreground-200"
                onPress={() => setDrawingForFieldId(null)}
              >
                Cancel Drawing
              </Button>
            )}
          </div>

          {/* Add Field Button */}
          {!isAddingField ? (
            <Button
              size="sm"
              variant="solid"
              className="bg-foreground-200"
              onPress={() => setIsAddingField(true)}
              isDisabled={!!drawingForFieldId}
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Field</span>
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <Input
                size="sm"
                placeholder="Field key"
                value={newFieldKey}
                onChange={(e) => setNewFieldKey(e.target.value)}
                className="font-poppins"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="solid"
                  className="bg-primary"
                  onPress={handleAddField}
                >
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="solid"
                  className="bg-foreground-200"
                  onPress={() => {
                    setIsAddingField(false);
                    setNewFieldKey("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Field List */}
          <ScrollShadow className="flex flex-col gap-2">
            {fixedFields.map((field) => (
              <div
                key={field.id}
                className={`flex flex-col gap-2 p-3 rounded-lg ${
                  drawingForFieldId === field.id
                    ? "bg-primary/10"
                    : "bg-foreground-50"
                }`}
              >
                {/* Field Header */}
                <div className="flex justify-between items-center">
                  {editingFieldId === field.id ? (
                    <Input
                      size="sm"
                      value={field.key}
                      onChange={(e) =>
                        handleUpdateField(field.id, { key: e.target.value })
                      }
                      onBlur={() => setEditingFieldId(null)}
                      autoFocus
                      className="font-poppins"
                    />
                  ) : (
                    <span className="text-sm font-medium font-poppins">
                      {field.key}
                    </span>
                  )}
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="light"
                      isIconOnly
                      onPress={() => setEditingFieldId(field.id)}
                      isDisabled={!!drawingForFieldId}
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      isIconOnly
                      onPress={() => handleDeleteField(field.id)}
                      isDisabled={!!drawingForFieldId}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Field Description */}
                <Textarea
                  size="sm"
                  placeholder="Add description"
                  value={field.description}
                  onChange={(e) =>
                    handleUpdateField(field.id, { description: e.target.value })
                  }
                  className="font-poppins min-h-[60px]"
                  isDisabled={!!drawingForFieldId}
                />

                {/* Example Value */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-foreground-500 font-poppins">
                      Example Value
                    </span>
                    {drawingForFieldId === field.id ? (
                      <span className="text-xs text-primary font-poppins">
                        Draw a rectangle to select value
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="light"
                        onPress={() => startDrawingForField(field.id)}
                        isDisabled={
                          !!drawingForFieldId && drawingForFieldId !== field.id
                        }
                      >
                        Draw Example
                      </Button>
                    )}
                  </div>
                  {field.tokens && field.tokens.length > 0 ? (
                    <div className="text-sm font-poppins bg-foreground-100 p-2 rounded">
                      {field.tokens.map((token) => token.text).join(" ")}
                    </div>
                  ) : (
                    <div className="text-sm text-foreground-400 font-poppins bg-foreground-100 p-2 rounded">
                      No example value selected
                    </div>
                  )}
                </div>
              </div>
            ))}
          </ScrollShadow>
        </div>
      </div>
      {/* Table annotations */}
      <div className="p-4 border-b">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row items-center justify-start gap-2">
            <span className="text-sm font-medium text-foreground-600 font-poppins">
              Table
            </span>
            <Checkbox
              size="sm"
              isSelected={isTableEnabled}
              onValueChange={setIsTableEnabled}
            />
          </div>

          {isTableEnabled && (
            <>
              {/* Table Header Section */}
              <div className="flex flex-col w-full gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-foreground-500 font-poppins w-full">
                    Table header
                  </span>
                  <Button
                    size="sm"
                    variant="solid"
                    className={
                      isEditingTableHeader ? "bg-primary" : "bg-foreground-200"
                    }
                    onPress={() => {
                      if (tableHeaderRect) {
                        // Clear table columns and rectangle when re-selecting
                        setTableColumns([]);
                        setTableHeaderRect(null);
                      }
                      setIsEditingTableHeader(!isEditingTableHeader);
                    }}
                    isDisabled={isEditingTableEnd || isEditingTableFooter}
                  >
                    {tableHeaderRect
                      ? "Re-select"
                      : isEditingTableHeader
                        ? "Cancel"
                        : "Draw"}
                  </Button>
                </div>
                {tableHeaderRect && (
                  <div className="flex flex-col gap-2 bg-foreground-50 p-2 rounded-md">
                    <div className="flex flex-col gap-0.5 text-xs text-foreground-500 font-mono">
                      <div className="flex justify-between">
                        <span>X:</span>
                        <span>{tableHeaderRect.normalizedX.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Y:</span>
                        <span>{tableHeaderRect.normalizedY.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Width:</span>
                        <span>
                          {tableHeaderRect.normalizedWidth.toFixed(6)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Height:</span>
                        <span>
                          {tableHeaderRect.normalizedHeight.toFixed(6)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Table End Section */}
              <div className="flex flex-col w-full gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-foreground-500 font-poppins w-full">
                    End of table
                  </span>
                  <Button
                    size="sm"
                    variant="solid"
                    className={
                      isEditingTableEnd ? "bg-primary" : "bg-foreground-200"
                    }
                    onPress={() => {
                      if (tableEndRect) {
                        setTableEndRect(null);
                      }
                      setIsEditingTableEnd(!isEditingTableEnd);
                    }}
                    isDisabled={
                      !tableHeaderRect ||
                      isEditingTableHeader ||
                      isEditingTableFooter
                    }
                  >
                    {tableEndRect
                      ? "Re-select"
                      : isEditingTableEnd
                        ? "Cancel"
                        : "Draw"}
                  </Button>
                </div>
                {tableEndRect && (
                  <div className="flex flex-col gap-2 bg-foreground-50 p-2 rounded-md">
                    <div className="flex flex-col gap-0.5 text-xs text-foreground-500 font-mono">
                      <div className="flex justify-between font-poppins">
                        <span>X:</span>
                        <span>{tableEndRect.normalizedX.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between font-poppins">
                        <span>Y:</span>
                        <span>{tableEndRect.normalizedY.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between font-poppins">
                        <span>Width:</span>
                        <span>{tableEndRect.normalizedWidth.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between font-poppins">
                        <span>Height:</span>
                        <span>{tableEndRect.normalizedHeight.toFixed(6)}</span>
                      </div>
                    </div>
                    {tableEndRect.tokens && tableEndRect.tokens.length > 0 && (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-foreground-500 font-poppins">
                          Detected tokens:
                        </span>
                        <div className="text-sm font-poppins bg-foreground-100 p-2 rounded">
                          {tableEndRect.tokens.map((token, idx) => (
                            <span key={idx}>{token.text} </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Page Footer Section */}
              <div className="flex flex-col w-full gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-foreground-500 font-poppins w-full">
                    Page footer
                  </span>
                  <Button
                    size="sm"
                    variant="solid"
                    className={
                      isEditingTableFooter ? "bg-primary" : "bg-foreground-200"
                    }
                    onPress={() => {
                      if (tableFooterRect) {
                        setTableFooterRect(null);
                      }
                      setIsEditingTableFooter(!isEditingTableFooter);
                    }}
                    isDisabled={
                      !tableEndRect || isEditingTableHeader || isEditingTableEnd
                    }
                  >
                    {tableFooterRect
                      ? "Re-select"
                      : isEditingTableFooter
                        ? "Cancel"
                        : "Draw"}
                  </Button>
                </div>
                {tableFooterRect && (
                  <div className="flex flex-col gap-2 bg-foreground-50 p-2 rounded-md">
                    <div className="flex flex-col gap-0.5 text-xs text-foreground-500 font-mono">
                      <div className="flex justify-between font-poppins">
                        <span>X:</span>
                        <span>{tableFooterRect.normalizedX.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between font-poppins">
                        <span>Y:</span>
                        <span>{tableFooterRect.normalizedY.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between font-poppins">
                        <span>Width:</span>
                        <span>
                          {tableFooterRect.normalizedWidth.toFixed(6)}
                        </span>
                      </div>
                      <div className="flex justify-between font-poppins">
                        <span>Height:</span>
                        <span>
                          {tableFooterRect.normalizedHeight.toFixed(6)}
                        </span>
                      </div>
                    </div>
                    {tableFooterRect.tokens &&
                      tableFooterRect.tokens.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-foreground-500 font-poppins">
                            Detected tokens:
                          </span>
                          <div className="text-sm font-poppins bg-foreground-100 p-2 rounded">
                            {tableFooterRect.tokens.map((token, idx) => (
                              <span key={idx}>{token.text} </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* Column Management - Only show after table end is defined */}
              {tableHeaderRect && tableEndRect && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Input
                      size="sm"
                      placeholder="Column name"
                      value={newColumnName}
                      onChange={(e) => setNewColumnName(e.target.value)}
                      className="flex-1 font-poppins"
                    />
                    <Button
                      size="sm"
                      variant="solid"
                      className="bg-foreground-200 text-foreground-700"
                      isIconOnly
                      onPress={handleAddColumn}
                    >
                      <FiPlus className="w-4 h-4" />
                    </Button>
                  </div>

                  <ScrollShadow className="flex flex-col h-[calc(100vh-690px)]">
                    <div className="flex flex-col gap-2">
                      {tableColumns.map((column) => (
                        <div
                          key={column.id}
                          className={`flex flex-col gap-1 p-2 rounded-md cursor-pointer transition-colors ${
                            selectedColumnId === column.id
                              ? "bg-primary/10"
                              : "bg-foreground-100 hover:bg-foreground-200"
                          }`}
                          onClick={() => {
                            if (setSelectedColumnId) {
                              setSelectedColumnId(
                                selectedColumnId === column.id
                                  ? null
                                  : column.id
                              );
                            }
                          }}
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
                              onClick={(e) => e.stopPropagation()}
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
                                onPress={(e: any) => {
                                  e.preventDefault();
                                  setEditingColumnId(column.id);
                                }}
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                          <div className="flex flex-col gap-0.5 text-xs text-foreground-500 font-mono">
                            <div className="flex justify-between">
                              <span>X:</span>
                              <span>{column.normalizedX.toFixed(6)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Width:</span>
                              <span>{column.normalizedWidth.toFixed(6)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollShadow>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
