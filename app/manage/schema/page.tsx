import React from "react";
import Schemas from "./components/schemas";

export default function SchemaPage() {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <h1 className="text-xl font-semibold font-poppins text-foreground-900">
        Schema
      </h1>
      {/*Schemas*/}
      <Schemas />
    </div>
  );
}
