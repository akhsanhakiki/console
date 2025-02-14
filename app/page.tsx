"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

// Default loading component
const LoadingComponent = () => (
  <div className="flex items-center justify-center w-full h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

// Dynamic imports with preload false
const moduleComponents = {
  "/": dynamic(() => import("./dashboard/page"), {
    loading: LoadingComponent,
    ssr: false,
  }),
  "/dashboard": dynamic(() => import("./dashboard/page"), {
    loading: LoadingComponent,
    ssr: false,
  }),
  "/extract": dynamic(() => import("./playground/page"), {
    loading: LoadingComponent,
    ssr: false,
  }),
  "/manage/schema": dynamic(() => import("./manage/schema/page"), {
    loading: LoadingComponent,
    ssr: false,
  }),
  "/manage/pipeline": dynamic(() => import("./manage/pipeline/page"), {
    loading: LoadingComponent,
    ssr: false,
  }),
  "/manage/datatype": dynamic(() => import("./manage/datatype/page"), {
    loading: LoadingComponent,
    ssr: false,
  }),
  "/composer": dynamic(() => import("./composer/page"), {
    loading: LoadingComponent,
    ssr: false,
  }),
  "/integration": dynamic(() => import("./integration/page"), {
    loading: LoadingComponent,
    ssr: false,
  }),
  "/settings": dynamic(() => import("./settings/page"), {
    loading: LoadingComponent,
    ssr: false,
  }),
  "/documentation": dynamic(() => import("./documentation/page"), {
    loading: LoadingComponent,
    ssr: false,
  }),
  "/changeLog": dynamic(() => import("./changeLog/page"), {
    loading: LoadingComponent,
    ssr: false,
  }),
  "/helpnSupport": dynamic(() => import("./helpnSupport/page"), {
    loading: LoadingComponent,
    ssr: false,
  }),
};

export default function Home() {
  const pathname = usePathname();

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
