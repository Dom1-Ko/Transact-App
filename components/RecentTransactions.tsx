import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BankTabItem } from "./BankTabItem"
import BankInfo from "./BankInfo"
import TransactionsTable from "./TransactionsTable"

const RecentTransactions = ({ accounts, transactions= [], appwriteItemId, page = 1 }: RecentTransactionsProps) => {
// console.log({accounts, transactions, appwriteItemId})
    // const accountsData = accounts?.data;
  return (
    <section className="recent-transactions">
        <header className="flex items-center justify-between">
            <h2 className="recent-transactions-label">
                Recent Transactions
            </h2>
        
            <Link href={`/transaction-history/?id=${appwriteItemId}`} className="view-all-btn" >
                View All
            </Link>
        </header>
        <Tabs defaultValue={appwriteItemId} className="w-full">  
            <TabsList className="recent-transactions-tablist">
                    {accounts.map((account: Account) => (
                        <TabsTrigger key={account.id} value={account.appwriteItemId}>
                            <BankTabItem key={account.appwriteItemId} account={account} appwriteItemId={appwriteItemId}></BankTabItem>
                        </TabsTrigger>

                    ))}
            </TabsList>

            {accounts.map((account: Account) => (
               <TabsContent value={account.appwriteItemId} key={account.id} className="space-y-4">
                    <BankInfo
                        account = {account}
                        appwriteItemId={account.appwriteItemId}
                        type="full"
                    />
                    <TransactionsTable transactions={transactions} />
               </TabsContent>
            ))}
            
        </Tabs>
    </section>
  )
}

export default RecentTransactions

// shadcn: Tabs - A set of layered sections of content—known as tab panels—that are displayed one at a time.