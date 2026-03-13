import BankCard from "@/components/BankCard";
import HeaderBox from "@/components/HeaderBox"
// import PlaidLink from "@/components/PlaidLink";
import { getAccounts } from "@/lib/actions/banks.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";

const MyBanks = async () => {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn.$id });

  return (
    <section className="flex">
      <div className="my-banks">
        <HeaderBox
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activities"
        />
        <div className="space-y-4">
          <h2 className="header-2">
            Your cards
          </h2>
        </div>
        <div className="flex flex-wrap gap-6">
            {accounts && accounts.data.map((a:Account) => (
              <BankCard
                key={a.id}
                account={a}
                userName={loggedIn?.firstName}
              />
            ))}
        </div>
      </div>
      {/* <PlaidLink user={loggedIn.$id} />  */}

    </section>
  )
}

export default MyBanks