//special layout that includes a sidebar - that will be used for main components such as home dashboard transactions 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
        SIDEBAR 
        {children}
    </main>
  );
}
