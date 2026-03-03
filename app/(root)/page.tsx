import HeaderBox from '@/components/HeaderBox';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import React from 'react';

const Home = () => {
    const loggedIn = {firstName: 'Dom', lastName: 'ko', email: "dk@vscode.com"};
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
                       accounts={[]}
                       totalBanks={1}
                       totalCurrentBalance={1250.35}
                    />

                </header>
                RECENT TRANSACTIONS

            </div>
            <RightSidebar user={loggedIn} transactions={[]} banks={[{ currentBalance: 123 }, { currentBalance: 53425.22 }, { currentBalance: 546.34 }]}/>
        </section>
    )
}

export default Home