import { useState, useCallback, useRef } from "react";
import { Rectangle, Token, CursorMode } from "../types";
import DocSample from "@/public/sample/Ezdocs OCR Pages.json";

interface UseRectangleStateProps {
  currentPage: number;
  tokens: Token[];
  scale: number;
}

export const useRectangleState = ({
  currentPage,
  tokens,
  scale,
}: UseRectangleStateProps) => {
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentRect, setCurrentRect] = useState<Rectangle | null>(null);
  const [selectedRect, setSelectedRect] = useState<Rectangle | null>(null);
  const [cursorMode] = useState<CursorMode>("draw");
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const isHoveringRect = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const getRelativeCoordinates = useCallback(
    (clientX: number, clientY: number) => {
      if (!stageRef.current) return { x: 0, y: 0 };

      const pdfCanvas = stageRef.current.querySelector("canvas");
      if (!pdfCanvas) return { x: 0, y: 0 };

      const pdfRect = pdfCanvas.getBoundingClientRect();
      const currentPageData = DocSample[currentPage - 1];
      const docWidth = currentPageData.dimensions?.width || 0;
      const docHeight = currentPageData.dimensions?.height || 0;

      const x = clientX - pdfRect.left;
      const y = clientY - pdfRect.top;

      return {
        x: x / (docWidth * scale),
        y: y / (docHeight * scale),
      };
    },
    [currentPage, scale]
  );

  const isPointInsideAnyRect = useCallback(
    (x: number, y: number) => {
      return rectangles.some(
        (rect) =>
          rect.pageNumber === currentPage &&
          x >= rect.normalizedX &&
          x <= rect.normalizedX + rect.normalizedWidth &&
          y >= rect.normalizedY &&
          y <= rect.normalizedY + rect.normalizedHeight
      );
    },
    [rectangles, currentPage]
  );

  const doesRectangleOverlap = useCallback(
    (newRect: Rectangle) => {
      return rectangles.some(
        (rect) =>
          rect.pageNumber === currentPage &&
          !(
            newRect.normalizedX + newRect.normalizedWidth < rect.normalizedX ||
            newRect.normalizedX > rect.normalizedX + rect.normalizedWidth ||
            newRect.normalizedY + newRect.normalizedHeight < rect.normalizedY ||
            newRect.normalizedY > rect.normalizedY + rect.normalizedHeight
          )
      );
    },
    [rectangles, currentPage]
  );

  const getTokensInRectangle = useCallback(
    (rect: Rectangle) => {
      return tokens.filter((token) => {
        const tokenCenterX =
          token.bounding_box.x + token.bounding_box.width / 2;
        const tokenCenterY =
          token.bounding_box.y + token.bounding_box.height / 2;

        return (
          tokenCenterX >= rect.normalizedX &&
          tokenCenterX <= rect.normalizedX + rect.normalizedWidth &&
          tokenCenterY >= rect.normalizedY &&
          tokenCenterY <= rect.normalizedY + rect.normalizedHeight
        );
      });
    },
    [tokens]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { x, y } = getRelativeCoordinates(e.clientX, e.clientY);

      if (
        !e.currentTarget.classList.contains("table-drawing") &&
        isPointInsideAnyRect(x, y)
      )
        return;

      setSelectedRect(null);
      setIsDrawing(true);
      startPointRef.current = { x, y };

      setCurrentRect({
        id: Date.now().toString(),
        normalizedX: x,
        normalizedY: y,
        normalizedWidth: 0,
        normalizedHeight: 0,
        pageNumber: currentPage,
      });
    },
    [currentPage, isPointInsideAnyRect, getRelativeCoordinates]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { x: mouseX, y: mouseY } = getRelativeCoordinates(
        e.clientX,
        e.clientY
      );
      setCursorPosition({
        x: Math.round(
          mouseX * DocSample[currentPage - 1].dimensions.width * scale
        ),
        y: Math.round(
          mouseY * DocSample[currentPage - 1].dimensions.height * scale
        ),
      });

      if (!isDrawing || !startPointRef.current || !currentRect) return;

      const width = mouseX - startPointRef.current.x;
      const height = mouseY - startPointRef.current.y;

      setCurrentRect({
        ...currentRect,
        normalizedWidth: Math.abs(width),
        normalizedHeight: Math.abs(height),
        normalizedX: width < 0 ? mouseX : startPointRef.current.x,
        normalizedY: height < 0 ? mouseY : startPointRef.current.y,
      });
    },
    [isDrawing, currentRect, getRelativeCoordinates, currentPage, scale]
  );

  const handleMouseUp = useCallback(() => {
    if (isDrawing && currentRect) {
      if (
        currentRect.normalizedWidth > 0.01 &&
        currentRect.normalizedHeight > 0.01 &&
        !doesRectangleOverlap(currentRect)
      ) {
        const tokensInRect = getTokensInRectangle(currentRect);
        const newRect = {
          ...currentRect,
          tokens: tokensInRect.map((token) => ({
            text: token.text,
            confidence: token.confidence,
          })),
        };
        setRectangles([...rectangles, newRect]);
        setSelectedRect(newRect);
      }
    }

    setIsDrawing(false);
    setCurrentRect(null);
    startPointRef.current = null;
  }, [
    isDrawing,
    currentRect,
    rectangles,
    doesRectangleOverlap,
    getTokensInRectangle,
  ]);

  const handleRectChange = (newRect: Rectangle) => {
    const updatedRect = {
      ...newRect,
      normalizedX: newRect.normalizedX,
      normalizedY: newRect.normalizedY,
      normalizedWidth: newRect.normalizedWidth,
      normalizedHeight: newRect.normalizedHeight,
    };

    const tokensInRect = getTokensInRectangle(updatedRect);
    updatedRect.tokens = tokensInRect.map((token) => ({
      text: token.text,
      confidence: token.confidence,
    }));

    setRectangles(
      rectangles.map((rect) => (rect.id === newRect.id ? updatedRect : rect))
    );
    setSelectedRect(updatedRect);
  };

  const deleteRectangle = (id: string) => {
    setRectangles(rectangles.filter((rect) => rect.id !== id));
    if (selectedRect?.id === id) {
      setSelectedRect(null);
    }
  };

  return {
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
    handleMouseUp,
    handleRectChange,
    deleteRectangle,
  };
};
