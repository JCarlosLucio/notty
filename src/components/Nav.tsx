import Link from "next/link";

import BoardDetails from "@/components/BoardDetails";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import UserSessionPopover from "@/components/UserSessionPopover";
import { type RouterOutputs } from "@/utils/api";

type NavProps = {
  board?: RouterOutputs["board"]["getById"];
};

const Nav = ({ board }: NavProps) => {
  return (
    <header className="bg-background/60 fixed z-20 h-16 w-full px-5 backdrop-blur-md md:px-32 2xl:px-60">
      <nav className="flex h-full items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 text-xl font-extrabold"
        >
          <Logo
            className="h-7 w-7 fill-black dark:fill-white"
            titleId="nav-logo"
            title="notty logo"
          />
          <span className={!board ? "inline-block" : "hidden xl:inline-block"}>
            notty
          </span>
        </Link>

        {board && <BoardDetails board={board} />}

        <div className="flex items-center">
          <div className={!board ? "inline-block" : "hidden xl:inline-block"}>
            <div className="mr-5 border-r pr-5">
              <ThemeToggle />
            </div>
          </div>
          <UserSessionPopover />
        </div>
      </nav>
    </header>
  );
};

export default Nav;
