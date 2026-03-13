"use client";

import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils";
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation";
import Footer from "./Footer";
import PlaidLink from "./PlaidLink";

const Sidebar = ({ user, banks }: SiderbarProps) => {
    // console.log(banks)
    const pathname =  usePathname();     //nextjs hook used to grab current url

    return (
        // Link : standard <a href="...">, the entire browser tab refreshes. With <Link>, Next.js only swaps the content that changes while sidebar rem same
        // since we are using sidebar as classname burger icon is hidden when max size. look at properties of sidebar in global.css
        <section className="sidebar">
            <nav className="flex flex-col gap-4">
                <Link href="/" className="mb-12 cursor-pointer flex items-center gap-2">
                    <Image
                        src="/icons/logo.svg" 
                        alt="Transact Logo"
                        width={34} 
                        height={34} 
                        className="size-[34px] max-xl:size-14s"
                    />
                    <h1 className="sidebar-logo">Transact</h1>
                </Link>

                {sidebarLinks.map((item) => {
                    //sidebarLinks: array containing metadata of links in sidebar e.g url img etc..
                    //.map: loops through an array and transform each item into something else

                    //chks browser's url ===  current link's route
                    //starts with is used cuz sub pages such as /transactions/123   
                    const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)
                    
                    return(

                        // cn: classnamehelper fn, allows to apply classes conditionally
                        // bg-bank-gradient: gets specific background gradient if the current sidebar link is active
                        // fill: make icon fill parent div
                        // brightness[3] invert 0: filters used to change icon color (meke it white and me it more shiny) if link active
                        // !text white: ! overries any deffault styles and force to become white when is active
                        <Link href={`${item.route}?shareableId=${banks.documents[0].shareableId}`} key={item.label} className={cn('sidebar-link', { 'bg-bank-gradient':isActive})} >
                            <div className="relative size-6">
                                <Image src={item.imgURL} alt={item.label} fill className={cn({'brightness-[3] invert-0':isActive})}/>
                            </div>
                            <p className={cn("sidebar-label", { "!text-white": isActive })}> 
                                {item.label}
                            </p>
                        </Link>
                    )
                
                })}

                <PlaidLink user={user} />
            </nav>

            <Footer user={user} type="desktop" />
        </section>
    )
}

export default Sidebar

// mb-12 - margin bottom to 48px
// cursor-pointer: sets mouse cursor to a hand poionter to indicate its clickable
// className="size-[34px] max-xl:size-14s" - sets default size to 34px and changes it to 56px on screens larger than 1280px
