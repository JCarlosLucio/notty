import Link from "next/link";

const Nav = () => {
  return (
    <header className="fixed z-20 h-16 w-full px-5 backdrop-blur-md md:px-32 2xl:px-60">
      <nav className="flex h-full items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 text-xl font-extrabold"
        >
          Notty
        </Link>
      </nav>
    </header>
  );
};

export default Nav;
