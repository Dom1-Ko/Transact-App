import AuthForm from "@/components/AuthForm"

const SignIn = () => {
  return (
    <section className='flex-center size-full max-sm:px-6'>
      <AuthForm type="sign-in" />
    </section>
  )
}

export default SignIn

// max-sm:px-6 : applies horizontal padding (both right and left) and on screens smaller than 640px 