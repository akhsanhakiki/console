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
  const [isEditingTableHeader, setIsEditingTableHeader] = useState(false);
  const [isEditingTableEnd, setIsEditingTableEnd] = useState(false);
  const [isEditingTableFooter, setIsEditingTableFooter] = useState(false);
  const [tableHeaderRect, setTableHeaderRect] = useState<Rectangle | null>(
    null
  );
  const [tableEndRect, setTableEndRect] = useState<Rectangle | null>(null);
  const [tableFooterRect, setTableFooterRect] = useState<Rectangle | null>(
    null
  );
  const [tableColumns, setTableColumns] = useState<TableColumn[]>([]);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);

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

  // Reset table state when changing pages
  React.useEffect(() => {
    setTableHeaderRect(null);
    setTableEndRect(null);
    setTableFooterRect(null);
    setTableColumns([]);
    setIsEditingTableHeader(false);
    setIsEditingTableEnd(false);
    setIsEditingTableFooter(false);
  }, [currentPage]);

  // Handle table header selection
  const handleTableHeaderSelection = (rect: Rectangle) => {
    if (isEditingTableHeader) {
      const updatedRect = { ...rect, type: "table-header" as const };
      setTableHeaderRect(updatedRect);
      setIsEditingTableHeader(false);
    } else if (isEditingTableEnd) {
      // When selecting table end, detect tokens within the boundary
      const updatedRect = { ...rect, type: "table-end" as const };
      const tokensInBounds = tokens.filter((token) => {
        const tokenX = token.bounding_box.x;
        const tokenY = token.bounding_box.y;
        return (
          tokenX >= updatedRect.normalizedX &&
          tokenX <= updatedRect.normalizedX + updatedRect.normalizedWidth &&
          tokenY >= updatedRect.normalizedY &&
          tokenY <= updatedRect.normalizedY + updatedRect.normalizedHeight
        );
      });

      setTableEndRect({
        ...updatedRect,
        tokens: tokensInBounds.map((token) => ({
          text: token.text,
          confidence: token.confidence,
        })),
      });
      setIsEditingTableEnd(false);
    } else if (isEditingTableFooter) {
      const updatedRect = { ...rect, type: "page-footer" as const };
      setTableFooterRect(updatedRect);
      setIsEditingTableFooter(false);
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

  // Handle mouse up for table-related rectangles
  const handleMouseUp = () => {
    if (currentRect) {
      if (isEditingTableHeader || isEditingTableEnd || isEditingTableFooter) {
        // For table-related rectangles, bypass the rectangle overlap check
        handleTableHeaderSelection(currentRect);
        setIsDrawing(false);
        setCurrentRect(null);
      } else {
        // For normal rectangles, use the base handler
        baseHandleMouseUp();
      }
    } else {
      baseHandleMouseUp();
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <MdTune className="text-2xl w-5 h-5" />
          <h1 className="text-medium font-semibold text-foreground-900 font-poppins">
            Document Schema
          </h1>
        </div>
        <p className="text-sm text-foreground-600 font-poppins">
          Configure the document schema of the pipeline
        </p>
      </div>
      <div className="flex flex-row h-[calc(100vh-240px)] gap-2">
        <div className="flex flex-col w-full border-1 border-foreground-200 rounded-lg overflow-hidden">
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
            selectedToken={null}
            setSelectedToken={() => {}}
            onRectangleComplete={handleTableHeaderSelection}
            isEditingTableHeader={isEditingTableHeader}
            tableHeaderRect={tableHeaderRect}
            tableColumns={tableColumns}
            setTableColumns={setTableColumns}
            isEditingTableEnd={isEditingTableEnd}
            isEditingTableFooter={isEditingTableFooter}
            tableEndRect={tableEndRect}
            tableFooterRect={tableFooterRect}
            selectedColumnId={selectedColumnId}
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
          isEditingTableHeader={isEditingTableHeader}
          setIsEditingTableHeader={setIsEditingTableHeader}
          isEditingTableEnd={isEditingTableEnd}
          setIsEditingTableEnd={setIsEditingTableEnd}
          isEditingTableFooter={isEditingTableFooter}
          setIsEditingTableFooter={setIsEditingTableFooter}
          tableHeaderRect={tableHeaderRect}
          setTableHeaderRect={setTableHeaderRect}
          tableEndRect={tableEndRect}
          setTableEndRect={setTableEndRect}
          tableFooterRect={tableFooterRect}
          setTableFooterRect={setTableFooterRect}
          tableColumns={tableColumns}
          setTableColumns={setTableColumns}
          selectedColumnId={selectedColumnId}
          setSelectedColumnId={setSelectedColumnId}
        />
      </div>
    </div>
  );
};

export default DocumentSchema;
