"use client";

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { formatError, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription, 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import FormInputField from "./FormInputField";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getLoggedInUser, signIn, signUp } from "@/lib/actions/user.actions";

// form are "use client" cuz of keyboard and mouse events
// hence pgs that use the form are server side
// actual AuthForm component is client side

//**  moved to /lib/utils
// Schema normal implementation
// // .min(2) .max(50) .string() are validations. just put a '.' u will get suggestions
// const formSchema =  z.object({
//     // username: z.string().min(2, {message: "Username must have least 2 characters"}),
//     email: z.string().email(),
// })

const AuthForm = ({ type }: { type: string }) => {
    const router = useRouter(); 
    
    const [user, setUser] = useState(undefined) 

    const [isLoading, setisLoading] = useState(false)

    // had to genrate a zod scheme using tyoe in this case
    // because app tries to submit the sign-up form data when user tries to sign-in 
    const formSchema =  authFormSchema(type);

    // Create a function to log errors, not compulsory, we did ithere for debugging purposes
    const onValidationError = (errors: any) => {
        console.log("Validation Errors:", errors);
    };

    //***/ // define form - allows that exactly which field form contains using the form schema 
    // NORMAL IMPLEMENTATION - would have had to do formSchema 3 times 
    // const form = useForm<z.infer<typeof formSchema>>({
    //     resolver: zodResolver(formSchema),
    //     defaultValues: {
    //         email: "",
    //     },
    // })

    // USING THE AUTHFORMSCHEMA IN /LIB/UTILS through formSchema
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            // username: "",
            // email: "",
            // password: "",
            // firstName: "", 
            // lastName: "",
            // address1: "",
            // state: "",
            // postalCode: "",
            // dateOfBirth: "",
            // ssn: "",
        },
    })

    // //** defining a submit handler
    // NORMAL IMPLEMENTATION
    // function onSubmit(values: z.infer<typeof formSchema>) {
    //     // Do something with the form values.
    //     // this will be type safe and validated
    //     console.log(values)
    // }

    // USING THE AUTHFORMSCHEMA IN /LIB/UTILS
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        
        setisLoading(true);

        try {
            //sign up with appwrite & create plaid token
            if (type === "sign-up"){
                const newUser = await signUp(data);   // if nextjs complains about data, need to change the attributes to optional by adding '?' like in SignUpParams in index.d.ts (even though we know they are needed for the and zod validations protects us)

                setUser(newUser);
            }    

            if (type === "sign-in") {
                const response = await signIn({
                    email: data.email,
                    password: data.password,
                });

                if (response) {       ///if we get a response forward to home page using router from next/navigation
                    router.push('/');
                }
            }
            
        } catch (error) {
            console.log(error);
        } finally {
            //this clause allows to turn off loading 
            setisLoading(false);
        }
    }



    return (
    <section className="auth-form">
        <header className="flex flex-col gap-5 md:gap-8">
         <Link href="/" className="cursor-pointer flex items-center gap-1">
            <Image
                src="/icons/logo.svg" 
                alt="Transact Logo"
                width={34} 
                height={34}           
            />
            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">Transact</h1>
          </Link>

          <div className="flex fles-col gap-1 md:gap-3">
            <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
                { user
                    ? 'Link Account'
                    : type === 'sign-in'
                        ? 'Sign-In'
                        : 'Sign-Up'
                }
                <p className="text-16 font-normal text-gray-600">
                    { user
                        ? 'Link your account to get started'
                        : 'Please enter your details'   
                    }
                </p>
            </h1>
          </div>
        </header>
        { user ? ( 
            <div className="flex flex-col gap-4">
                {/* PLAIDLINK*/}
            </div>
        ):(
            <>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onValidationError)} className="space-y-8">
                        
                        {type === "sign-up" && (
                            <>
                                <div className="flex gap-12">
                                    <FormInputField control={form.control} name={"firstName"} label={"First Name"} placeholder={"Enter your first name"}/>
                                    <FormInputField control={form.control} name={"lastName"} label={"Last Name"} placeholder={"Enter your Last name"}/>
                                </div>
                                <div className="flex gap-12">
                                    <FormInputField control={form.control} name={"address1"} label={"Address"} placeholder={"Enter your specific address"}/>
                                    <FormInputField control={form.control} name={"city"} label={"City"} placeholder={"Enter your city"}/>
                                </div>
                                <div className="flex gap-12">                                
                                    <FormInputField control={form.control} name={"state"} label={"State"} placeholder={"Example: NY"}/>
                                    <FormInputField control={form.control} name={"postalCode"} label={"Postal Code"} placeholder={"Example: 33101"}/>
                                </div>
                                <div className="flex gap-12">
                                    <FormInputField control={form.control} name={"dateOfBirth"} label={"Date Of Birth"} placeholder={"YYYY-DD-MM"}/>
                                    <FormInputField control={form.control} name={"ssn"} label={"SSN"} placeholder={"1234"}/>
                                </div>
                            </>
                        )}

                        {/* //NORMAL IMPLEMENTATION EXAMPLE 
                        <FormField
                            control={form.control} // Passed explicitly, or consumed implicitly by FormField
                            name="email"
                            render={({ field }) => (
                                <div className="form-item">
                                    <FormLabel className="form-label">
                                        Email
                                    </FormLabel>
                                    <div className="flex w-full flex-col">
                                        <FormControl>
                                            <Input placeholder="Enter your email" className="input-class" {...field} />
                                        </FormControl>
                                        <FormMessage className="form-message mt-2" />
                                    </div>
                                </div>
                            )}
                        />                         */}

                        
                        <FormInputField control={form.control} name={"email"} label={"Email"} placeholder={"Enter your email"}/>
                        <FormInputField control={form.control} name={"password"} label={"Password"} placeholder={"Enter a password"}/>
                        <div className="flex flex-col gap-4">
                            <Button type="submit" disabled={isLoading} className="form-btn">
                                {isLoading ? (
                                <>
                                   <Loader2 size={20} className="animate-spin" />&nbsp;Loading...
                                </> 
                                ) : type === 'sign-in'
                                    ? 'Sign In' : 'Sign-Up'}
                            </Button>
                        </div>
                    </form>
                </Form>

                <footer className="flex justify-center gap-1">
                   <p className="text-14 font-normal text-gray-600">
                        {type === "sign-in"
                        ? "Don't have an account?"
                        : "Already have an account?"}                        
                   </p>
                   <Link href= {type === "sign-in" ? "/sign-up" : "/sign-in"} className="form-link">
                       {type === "sign-in" ? "Sign-Up" : "Sign-In"}
                   </Link>
                </footer>
            </>
        )}
    </section>

  )
}

export default AuthForm

// md:gap-8 : Increases that spacing to 2rem (32px) once the screen hits the md breakpoint (768px). i.e hits medium size switch to larger gap
// lg:text-36 : on large devices text-36
// {...field} : spreads all properties of the field 
// we set submit button to disabled since we do not want use to prevent user from spamming database