'use server';   //defining server saction in a file
//server used to do Mutations or modify Database or sometimes make a fetch(even server actions are post actions)  actions/


import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";

export const signIn = async ({ email, password }: signInProps) => {

    try { //since async
        
        //create user account
        const { account } = await createAdminClient();
        const response = await account.createEmailPasswordSession(email, password);

        return parseStringify(response);

    } catch (error) {
        console.log('Error: ', error);
    }
}

export const signUp = async (userData: SignUpParams) => {

    const { email, password, firstName, lastName } = userData; //using destructuring syntax to assign the data from userData to the variables; no need to do userData.password anymore 

    try { //since async

        // Create a user account
        const { account } = await createAdminClient();

        const newUserAccount = await account.create(
            ID.unique(),
            email,
            password,
            `${firstName} ${lastName}`
        );

        const session = await account.createEmailPasswordSession({
            email,
            password
        });

        (await cookies()).set("appwrite-session", session.secret, { //remember to use the name used in the appwrite setup
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(newUserAccount);  // in next we cannot parse large obj through server actions, we neeed to stringify it first
    } catch (error) {
        console.log('Error: ', error);
    }
}


export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    
    const user = await account.get();

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


