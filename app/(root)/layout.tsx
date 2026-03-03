import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

//special layout that includes a sidebar - that will be used for main components such as home dashboard transactions 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const loggedIn = { firstName: "Dom", LastName: "Ko" }

  return (
    <main className="flex h-screen w-full font-inter">
        <Sidebar user={loggedIn} /> 

        <div className="flex size-full flex-col">
          <div className="root-layout">
            <Image src="/icons/logo.svg" width={30} height={30} alt="menu icon" />
            <div>
              <MobileNav user={loggedIn} />
            </div>
          </div>
          {children}
        </div>
    </main>
  );
}


//h-screen: 100% of viewpoint height, i.e fil entire vertical space of browser
//w-full: 100% of parent's element, makes element span entire horicontal width of the viewpoint
//font-inter: highly legible font 