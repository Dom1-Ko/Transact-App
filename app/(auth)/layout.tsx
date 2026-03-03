// special layout for pages without a sidebar
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main> 
        {children}
    </main>
  );
}
