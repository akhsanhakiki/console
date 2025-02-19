"use client";
import { useSearchParams } from "next/navigation";
import NewPlayground from "../components/playground";
import { IoArrowBack } from "react-icons/io5";
import ChevronDown from "@/public/images/icons/chevronDown";
import { useRouter } from "next/navigation";

export default function NewPlaygroundPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type");

  const handleBack = () => {
    router.push("/playground");
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center">
        <div className="cursor-pointer" onClick={handleBack}>
          <h1 className="text-xl font-semibold font-poppins text-foreground-900">
            Playground
          </h1>
        </div>
        <ChevronDown className="-rotate-90" />
        <h2 className="text-sm font-medium font-poppins text-foreground-900">
          {type}
        </h2>
      </div>
      <NewPlayground
        onBack={handleBack}
        onNext={() => {}}
        pipelineType={type || ""}
      />
    </div>
  );
}
