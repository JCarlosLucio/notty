import Link from "next/link";

import ThemeToggle from "./ThemeToggle";

const Nav = () => {
  return (
    <header className="fixed z-20 h-16 w-full border-b px-5 backdrop-blur-md md:px-32 2xl:px-60">
      <nav className="flex h-full items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 text-xl font-extrabold"
        >
          Notty
        </Link>
        <div className="flex items-center">
          <div className="mr-5 flex h-7 items-center border-r pr-5">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Nav;