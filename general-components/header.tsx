import { Avatar } from "@heroui/avatar";
import EzdocsLogo from "@/public/images/general/ezdocsLogo";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import WorkspaceMng from "./workspaceMng";
export const HeaderBar = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background font-poppins">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-6">
        <div className="w-1/5">
          <EzdocsLogo />
        </div>
        <div className="flex justify-center w-3/5 ">
          <WorkspaceMng />
        </div>

        <div className="flex items-center justify-end w-1/5">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};
