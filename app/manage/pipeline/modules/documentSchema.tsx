"use client";
import React, { useState } from "react";
import { MdTune } from "react-icons/md";
import { useDocumentState } from "../components/documentSchema/hooks/useDocumentState";
import { useRectangleState } from "../components/documentSchema/hooks/useRectangleState";
import { DocumentViewer } from "../components/documentSchema/DocumentViewer";
import { NavigationFooter } from "../components/documentSchema/NavigationFooter";
import { RightSidebar } from "../components/documentSchema/RightSidebar";
import { LeftSidebar } from "../components/documentSchema/LeftSidebar";
import { Token } from "../components/documentSchema/types";

interface TableColumn {
  id: string;
  name: string;
  token: Token;
}

const DocumentSchema = () => {
  const [isSelectingToken, setIsSelectingToken] = useState(false);
  const [isTableEnabled, setIsTableEnabled] = useState(false);
  const [startOfTableToken, setStartOfTableToken] = useState<Token | null>(
    null
  );
  const [endOfTableToken, setEndOfTableToken] = useState<Token | null>(null);
  const [tableColumns, setTableColumns] = useState<TableColumn[]>([]);
  const [isEditingTableHeader, setIsEditingTableHeader] = useState(false);

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

  const {
    rectangles,
    setRectangles,
    isDrawing,
    currentRect,
    selectedRect,
    setSelectedRect,
    cursorMode,
    cursorPosition,
    stageRef,
    isHoveringRect,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleRectChange,
    deleteRectangle,
  } = useRectangleState({
    currentPage,
    tokens,
    scale,
  });

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

    const newColumns = tokensInRect.map((token) => ({
      id: token.id,
      name: token.text,
      token,
    }));

    setTableColumns(newColumns);
    setIsEditingTableHeader(false);
  };

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
        <LeftSidebar
          rectangles={rectangles}
          currentPage={currentPage}
          numPages={numPages}
          selectedRect={selectedRect}
          setSelectedRect={setSelectedRect}
        />

        <div className="flex flex-col w-8/12">
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
        />
      </div>
    </div>
  );
};

export default DocumentSchema;
