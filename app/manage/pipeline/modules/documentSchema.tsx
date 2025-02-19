"use client";
import React, { useState } from "react";
import { MdTune } from "react-icons/md";
import { useDocumentState } from "../components/documentSchema/hooks/useDocumentState";
import { useRectangleState } from "../components/documentSchema/hooks/useRectangleState";
import { DocumentViewer } from "../components/documentSchema/DocumentViewer";
import { NavigationFooter } from "../components/documentSchema/NavigationFooter";
import { RightSidebar } from "../components/documentSchema/RightSidebar";

import {
  Rectangle,
  Token,
  TableColumn,
} from "../components/documentSchema/types";

const DocumentSchema = () => {
  const [isSelectingToken, setIsSelectingToken] = useState(false);
  const [isTableEnabled, setIsTableEnabled] = useState(false);
  const [startOfTableToken, setStartOfTableToken] = useState<Token | null>(
    null
  );
  const [endOfTableToken, setEndOfTableToken] = useState<Token | null>(null);
  const [tableColumns, setTableColumns] = useState<TableColumn[]>([]);
  const [isEditingTableHeader, setIsEditingTableHeader] = useState(false);
  const [tableHeaderRect, setTableHeaderRect] = useState<Rectangle | null>(
    null
  );

  const {
    numPages,
    currentPage,
    setCurrentPage,
    scale,
    setScale,
    pageImage,
    stageSize,
    loading,
    error,
    tokens,
    containerRef,
  } = useDocumentState();

  // Reset token selection when changing pages
  React.useEffect(() => {
    setStartOfTableToken(null);
    setEndOfTableToken(null);
    setIsSelectingToken(false);
  }, [currentPage]);

  // Handle table header selection
  const handleTableHeaderSelection = (rect: Rectangle) => {
    if (!isEditingTableHeader) return;

    const tokensInRect = tokens.filter((token) => {
      const tokenCenterX = token.bounding_box.x + token.bounding_box.width / 2;
      const tokenCenterY = token.bounding_box.y + token.bounding_box.height / 2;

      return (
        tokenCenterX >= rect.normalizedX &&
        tokenCenterX <= rect.normalizedX + rect.normalizedWidth &&
        tokenCenterY >= rect.normalizedY &&
        tokenCenterY <= rect.normalizedY + rect.normalizedHeight
      );
    });

    // Sort tokens by their x position to maintain left-to-right order
    const sortedTokens = tokensInRect.sort(
      (a, b) => a.bounding_box.x - b.bounding_box.x
    );

    // Calculate relative positions for each token within the header rect
    const newColumns = sortedTokens.map((token, index) => {
      const columnWidth = 1 / sortedTokens.length; // Divide header width equally
      return {
        id: token.id,
        name: token.text,
        token,
        normalizedX: index * columnWidth,
        normalizedWidth: columnWidth,
      };
    });

    // Only update if we found tokens
    if (newColumns.length > 0) {
      setTableColumns(newColumns);
      setTableHeaderRect(rect);
      setIsEditingTableHeader(false);
    }
  };

  const {
    rectangles,
    setRectangles,
    isDrawing,
    setIsDrawing,
    currentRect,
    setCurrentRect,
    selectedRect,
    setSelectedRect,
    cursorMode,
    cursorPosition,
    stageRef,
    isHoveringRect,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp: baseHandleMouseUp,
    handleRectChange,
    deleteRectangle,
  } = useRectangleState({
    currentPage,
    tokens,
    scale,
  });

  // Custom handleMouseUp that prevents adding rectangles when editing table header
  const handleMouseUp = React.useCallback(() => {
    if (isDrawing && currentRect) {
      if (isEditingTableHeader) {
        handleTableHeaderSelection(currentRect);
        setIsDrawing(false);
        setCurrentRect(null);
      } else {
        baseHandleMouseUp();
      }
    } else {
      baseHandleMouseUp();
    }
  }, [
    isDrawing,
    currentRect,
    isEditingTableHeader,
    baseHandleMouseUp,
    handleTableHeaderSelection,
  ]);

  return (
    <div className="flex flex-col gap-4">
      {/* Document Schema Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <MdTune className="text-2xl w-5 h-5" />
          <h1 className="text-medium font-bold">
            Document schema configuration
          </h1>
        </div>
        <p className="text-sm text-gray-500">
          Configure the document schema of the pipeline
        </p>
      </div>

      {/* Image Viewer and Editor Section */}
      <div className="flex flex-row h-[calc(100vh-240px)]">
        <div className="flex flex-col w-full">
          <DocumentViewer
            pageImage={pageImage}
            stageSize={stageSize}
            loading={loading}
            error={error}
            tokens={tokens}
            rectangles={rectangles}
            currentRect={currentRect}
            selectedRect={selectedRect}
            currentPage={currentPage}
            scale={scale}
            stageRef={stageRef}
            containerRef={containerRef}
            isDrawing={isDrawing}
            handleMouseDown={handleMouseDown}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            handleRectChange={handleRectChange}
            setSelectedRect={setSelectedRect}
            isSelectingToken={isSelectingToken}
            selectedToken={startOfTableToken || endOfTableToken}
            setSelectedToken={(token) => {
              if (isSelectingToken) {
                if (!startOfTableToken) {
                  setStartOfTableToken(token);
                } else if (!endOfTableToken) {
                  setEndOfTableToken(token);
                }
                setIsSelectingToken(false);
              }
            }}
            onRectangleComplete={handleTableHeaderSelection}
            isEditingTableHeader={isEditingTableHeader}
            tableHeaderRect={tableHeaderRect}
            tableColumns={tableColumns}
            setTableColumns={setTableColumns}
          />
          <NavigationFooter
            currentPage={currentPage}
            numPages={numPages}
            scale={scale}
            setCurrentPage={setCurrentPage}
            setScale={setScale}
          />
        </div>

        <RightSidebar
          currentPage={currentPage}
          numPages={numPages}
          scale={scale}
          rectangles={rectangles}
          selectedRect={selectedRect}
          setSelectedRect={setSelectedRect}
          deleteRectangle={deleteRectangle}
          cursorPosition={cursorPosition}
          setRectangles={setRectangles}
          tokens={tokens}
          isSelectingToken={isSelectingToken}
          setIsSelectingToken={setIsSelectingToken}
          isTableEnabled={isTableEnabled}
          setIsTableEnabled={setIsTableEnabled}
          startOfTableToken={startOfTableToken}
          setStartOfTableToken={setStartOfTableToken}
          endOfTableToken={endOfTableToken}
          setEndOfTableToken={setEndOfTableToken}
          tableColumns={tableColumns}
          setTableColumns={setTableColumns}
          isEditingTableHeader={isEditingTableHeader}
          setIsEditingTableHeader={setIsEditingTableHeader}
          tableHeaderRect={tableHeaderRect}
          setTableHeaderRect={setTableHeaderRect}
        />
      </div>
    </div>
  );
};

export default DocumentSchema;
