import React from 'react'
import Image from 'next/image';
import Link from 'next/link';


const Navbar = async () => {
    const session = true;

    const signIn = () => {}
    const signOut = () => {}

    return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={144} height={30} />
        </Link>

        <div className="flex items-center gap-5 text-black">
          {session && session?.user ? (
            <>
              <Link href="/startup/create">
                <span>Create</span>
              </Link>

              <button onClick={signOut}>
                <button type="submit">Logout</button>
              </button>

              <Link href={`/user/${session?.id}`}>
                <span>{session?.user?.name}</span>
              </Link>
            </>
          ) : (
            <button onClick={signIn}>
              <button type="submit">Login</button>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar