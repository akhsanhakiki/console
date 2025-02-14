import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Textarea,
  Form,
} from "@heroui/react";

interface PlaygroundFormData {
  id?: string;
  name: string;
  pipelineName: string;
  description: string;
  type: string;
  createdAt?: string;
}

interface PlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PlaygroundFormData) => void;
  pipelineName: string;
  description: string;
}

const PlaygroundModal = ({
  isOpen,
  onClose,
  onSubmit,
  pipelineName,
  description,
}: PlaygroundModalProps) => {
  const [formData, setFormData] = useState<PlaygroundFormData>({
    name: "",
    pipelineName: pipelineName,
    description: "",
    type: pipelineName,
  });

  useEffect(() => {
    if (isOpen) {
      const storedPipeline =
        sessionStorage.getItem("selectedPipeline") || pipelineName;
      const storedDescription =
        sessionStorage.getItem("selectedPipelineDescription") || description;

      setFormData({
        ...formData,
        name: storedPipeline,
        pipelineName: storedPipeline,
        description: storedDescription,
        type: storedPipeline,
      });
    } else {
      setFormData({
        name: "",
        pipelineName: "",
        description: "",
        type: "",
      });
      // Clear session storage when modal is closed
      sessionStorage.removeItem("selectedPipeline");
      sessionStorage.removeItem("selectedPipelineDescription");
    }
  }, [isOpen, pipelineName, description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      return;
    }

    const playgroundData = {
      name: formData.name.trim(),
      pipelineName: formData.pipelineName,
      description: formData.description.trim() || "No description provided",
      type: formData.type,
    };

    // Get existing playgrounds from session storage
    const existingPlaygrounds = JSON.parse(
      sessionStorage.getItem("playgrounds") || "[]"
    );

    // Add new playground to the array with createdAt timestamp
    const updatedPlaygrounds = [
      ...existingPlaygrounds,
      {
        ...playgroundData,
        createdAt: new Date().toISOString(),
      },
    ];

    // Store updated playgrounds array in session storage
    sessionStorage.setItem("playgrounds", JSON.stringify(updatedPlaygrounds));

    // Submit the form data
    onSubmit({
      ...playgroundData,
      createdAt: new Date().toISOString(),
    });

    // Reset form
    setFormData({
      name: "",
      pipelineName: "",
      description: "",
      type: "",
    });

    // Clear temporary pipeline selection data
    sessionStorage.removeItem("selectedPipeline");
    sessionStorage.removeItem("selectedPipelineDescription");

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="font-poppins">
          Create New Playground
        </ModalHeader>
        <ModalBody>
          <Form
            className="flex flex-col gap-4 w-full"
            onSubmit={handleSubmit}
            validationBehavior="native"
          >
            <Input
              isRequired
              label="Playground Name"
              labelPlacement="outside"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter playground name"
              errorMessage={
                !formData.name.trim() && "Playground name is required"
              }
              validationState={!formData.name.trim() ? "invalid" : "valid"}
            />
            <Input
              label="Pipeline"
              labelPlacement="outside"
              value={formData.pipelineName}
              isDisabled
              description="Selected pipeline type for playground"
            />
            <Textarea
              label="Description"
              labelPlacement="outside"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter description for your playground"
              description="Provide a description to help identify this playground"
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2 w-full my-2">
              <Button variant="bordered" onPress={onClose} type="button">
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                isDisabled={!formData.name.trim()}
              >
                Create Playground
              </Button>
            </div>
          </Form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PlaygroundModal;
