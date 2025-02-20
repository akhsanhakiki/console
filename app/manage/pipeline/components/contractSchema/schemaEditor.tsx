import React from "react";
import { MdAdd, MdDragIndicator, MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SchemaField, SchemaDataType } from "./types";

interface SchemaEditorProps {
  schema: SchemaField[];
  onSchemaChange: React.Dispatch<React.SetStateAction<SchemaField[]>>;
}

interface SortableFieldProps {
  field: SchemaField;
  index: number;
  onRemove: (id: string) => void;
  onChange: (id: string, changes: Partial<SchemaField>) => void;
  onAddNested: (parentId: string) => void;
  dataTypes: SchemaDataType[];
}

const SortableField: React.FC<SortableFieldProps> = ({
  field,
  index,
  onRemove,
  onChange,
  onAddNested,
  dataTypes,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg p-4 mb-2 shadow-sm border border-gray-200"
    >
      <div className="flex items-center gap-2">
        <div {...attributes} {...listeners} className="cursor-move">
          <MdDragIndicator className="text-gray-400" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Field name"
              value={field.name}
              onChange={(e) => onChange(field.id, { name: e.target.value })}
              className="flex-1 px-2 py-1 border rounded"
            />
            <select
              value={field.type}
              onChange={(e) =>
                onChange(field.id, { type: e.target.value as SchemaDataType })
              }
              className="px-2 py-1 border rounded"
            >
              {dataTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            placeholder="Description"
            value={field.description}
            onChange={(e) =>
              onChange(field.id, { description: e.target.value })
            }
            className="w-full px-2 py-1 border rounded"
          />
        </div>
        <button
          onClick={() => onRemove(field.id)}
          className="p-1 text-red-500 hover:bg-red-50 rounded"
        >
          <MdDelete />
        </button>
      </div>
      {field.type === "object" && (
        <div className="ml-8 mt-2">
          <button
            onClick={() => onAddNested(field.id)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <MdAdd /> Add nested field
          </button>
          {field.children && field.children.length > 0 && (
            <div className="mt-2">
              <NestedSchemaEditor
                schema={field.children}
                onSchemaChange={(newChildren) =>
                  onChange(field.id, {
                    children:
                      newChildren instanceof Function
                        ? newChildren(field.children || [])
                        : newChildren,
                  })
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const NestedSchemaEditor: React.FC<SchemaEditorProps> = ({
  schema,
  onSchemaChange,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      onSchemaChange((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={schema} strategy={verticalListSortingStrategy}>
        {schema.map((field, index) => (
          <SortableField
            key={field.id}
            field={field}
            index={index}
            onRemove={(id) =>
              onSchemaChange((prev) => prev.filter((field) => field.id !== id))
            }
            onChange={(id, changes) =>
              onSchemaChange((prev) =>
                prev.map((field) =>
                  field.id === id ? { ...field, ...changes } : field
                )
              )
            }
            onAddNested={(parentId) => {
              const newField: SchemaField = {
                id: uuidv4(),
                name: "",
                description: "",
                type: "string",
              };
              onSchemaChange((prev) =>
                prev.map((field) =>
                  field.id === parentId
                    ? {
                        ...field,
                        children: [...(field.children || []), newField],
                      }
                    : field
                )
              );
            }}
            dataTypes={[
              "string",
              "number",
              "boolean",
              "date",
              "object",
              "array",
            ]}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

const SchemaEditor: React.FC<SchemaEditorProps> = ({
  schema,
  onSchemaChange,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      onSchemaChange((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddField = () => {
    const newField: SchemaField = {
      id: uuidv4(),
      name: "",
      description: "",
      type: "string",
    };
    onSchemaChange([...schema, newField]);
  };

  return (
    <div className="w-full">
      {schema.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">
            Generate your own schema to match with your use cases
          </p>
          <button
            onClick={handleAddField}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <MdAdd /> Add Field
          </button>
        </div>
      ) : (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={schema}
              strategy={verticalListSortingStrategy}
            >
              {schema.map((field, index) => (
                <SortableField
                  key={field.id}
                  field={field}
                  index={index}
                  onRemove={(id) =>
                    onSchemaChange((prev) =>
                      prev.filter((field) => field.id !== id)
                    )
                  }
                  onChange={(id, changes) =>
                    onSchemaChange((prev) =>
                      prev.map((field) =>
                        field.id === id ? { ...field, ...changes } : field
                      )
                    )
                  }
                  onAddNested={(parentId) => {
                    const newField: SchemaField = {
                      id: uuidv4(),
                      name: "",
                      description: "",
                      type: "string",
                    };
                    onSchemaChange((prev) =>
                      prev.map((field) =>
                        field.id === parentId
                          ? {
                              ...field,
                              children: [...(field.children || []), newField],
                            }
                          : field
                      )
                    );
                  }}
                  dataTypes={[
                    "string",
                    "number",
                    "boolean",
                    "date",
                    "object",
                    "array",
                  ]}
                />
              ))}
            </SortableContext>
          </DndContext>
          <button
            onClick={handleAddField}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <MdAdd /> Add Field
          </button>
        </>
      )}
    </div>
  );
};

export default SchemaEditor;
