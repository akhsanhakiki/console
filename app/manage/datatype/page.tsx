import React from "react";
import DocTypes from "./components/docTypes";

export default function DocTypePages() {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <h1 className="text-xl font-semibold font-poppins text-foreground-900">
        Document Type
      </h1>
      {/*DocTypes*/}
      <DocTypes />
    </div>
  );
}
