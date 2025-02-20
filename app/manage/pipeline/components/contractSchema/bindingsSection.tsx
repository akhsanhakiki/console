import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { SchemaField } from "./types";

interface BindingsSectionProps {
  contractSchema: SchemaField[];
  documentSchemaKeys: Array<{
    id: string;
    key: string;
    description: string;
  }>;
  onUpdateBindings: (fieldId: string, boundKeys: string[]) => void;
}

const BindingsSection: React.FC<BindingsSectionProps> = ({
  contractSchema,
  documentSchemaKeys,
  onUpdateBindings,
}) => {
  const renderField = (field: SchemaField) => {
    if (field.type === "object") {
      return (
        <div key={field.id} className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            {field.name}
          </h3>
          <div className="ml-4">
            {field.children?.map((child) => renderField(child))}
          </div>
        </div>
      );
    }

    return (
      <div
        key={field.id}
        className="mb-4 p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-sm font-medium text-gray-700">{field.name}</h3>
            <p className="text-sm text-gray-500">{field.description}</p>
          </div>
          <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
            {field.type}
          </span>
        </div>

        <div className="space-y-2">
          <select
            className="w-full p-2 border rounded-md"
            onChange={(e) => {
              const selectedKey = e.target.value;
              if (selectedKey) {
                onUpdateBindings(field.id, [
                  ...(field.boundKeys || []),
                  selectedKey,
                ]);
              }
            }}
            value=""
          >
            <option value="">Select a document key to bind</option>
            {documentSchemaKeys
              .filter((key) => !field.boundKeys?.includes(key.id))
              .map((key) => (
                <option key={key.id} value={key.id}>
                  {key.key} - {key.description}
                </option>
              ))}
          </select>

          {field.boundKeys && field.boundKeys.length > 0 && (
            <div className="mt-2">
              <h4 className="text-xs font-medium text-gray-600 mb-1">
                Bound Keys:
              </h4>
              <div className="flex flex-wrap gap-2">
                {field.boundKeys.map((keyId) => {
                  const key = documentSchemaKeys.find((k) => k.id === keyId);
                  if (!key) return null;

                  return (
                    <div
                      key={keyId}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      <span>{key.key}</span>
                      <button
                        onClick={() =>
                          onUpdateBindings(
                            field.id,
                            field.boundKeys?.filter((k) => k !== keyId) || []
                          )
                        }
                        className="p-1 hover:text-blue-900"
                      >
                        <MdClose className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {contractSchema.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">
            Create a contract schema first to start binding document keys
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {contractSchema.map((field) => renderField(field))}
        </div>
      )}
    </div>
  );
};

export default BindingsSection;
