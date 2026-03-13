// "use client"
import HeaderBox from '@/components/HeaderBox';
import PlaidLink from '@/components/PlaidLink';
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getAccount, getAccounts } from '@/lib/actions/banks.actions';
import { getBankByAccountId, getLoggedInUser } from '@/lib/actions/user.actions';
import { decryptId } from '@/lib/utils';

// const { database } = await createAdminClient();


// const bank = await database.listDocuments(
//     DATABASE_ID!,
//     BANK_COLLECTION_ID!,
//     [Query.equal('$id', [documentId])]
// )


const Home = async ( { searchParams }: SearchParamProps) => {       //in next we have access to searchParams, we can destructure id, page and give it a type

    // Await the searchParams promise first
    const { shareableId, page } = await searchParams;
    const currentPage = Number (page as string) || 1;  // default valu     // searchParams id may sound like it is a number, but always convert, is usually a string

    const loggedIn = await getLoggedInUser();

    const accounts = await getAccounts({ userId: loggedIn.$id });

    if (!accounts) return;

    const accountsData = accounts?.data;

    let id = "";

    if(shareableId){
        const accountId = decryptId(shareableId as string);
        const bank = await getBankByAccountId({ accountId });
        // console.log(bank)

        id = bank.documents[0].$id;
    }

    const appwriteItemId =  id || accountsData[0].appwriteItemId;

    // const shareableId = accountsData[0].shareableId;

    // console.log("appwrtId: ", appwriteItemId )

    const account = await getAccount({ appwriteItemId });
    
    // console.log({accounts, account, appwriteItemId, id});
    // console.log('acctr: ',account.transactions);

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
                
                <div className='xl:hidden'>
                    <PlaidLink user={loggedIn} variant="home"/>
                </div>

                <RecentTransactions accounts={accountsData} transactions={account?.transactions} appwriteItemId={appwriteItemId} page={currentPage} />

            </div>
            <RightSidebar user={loggedIn} transactions={account?.transactions} banks={accountsData?.slice(0,2)}/>
        </section>
    )
}

export default Home