import { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link'
import { useRouter } from 'next/navigation'
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions'
import Image from 'next/image'

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter();

  // useState: manages internal component memory/state. uded in form inputs, toffles, counters ...
  // returns state variable a setter fn
  // updates immediately. triggers a re-render
  // has no dependency
  const [token, setToken] = useState('');

  // useEffect; used in operations (external interactions) that cannot occur in renderig process
  // can used for data fetching. , Dom manipulations, external subscriptions
  // runs after render, returns nothing and controlled by dependency array
  useEffect(() => { //in react we cannot make this async
    const getLinkToken = async () => {  //hence we create an internal fn
        const data = await createLinkToken(user); //fetch data
        
        setToken(data?.linkToken);
    }

    getLinkToken();
  }, [user]);  // this dependency array controls when fn should re-run, here when user changes, empty depencency array means will run only once

  // call callback as hook and then within we declare sync fn (it can be unnamed)
  // 2nd param is when it should get re-called, when there is a user changes
  // we use <PlaidLInkOnSuccess> here because next js complaining since type of call back is not specified
  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
    await exchangePublicToken({publicToken: public_token, user})

    router.push('/');
  }, [user])
  
  const config: PlaidLinkOptions = {
    token,
    onSuccess
  }

  const { open, ready } = usePlaidLink(config);

  return (
    <>
        {variant === 'primary' ? (
            <Button onClick={() => open()} disabled={!ready} className='plaidlink-primary'>Connect Bank</Button>
        ): variant === 'ghost' ? (
            <Button onClick={() => open()} variant="ghost" className="plaidlink-ghost">
                <Image 
                    src="/icons/connect-bank.svg"
                    alt="connect bank"
                    width={24}
                    height={24}
                />
                <p className='hidden text-[16px] font-semibold text-black-2 xl:block'>Connect bank</p>
            </Button>
        ): ( 
            <Button onClick={() => open()} className="plaidlink-default">
                <Image 
                    src="/icons/connect-bank.svg"
                    alt="connect bank"
                    width={24}
                    height={24}
                />
                <p className='text-[16px] font-semibold text-black-2'>Connect bank</p>
            </Button>
        )}
    </>
  )
}

export default PlaidLink