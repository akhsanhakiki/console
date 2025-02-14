import { useState, useEffect } from "react";

interface Playground {
  id: string;
  name: string;
  type: string;
  description: string;
  createdAt: string;
}

export const usePlaygrounds = () => {
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
  const [selectedPlayground, setSelectedPlayground] =
    useState<Playground | null>(null);

  useEffect(() => {
    // Load playgrounds from session storage on mount
    const storedPlaygrounds = sessionStorage.getItem("playgrounds");
    if (storedPlaygrounds) {
      setPlaygrounds(JSON.parse(storedPlaygrounds));
    }
  }, []);

  // Generate a short ID based on name and timestamp
  const generatePlaygroundId = (name: string) => {
    const timestamp = Date.now().toString(36); // Convert timestamp to base36
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, ""); // Remove special chars
    const shortName = cleanName.slice(0, 3); // Take first 3 chars
    return `${shortName}-${timestamp.slice(-4)}`; // Combine with last 4 chars of timestamp
  };

  const addPlayground = (name: string, type: string, description: string) => {
    const newPlayground = {
      id: generatePlaygroundId(name),
      name,
      type,
      description,
      createdAt: new Date().toISOString(),
    };

    const updatedPlaygrounds = [...playgrounds, newPlayground];
    setPlaygrounds(updatedPlaygrounds);
    sessionStorage.setItem("playgrounds", JSON.stringify(updatedPlaygrounds));
    return newPlayground;
  };

  const deletePlayground = (id: string) => {
    const updatedPlaygrounds = playgrounds.filter(
      (playground) => playground.id !== id
    );
    setPlaygrounds(updatedPlaygrounds);
    sessionStorage.setItem("playgrounds", JSON.stringify(updatedPlaygrounds));
  };

  const getPlaygroundByName = (name: string) => {
    const playground = playgrounds.find(
      (playground) => playground.name === name
    );
    setSelectedPlayground(playground || null);
    return playground;
  };

  const getAllPlaygrounds = () => {
    return playgrounds;
  };

  return {
    addPlayground,
    deletePlayground,
    getPlaygroundByName,
    getAllPlaygrounds,
    selectedPlayground,
  };
};
