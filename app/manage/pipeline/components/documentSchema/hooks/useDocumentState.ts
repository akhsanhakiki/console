import { useState, useEffect, useRef } from "react";
import DocSample from "@/public/sample/Ezdocs OCR Pages.json";
import { StageSize, Token } from "../types";

export const useDocumentState = () => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [pageImage, setPageImage] = useState<HTMLImageElement | null>(null);
  const [stageSize, setStageSize] = useState<StageSize>({
    width: 0,
    height: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadImage();
    // Load tokens for current page
    const currentPageData = DocSample[currentPage - 1];
    if (currentPageData?.tokens) {
      setTokens(currentPageData.tokens);
    }
  }, [currentPage]);

  const loadImage = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the current page data
      const currentPageData = DocSample[currentPage - 1];
      if (!currentPageData?.content) {
        throw new Error("No image content found");
      }

      // Create and load the image
      const img = new window.Image();
      img.onload = () => {
        setPageImage(img);
        if (containerRef.current) {
          const containerWidth = containerRef.current.offsetWidth - 64;
          const containerHeight = containerRef.current.offsetHeight - 64;

          // Use the dimensions from the JSON if available, otherwise use image dimensions
          const docWidth = currentPageData.dimensions?.width || img.width;
          const docHeight = currentPageData.dimensions?.height || img.height;

          // Calculate scale to fit container while maintaining aspect ratio
          const scaleX = containerWidth / docWidth;
          const scaleY = containerHeight / docHeight;
          const newScale = Math.min(scaleX, scaleY, 1.0);
          setScale(newScale);

          setStageSize({
            width: docWidth * newScale,
            height: docHeight * newScale,
          });
        }
        setLoading(false);
      };
      img.onerror = () => {
        setError("Failed to load image");
        setLoading(false);
      };
      img.src = `data:image/png;base64,${currentPageData.content}`;

      setNumPages(DocSample.length);
    } catch (error) {
      console.error("Error loading image:", error);
      setError(error instanceof Error ? error.message : "Failed to load image");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pageImage && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth - 64;
      const containerHeight = containerRef.current.offsetHeight - 64;

      const currentPageData = DocSample[currentPage - 1];
      const docWidth = currentPageData.dimensions?.width || pageImage.width;
      const docHeight = currentPageData.dimensions?.height || pageImage.height;

      setStageSize({
        width: docWidth * scale,
        height: docHeight * scale,
      });
    }
  }, [scale, pageImage, currentPage]);

  return {
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
  };
};
