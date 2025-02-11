import React from "react";

interface ActiveTabs {
  setActiveTab: (tab: string) => void;
}

const UserManagement = ({ setActiveTab }: ActiveTabs) => {
  return (
    <div className="w-full h-full flex flex-col gap-4">User Management</div>
  );
};

export default UserManagement;
