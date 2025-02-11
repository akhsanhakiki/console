import { Providers } from "../providers";
import { HeroUIClientProvider } from "../providers/hero-ui-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HeroUIClientProvider>
      <Providers
        themeProps={{ attribute: "class", defaultTheme: "systemDefault" }}
      >
        <div className="relative flex flex-col h-screen">
          <main className="w-full">{children}</main>
        </div>
      </Providers>
    </HeroUIClientProvider>
  );
}
