// "use client"
import Image from "next/image"
import Link from "next/link"
import BankCard from "./BankCard"
import { countTransactionCategories } from "@/lib/utils"
// import Category from "./Category"
// import { use } from "react"
// import PlaidLink from "./PlaidLink"

const RightSidebar = ({ user, transactions, banks }: RightSidebarProps) => {
    
    const categories: CategoryCount[] = countTransactionCategories(transactions);
    
    return (
        //since we are using right-sidebar cn, this sidebar is hidden on small devices or minimised screens. look for its properties in globals.css
        //profile-banner gives it a background which is within our icons/assests folder 
        <aside className="right-sidebar">
            <section className="flex flex-col pb-8">
                <div className="profile-banner"/>
                <div className="profile">
                    <div className="profile-img">
                        <span className="text-5xl font-bold text-blue-500">{user.firstName[0]}</span>
                    </div>
                    <div className="profile-details">
                        <h1 className="profile-name">{user.firstName} {user.lastName}</h1>
                        <p className="profile-email">{user.email}</p>
                    </div>
                </div>
            </section>

            <section className="banks">
            <div className="flex w-full justify-between">
                <h2 className="header-2">My Banks</h2>
                <Link href="/" className="flex gap-2">
                    <Image src="/icons/plus.svg" width={20} height={20} alt="plus sign" />
                    <h2 className="text-14 font-semibold text-gray-600">Add Bank</h2>
                </Link>
            </div>
            {
                //chk if we hanve any bank
                banks?.length > 0 
                //then render a div
                && (
                    <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
                        <div className="relative z-10">
                            {/* BANK CARD 1 */}
                            <BankCard key={banks[0].$id} account={banks[0]} userName={`${user.firstName} ${user.lastName}`} showBalance={false} />
                        </div>
                        {
                            //IF WE HAVE A 2nd CARD                
                            banks[1]
                            // then we display it to show multiple cards
                            && 
                            (
                                <div className="absolute right-0 top-8 z-0 w-[90%]">
                                    {/* BANK CARD 2 */}
                                    <BankCard key={banks[1].$id} account={banks[1]} userName={`${user.firstName} ${user.lastName}`} showBalance={false} />
                                </div>
                            )                                                                               
                        }
                    </div>
                )
            }       
            {/* <div className="mt-10 flex flex-1 flex-col gap-6">
                <h2 className="header-2">Top categories</h2>
                <div className="space-y-5">
                    {categories.map((category, index) => (
                        <Category key={category.name} category={category}/>
                    ))}
                </div>
            </div> */}
            </section>


        </aside>

    )    
}

export default RightSidebar

// pb-8: padding bottom of 8

// .right-sidebar {
//     @apply no-scrollbar hidden h-screen max-h-screen flex-col border-l border-gray-200 xl:flex w-[355px] xl:overflow-y-scroll !important;
// }
// no-scrollbar: Applies a custom style or plugin to hide the visual scrollbar while keeping the scroll functionality.
// hidden: Sets display: none by default so the sidebar is completely removed from the layout on small screens.
// h-screen: Sets the height to 100vh, making the sidebar exactly as tall as the browser window.
// max-h-screen: Limits the maximum height to 100vh to prevent the sidebar from expanding beyond the viewport.
// flex-col: Uses Flexbox to stack the internal sidebar elements vertically in a column.
// border-l: Adds a 1px border to the left side of the sidebar to create a visual divider.
// border-gray-200: Sets the color of that left border to a very light, subtle gray.
// xl:flex: Overrides hidden at the 1280px breakpoint to make the sidebar appear as a flex container.
// w-[355px]: Sets a fixed, specific width of exactly 355 pixels for the sidebar.
// xl:overflow-y-scroll: Forces a vertical scrollbar to be active on large screens so content can scroll independently.
// !important: Ensures all the above styles override any other conflicting CSS rules or library defaults.


