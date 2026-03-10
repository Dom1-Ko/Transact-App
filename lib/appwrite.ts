"use server"; // implies file contain server actions

import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";

export async function createSessionClient() {
  //create a new appwrite client and setting its endpoint and project, ensuring correct appwrite session
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);
    //*we add the '!' at the end to let nextjs know that thta these are not undefined (since warning by underlining them)

  const session = (await cookies()).get("appwrite-session");
  
  // console.log("clientddddddd: ", session!.value)

  //chk session exists
  if (!session || !session.value) {
    throw new Error("No session");
  }

  //attach session to this client so everytime we want to use this session we use the getter method below
  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);  //how we use session when needed
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

    //since has access to key can do almost everything in this case to this project

  return {
    get account() {
      return new Account(client);
    },

    get database() {
        return new Databases(client); // from /node/appwrite 
    },

    get user() {
        return new Users(client);
    }
  };
}
