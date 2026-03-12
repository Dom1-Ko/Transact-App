import HeaderBox from '@/components/HeaderBox';
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getAccount, getAccounts } from '@/lib/actions/banks.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';

// const { database } = await createAdminClient();


// const bank = await database.listDocuments(
//     DATABASE_ID!,
//     BANK_COLLECTION_ID!,
//     [Query.equal('$id', [documentId])]
// )


const Home = async ( { searchParams }: SearchParamProps) => {       //in next we have access to searchParams, we can destructure id, page and give it a type

    // Await the searchParams promise first
    const { id, page } = await searchParams;
    const currentPage = Number (page as string) || 1;  // default valu     // searchParams id may sound like it is a number, but always convert, is usually a string

    const loggedIn = await getLoggedInUser();

    const accounts = await getAccounts({ userId: loggedIn.$id });

    if (!accounts) return;

    const accountsData = accounts?.data;

    const appwriteItemId =  id || accountsData[0].appwriteItemId;

    // console.log("appwrtId: ", appwriteItemId )

    const account = await getAccount({ appwriteItemId });
    
    // console.log({accounts, account, appwriteItemId, id});
    
    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox 
                        type="greeting"
                        title="Welcome"
                        user={loggedIn?.firstName || 'Guest'}
                        subtext="Manage your accounts and transactions efficiently."
                    />

                    <TotalBalanceBox
                       accounts={accountsData}
                       totalBanks={accounts?.totalBanks}
                       totalCurrentBalance={accounts?.totalCurrentBalance}
                    />

                </header>
                <RecentTransactions accounts={accountsData} transactions={account?.transactions} appwriteItemId={appwriteItemId} page={currentPage} />

            </div>
            <RightSidebar user={loggedIn} transactions={accounts?.transactions} banks={accountsData?.slice(0,2)}/>
        </section>
    )
}

export default Home