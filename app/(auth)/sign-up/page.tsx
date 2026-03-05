import AuthForm from "@/components/AuthForm"

const SignUp = () => {
  return (
    <section className='flex-center size-full max-sm:px-6'>
      <AuthForm type="sign-up" />
    </section>
  )
}

export default SignUp

// max-sm:px-6 : applies horizontal padding (both right and left) and on screens smaller than 640px 