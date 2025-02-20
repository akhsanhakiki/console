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
      className="bg-content1 rounded-lg p-4 mb-2 shadow-sm border border-default-200"
    >
      <div className="flex items-center gap-3">
        <div {...attributes} {...listeners} className="cursor-move">
          <MdDragIndicator className="text-default-400 w-5 h-5" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Field name"
              value={field.name}
              onChange={(e) => onChange(field.id, { name: e.target.value })}
              className="flex-1 px-3 py-1.5 bg-default-100 border-default-200 rounded-lg text-default-700 placeholder:text-default-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <select
              value={field.type}
              onChange={(e) =>
                onChange(field.id, { type: e.target.value as SchemaDataType })
              }
              className="px-3 py-1.5 bg-default-100 border border-default-200 rounded-lg text-default-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
            className="w-full px-3 py-1.5 bg-default-100 border border-default-200 rounded-lg text-default-700 placeholder:text-default-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <button
          onClick={() => onRemove(field.id)}
          className="p-2 text-danger hover:bg-danger-50 rounded-lg transition-colors"
        >
          <MdDelete className="w-5 h-5" />
        </button>
      </div>
      {field.type === "object" && (
        <div className="ml-8 mt-3">
          <button
            onClick={() => onAddNested(field.id)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-primary hover:bg-primary-50 rounded-lg transition-colors"
          >
            <MdAdd className="w-4 h-4" /> Add nested field
          </button>
          {field.children && field.children.length > 0 && (
            <div className="mt-3">
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
        <div className="text-center py-8 bg-default-50 rounded-xl border-2 border-dashed border-default-200">
          <p className="text-default-500 mb-4">
            Generate your own schema to match with your use cases
          </p>
          <button
            onClick={handleAddField}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors mx-auto"
          >
            <MdAdd className="w-5 h-5" /> Add Field
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
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <MdAdd className="w-5 h-5" /> Add Field
          </button>
        </>
      )}
    </div>
  );
};

export default SchemaEditor;
