import ChangelogContent from "./components/changelogContent";

const ChangeLog = () => {
  return (
    <div className="w-full flex flex-col gap-4 h-[calc(100vh-6rem)]">
      <h1 className="text-xl font-semibold font-poppins text-foreground-900">
        Change Log
      </h1>
      <div className="w-full flex flex-col gap-4 h-full">
        <ChangelogContent />
      </div>
    </div>
  );
};

export default ChangeLog;
