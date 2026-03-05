import Image from "next/image";

// special layout for pages without a sidebar
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     
    <main className="flex min-h-screen w-full justify font-inter">
        {children}
        <div className="auth-asset">
          <Image src="/icons/auth-image.svg" alt="Auth Image" width={500} height={500} />
        </div>
    </main>
  );
}
