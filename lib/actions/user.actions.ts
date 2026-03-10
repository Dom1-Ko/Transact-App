'use server';   //defining server saction in a file
//server used to do Mutations or modify Database or sometimes make a fetch(even server actions are post actions)  actions/


import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from "../plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";


//destructuring environment variables - instead of saying process.env everytime
const {
    // renaming them to make them shorter
    APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID, 
    APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,

} = process.env;

export const getUserInfo = async ({ userId  }: getUserInfoProps) => {
    try{
        const { database } = await createAdminClient();

        const user = await database.listDocuments(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            [Query.equal('userId', [userId])]
        )

         return parseStringify(user.documents[0]); 

    } catch (error) {
        console.log(error)
    }
}

export const signIn = async ({ email, password }: signInProps) => {

    try { //since async
        
        //create user account
        const { account } = await createAdminClient();

        //set session cookie or else it will imdiately log us out
        const session = await account.createEmailPasswordSession({
            email,
            password
        });

        (await cookies()).set("appwrite-session", session.secret, { //use the name used in the appwrite setup in .env
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        const user = await getUserInfo({ userId: session.userId });

        return parseStringify(user);

    } catch (error) {
        console.log('Error: ', error);
    }
}

//we extractiing password seperately during initial values destructuring cuz we do not want to send password everywhere
export const signUp = async ({ password, ...userData }: SignUpParams) => {

    const { email, firstName, lastName } = userData; //using destructuring syntax to assign the data from userData to the variables; no need to do userData.password anymore 

    let newUserAccount;

    try { //since async, may lead to errors

        // Create a user account
        const { account, database } = await createAdminClient();

        newUserAccount = await account.create(
            ID.unique(),
            email,
            password,
            `${firstName} ${lastName}`
        );

        if (!newUserAccount) throw new Error('Error creating user')

            
        const dwollaCustomerUrl = await createDwollaCustomer({
            ...userData,    // spreading userData
            type: 'personal'
        });

        if (!dwollaCustomerUrl) throw new Error('Error creating dwolla customer');
        
        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl)
         
        const newUser = await database.createDocument(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            ID.unique(),
            {
                ...userData, //spreading userData
                userId: newUserAccount.$id,
                dwollaCustomerId,
                dwollaCustomerUrl,
            }
        );

        const session = await account.createEmailPasswordSession({
            email,
            password
        });

        (await cookies()).set("appwrite-session", session.secret, { //use the name used in the appwrite setup in .env
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });
  
        //we do not return the newUserAccount from cookie but rather the newUser directly from database
        return parseStringify(newUser);  // in next we cannot parse large obj through server actions, we neeed to stringify it first
    } catch (error) {
        console.log('Error: ', error);
    }
}


export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    
    const result = await account.get();  //get user form session

    const user = await getUserInfo({ userId: result.$id })  // get database user 

    return parseStringify(user);

  } catch (error) {
     
    return null;

  }
}


export const logoutAccount = async () => {
    try {
        const { account } = await createSessionClient();
        
        (await cookies()).delete('appwrite-session');

        await account.deleteSession('current');       

    } catch {
        return null;
    }
}

export const createLinkToken = async (user: User) => {
   try {
    const tokenParams = {
        user: {
            client_user_id: user.$id
        },
        client_name: `${user.firstName} ${user.lastName}`,
        products: ['auth', 'transactions'] as Products[],
        country_codes: ['US'] as CountryCode[],
        language: 'en',
    }

    // console.log('token params: ', tokenParams);

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({linkToken: response.data.link_token})

   } catch (error) {
        console.log(error);
   } 
}

export const createBankAccount = async ({
    userId,
    bankId,
    accountId,
    accessToken,
    fundingSourceUrl,
    shareableId,
}: createBankAccountProps) => {
    try {
        // creating a bank account as a document whithin our DB (appwrite)
        const { database } = await createAdminClient();

        const bankAccount = await database.createDocument(
            DATABASE_ID!, //the '!' is to tell it that it definitely exists that it wont be undefined
            BANK_COLLECTION_ID!,
            ID.unique(),
            {
              userId,
              bankId,
              accountId,
              accessToken,
              fundingSourceUrl,
              shareableId,   
            }
        );

        return parseStringify(bankAccount);
    } catch (error) {
    
    }
}


// exchanges existing access token to do banking stuffs; connecting bank account, making payment, payment processor
// handshake to prove legit actor asking for data/information
export const exchangePublicToken = async({ publicToken, user, }: exchangePublicTokenProps) => {
    try {
        // exchange public token for access token using plaid lib fn and iten ID
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        })

        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;

        // get account info from plaid using access token
        const accountsResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        });

        const accountData = accountsResponse.data.accounts[0];

        //create a processor token for Dwolla using access token and account ID
        const request: ProcessorTokenCreateRequest = {
            access_token: accessToken,
            account_id: accountData.account_id,
            processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
        };

        const processorTokenResponse = await plaidClient.processorTokenCreate(request);
        const processorToken = processorTokenResponse.data.processor_token;

        //create a funding source url for account using the Dwolla customer ID, processor token and bank name
        const fundingSourceUrl = await addFundingSource({
            dwollaCustomerId: user.dwollaCustomerId,
            processorToken,
            bankName: accountData.name,
        });

        // chk if funding source URL exist, else throw an error
        if (!fundingSourceUrl) throw Error;

        // Create bank account
        await createBankAccount({
            userId: user.$id,
            bankId: itemId,
            accountId: accountData.account_id,
            accessToken,
            fundingSourceUrl,
            shareableId: encryptId(accountData.account_id), //encryotId fn is form utils
        });

        //revalidate path to reflect changes
        revalidatePath("/"); //will allow us to see the new account created
        
        // return success message
        return parseStringify({
            publicTokenChange: "complete",
        });
    } catch (error) {
        console.log("An error occuredwhile creating exchanging token", error)
    }

// changes public token for access token and userId
// allowing us to create a bank account
// get account data 
// connect payment processor called Dwolla to allow money tranfer b/w accounts

}

export const getBanks = async ({ userId }: getBanksProps) => {
    /// database query in appwrite
    try {
        const  { database } = await createAdminClient();

        //list all doc from db w/ DATABASE_ID, WITH BANK_COLLECTION_ID  WHERE 'userId' belongs to userId arrray
        const banks = await database.listDocuments(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            [Query.equal('userId', [userId])]
        ); 

        return parseStringify(banks); 

    } catch (error) {
        console.log(error)
    }
}

export const getBank = async ({ documentId }: getBankProps) => {
    
    try{
        const { database } = await createAdminClient();

        const bank = await database.listDocuments(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            [Query.equal('$id', [documentId])]
        )

        return parseStringify(bank); 

    } catch (error) {
        console.log(error)
    }
     

}

export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
    
    try{
        const { database } = await createAdminClient();

        const bank = await database.listDocuments(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            [Query.equal('accountId', [accountId])]
        )

        if (bank.total !== 1) return null;

        return parseStringify(bank); 

    } catch (error) {
        console.log(error)
    }
     

}

