import DashboardContent from "./components/DashboardContent";
import DashboardTabs from "./components/DashboardTabs";

export default async function Dashboard() {
  return (
    <div className="w-full flex flex-col gap-4 h-full">
      <div className="flex flex-row justify-between">
        <h1 className="text-xl font-semibold font-poppins text-foreground-900">
          Dashboard
        </h1>
        <DashboardTabs />
      </div>
      <DashboardContent />
    </div>
  );
}
