"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";

// Default loading component
const LoadingComponent = () => (
  <div className="flex items-center justify-center w-full h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

// Dynamic imports with preload false
const moduleComponents = {
  "/": dynamic(
    () =>
      import("./dashboard/page").then((mod) => {
        // Cache the module in session storage
        if (typeof window !== "undefined") {
          sessionStorage.setItem("module_/", JSON.stringify(mod));
        }
        return mod;
      }),
    {
      loading: LoadingComponent,
      ssr: true,
    }
  ),
  "/dashboard": dynamic(
    () =>
      import("./dashboard/page").then((mod) => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("module_dashboard", JSON.stringify(mod));
        }
        return mod;
      }),
    {
      loading: LoadingComponent,
      ssr: true,
    }
  ),
  "/extract": dynamic(
    () =>
      import("./playground/page").then((mod) => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("module_extract", JSON.stringify(mod));
        }
        return mod;
      }),
    {
      loading: LoadingComponent,
      ssr: true,
    }
  ),
  "/manage/schema": dynamic(
    () =>
      import("./manage/schema/page").then((mod) => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("module_manage_schema", JSON.stringify(mod));
        }
        return mod;
      }),
    {
      loading: LoadingComponent,
      ssr: true,
    }
  ),
  "/manage/pipeline": dynamic(
    () =>
      import("./manage/pipeline/page").then((mod) => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("module_manage_pipeline", JSON.stringify(mod));
        }
        return mod;
      }),
    {
      loading: LoadingComponent,
      ssr: true,
    }
  ),
  "/manage/doctype": dynamic(
    () =>
      import("./manage/doctype/page").then((mod) => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("module_manage_doctype", JSON.stringify(mod));
        }
        return mod;
      }),
    {
      loading: LoadingComponent,
      ssr: true,
    }
  ),
  "/composer": dynamic(
    () =>
      import("./composer/page").then((mod) => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("module_composer", JSON.stringify(mod));
        }
        return mod;
      }),
    {
      loading: LoadingComponent,
      ssr: true,
    }
  ),
  "/integration": dynamic(
    () =>
      import("./integration/page").then((mod) => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("module_integration", JSON.stringify(mod));
        }
        return mod;
      }),
    {
      loading: LoadingComponent,
      ssr: true,
    }
  ),
  "/settings": dynamic(
    () =>
      import("./settings/page").then((mod) => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("module_settings", JSON.stringify(mod));
        }
        return mod;
      }),
    {
      loading: LoadingComponent,
      ssr: true,
    }
  ),
  "/documentation": dynamic(
    () =>
      import("./documentation/page").then((mod) => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("module_documentation", JSON.stringify(mod));
        }
        return mod;
      }),
    {
      loading: LoadingComponent,
      ssr: true,
    }
  ),
  "/changeLog": dynamic(
    () =>
      import("./changeLog/page").then((mod) => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("module_changelog", JSON.stringify(mod));
        }
        return mod;
      }),
    {
      loading: LoadingComponent,
      ssr: true,
    }
  ),
  "/helpnSupport": dynamic(
    () =>
      import("./helpnSupport/page").then((mod) => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("module_help_support", JSON.stringify(mod));
        }
        return mod;
      }),
    {
      loading: LoadingComponent,
      ssr: true,
    }
  ),
};

export default function Home() {
  const pathname = usePathname();

  useEffect(() => {
    // Try to load from session storage first
    if (typeof window !== "undefined") {
      const cachedModule = sessionStorage.getItem(
        `module_${pathname.replace(/\//g, "_")}`
      );
      if (cachedModule) {
        // Use the cached module if available
        return JSON.parse(cachedModule);
      }
    }
  }, [pathname]);

  // Get the component for the current path or default to dashboard for root path
  const PageComponent =
    moduleComponents[pathname as keyof typeof moduleComponents] ||
    moduleComponents["/"];

  return (
    <div className="flex w-full h-full p-6">
      <Suspense fallback={<LoadingComponent />}>
        {PageComponent ? (
          <PageComponent />
        ) : (
          <div className="text-center text-gray-500">
            <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
            <p>The requested page could not be found.</p>
          </div>
        )}
      </Suspense>
    </div>
  );
}
