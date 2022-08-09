import { getProviders, signIn } from "next-auth/react"
import Header from "../components/Header"

export default function SignIn({ providers }) {
  return (
    <div>
      <Header />
      <main className="max-w-screen-lg mx-auto p-10">
        <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">Sign In Options</h1>
        <div className='flex flex-col items-center mt-4'>
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button onClick={() => signIn(provider.id, { callbackUrl: '/' })} className='button my-2'>
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}