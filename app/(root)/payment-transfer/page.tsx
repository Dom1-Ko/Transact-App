import HeaderBox from '@/components/HeaderBox'
import PaymentTransferForm from '@/components/PaymentTransferForm'
import { getAccounts } from '@/lib/actions/banks.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react'

const Transfer = async () => {
  const loggedIn = await getLoggedInUser();

  const accounts = await getAccounts({ userId: loggedIn.$id });

  if (!accounts) return;

  const accountsData = accounts?.data;
      
  return (
    <section className='payment-transfer'>
      <HeaderBox
        title="Payment Transfer"
        subtext="Please provide any specific details or notes related to the payment transfer."
      />
      <section className='size-full pt-5'>
        <PaymentTransferForm  accounts={accountsData} />
      </section>
    </section>
  )
}

export default Transfer

//the form is not included here cuz this page will no longer be a server side component, form requires interactivity it needs to be client side(back and forth)