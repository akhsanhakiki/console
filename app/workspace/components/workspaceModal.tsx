import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@heroui/react";

interface WorkspaceFormData {
  name: string;
}

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WorkspaceFormData) => Promise<void>;
  initialData?: { name: string } | null;
  mode?: "create" | "edit";
}

const WorkspaceModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = "create",
}: WorkspaceModalProps) => {
  const [formData, setFormData] = useState<WorkspaceFormData>({
    name: "",
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({ name: initialData.name });
    } else if (!isOpen) {
      setFormData({ name: "" });
    }
  }, [isOpen, initialData]);

  const handleSubmit = async () => {
    try {
      await onSubmit(formData);
      setFormData({ name: "" });
      onClose();
    } catch (error) {
      console.error("Error submitting workspace:", error);
    }
  };

  const handleClose = () => {
    setFormData({ name: "" });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent>
        <ModalHeader>
          {mode === "create" ? "Create New Workspace" : "Edit Workspace"}
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-foreground-600 mb-1 block">
                Workspace Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter workspace name"
                className="w-full"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="bordered" className="mr-2" onPress={handleClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            disabled={!formData.name.trim()}
          >
            {mode === "create" ? "Create Workspace" : "Save Changes"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WorkspaceModal;
