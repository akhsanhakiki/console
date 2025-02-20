import "@testing-library/jest-dom";

// Mock canvas
jest.mock("canvas", () => ({
  createCanvas: () => ({
    getContext: () => ({
      measureText: () => ({
        width: 0,
      }),
    }),
  }),
}));
