export interface Rectangle {
  id: string;
  normalizedX: number;
  normalizedY: number;
  normalizedWidth: number;
  normalizedHeight: number;
  pageNumber: number;
  tokens?: Array<{
    text: string;
    confidence: number;
  }>;
}

export interface DocumentInfo {
  id: string;
  name: string;
  content: string;
  size: number;
  password?: string;
  format?: string[];
}

export interface Token {
  text: string;
  bounding_box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  id: string;
  confidence: number;
}

export type CursorMode = "draw" | "drag";

export interface StageSize {
  width: number;
  height: number;
}

export interface DocumentDimensions {
  width: number;
  height: number;
}

export interface TableColumn {
  id: string;
  name: string;
  token: Token;
  normalizedX: number;
  normalizedWidth: number;
}

export interface TableColumnDrag {
  columnId: string;
  startX: number;
  initialWidth: number;
}
