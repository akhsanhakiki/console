import React from "react";
import { Rect, Transformer } from "react-konva";
import { Rectangle, CursorMode } from "./types";

interface KonvaRectangleProps {
  rect: Rectangle & {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Rectangle) => void;
  cursorMode: CursorMode;
  onHover: (isHovering: boolean) => void;
}

export const KonvaRectangle = React.memo(
  ({
    rect,
    isSelected,
    onSelect,
    onChange,
    cursorMode,
    onHover,
  }: KonvaRectangleProps) => {
    const shapeRef = React.useRef<any>(null);
    const transformerRef = React.useRef<any>(null);
    const [isHovered, setIsHovered] = React.useState(false);

    React.useEffect(() => {
      if (isSelected && transformerRef.current && shapeRef.current) {
        transformerRef.current.nodes([shapeRef.current]);
        transformerRef.current.getLayer().batchDraw();
      }
    }, [isSelected]);

    const handleTransform = () => {
      if (!shapeRef.current) return;

      const node = shapeRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      node.scaleX(1);
      node.scaleY(1);

      const stage = node.getStage();
      if (!stage) return;

      const updatedRect = {
        ...rect,
        normalizedX: node.x() / stage.width(),
        normalizedY: node.y() / stage.height(),
        normalizedWidth: Math.max(5, node.width() * scaleX) / stage.width(),
        normalizedHeight: Math.max(5, node.height() * scaleY) / stage.height(),
      };

      onChange(updatedRect);
    };

    return (
      <>
        <Rect
          ref={shapeRef}
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          draggable={isSelected}
          stroke={
            isSelected ? "#0066FF" : isHovered ? "#0066FFB0" : "#0066FF80"
          }
          strokeWidth={isSelected || isHovered ? 2.5 : 2}
          fill={isHovered ? "rgba(0, 102, 255, 0.05)" : "transparent"}
          onMouseEnter={(e) => {
            setIsHovered(true);
            const stage = e.target.getStage();
            if (stage) {
              stage.container().style.cursor = "pointer";
            }
            onHover(true);
          }}
          onMouseLeave={(e) => {
            setIsHovered(false);
            const stage = e.target.getStage();
            if (stage) {
              stage.container().style.cursor = "default";
            }
            onHover(false);
          }}
          onMouseDown={(e) => {
            e.cancelBubble = true;
            onSelect();
          }}
          onDragStart={(e) => {
            e.target.setAttrs({
              shadowColor: "#0066FF",
              shadowBlur: 6,
              shadowOpacity: 0.3,
            });
          }}
          onDragMove={(e) => {
            const stage = e.target.getStage();
            if (!stage) return;

            const updatedRect = {
              ...rect,
              normalizedX: e.target.x() / stage.width(),
              normalizedY: e.target.y() / stage.height(),
            };

            onChange(updatedRect);
          }}
          onDragEnd={(e) => {
            e.target.setAttrs({
              shadowBlur: 0,
              shadowOpacity: 0,
            });
            handleTransform();
          }}
          onTransform={handleTransform}
          onTransformStart={(e) => {
            e.target.setAttrs({
              shadowColor: "#0066FF",
              shadowBlur: 6,
              shadowOpacity: 0.3,
            });
          }}
          onTransformEnd={(e) => {
            e.target.setAttrs({
              shadowBlur: 0,
              shadowOpacity: 0,
            });
            handleTransform();
          }}
        />
        {isSelected && (
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              const minWidth = 5;
              const minHeight = 5;
              const maxWidth = 2000;
              const maxHeight = 2000;

              if (
                newBox.width < minWidth ||
                newBox.height < minHeight ||
                newBox.width > maxWidth ||
                newBox.height > maxHeight
              ) {
                return oldBox;
              }
              return newBox;
            }}
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
              "middle-left",
              "middle-right",
              "top-center",
              "bottom-center",
            ]}
            rotateEnabled={false}
            borderStroke="#0066FF"
            borderStrokeWidth={1.5}
            anchorFill="#FFFFFF"
            anchorStroke="#0066FF"
            anchorStrokeWidth={1.5}
            anchorSize={8}
            keepRatio={false}
            padding={0}
            ignoreStroke={true}
            centeredScaling={false}
          />
        )}
      </>
    );
  }
);

KonvaRectangle.displayName = "KonvaRectangle";
