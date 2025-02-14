import ModuleSwitcher from "@/general-components/moduleSwitcher";
import { useEffect, useState } from "react";
import { usePlaygrounds } from "../hooks/usePlayground";
import DocUpload from "../module/docUpload";
import PreProcess from "../module/preProcess";
import DocSchema from "../module/docSchema";
import UserSchema from "../module/userSchema";
import { Button, Divider } from "@heroui/react";
import { AiFillSetting } from "react-icons/ai";

interface NewPlaygroundProps {
  onBack: () => void;
  onNext: () => void;
  pipelineType: string;
  playgroundName?: string;
}

const ModuleList = [
  {
    title: "Document loader",
    component: <DocUpload />,
  },
  {
    title: "Pre-process",
    component: <PreProcess />,
  },
  {
    title: "Document schema",
    component: <DocSchema />,
  },
  {
    title: "User schema",
    component: <UserSchema />,
  },
];

const NewPlayground = ({
  onBack,
  onNext,
  pipelineType,
  playgroundName,
}: NewPlaygroundProps) => {
  const { getPlaygroundByName, selectedPlayground } = usePlaygrounds();

  const [selectedModule, setSelectedModule] = useState<string>(
    ModuleList[0].title
  );

  useEffect(() => {
    if (playgroundName) {
      getPlaygroundByName(playgroundName);
    }
  }, [playgroundName]);

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-2">
          {ModuleList.map((module) => (
            <ModuleSwitcher
              key={module.title}
              isActive={selectedModule === module.title}
              title={module.title}
              setCurrentModule={setSelectedModule}
            />
          ))}
        </div>
        <Button
          variant="bordered"
          className="text-xs text-foreground-900 font-medium font-poppins rounded-lg h-8 px-3"
          startContent={<AiFillSetting />}
        >
          Settings
        </Button>
      </div>
      <div className="flex-grow">
        {
          ModuleList.find((module) => module.title === selectedModule)
            ?.component
        }
      </div>
      <div className="flex flex-row gap-2 w-full justify-end mb-4">
        <Button variant="bordered" onPress={onBack}>
          Back
        </Button>
        <Button
          variant="solid"
          className="bg-gradient-to-r from-[#49FFDB] to-[#00E5FF]"
          onPress={onNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default NewPlayground;
