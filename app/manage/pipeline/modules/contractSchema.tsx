import React, { useState, useEffect } from "react";
import { MdTune } from "react-icons/md";
import SchemaEditor from "../components/contractSchema/schemaEditor";
import BindingsSection from "../components/contractSchema/bindingsSection";
import { SchemaField } from "../components/contractSchema/types";

const ContractSchema = () => {
  const [contractSchema, setContractSchema] = useState<SchemaField[]>([]);
  const [documentSchemaKeys, setDocumentSchemaKeys] = useState<
    Array<{
      id: string;
      key: string;
      description: string;
    }>
  >([]);

  // In a real application, you would fetch this from your backend
  useEffect(() => {
    // Mock document schema keys for demonstration
    setDocumentSchemaKeys([
      {
        id: "1",
        key: "company_name",
        description: "Company name from the document",
      },
      {
        id: "2",
        key: "contract_date",
        description: "Contract signing date",
      },
      {
        id: "3",
        key: "amount",
        description: "Contract amount",
      },
      // Add more mock keys as needed
    ]);
  }, []);

  const handleUpdateBindings = (fieldId: string, boundKeys: string[]) => {
    setContractSchema((prevSchema) => {
      const updateField = (fields: SchemaField[]): SchemaField[] => {
        return fields.map((field) => {
          if (field.id === fieldId) {
            return { ...field, boundKeys };
          }
          if (field.children) {
            return {
              ...field,
              children: updateField(field.children),
            };
          }
          return field;
        });
      };
      return updateField(prevSchema);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <MdTune className="text-2xl w-5 h-5" />
          <h1 className="text-medium font-semibold text-foreground-900 font-poppins">
            Contract schema configuration
          </h1>
        </div>
        <p className="text-sm text-foreground-600 font-poppins">
          Create and configure your own contract schema
        </p>
      </div>

      {/* Contract Schema */}
      <div className="flex flex-row gap-4">
        <div className="flex-1">
          <div className="flex flex-col gap-2">
            <h2 className="text-medium font-medium text-foreground-500 font-poppins">
              Contract schema
            </h2>
            <SchemaEditor
              schema={contractSchema}
              onSchemaChange={setContractSchema}
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-col gap-2">
            <h2 className="text-medium font-medium text-foreground-500 font-poppins">
              Document schema bindings
            </h2>
            <BindingsSection
              contractSchema={contractSchema}
              documentSchemaKeys={documentSchemaKeys}
              onUpdateBindings={handleUpdateBindings}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractSchema;
