import { Link, useNavigate } from "react-router-dom";

import { LogOut, Moon, Sun, CheckSquare } from "lucide-react";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

import { logout } from "@/features/auth/auth.slice";

export default function Navbar() {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { theme, setTheme } = useTheme();

  const user = useAppSelector(
    (state) => state.auth.user
  );

  const handleLogout = () => {
    dispatch(logout());

    navigate("/", {
      replace: true,
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <nav
        className="
          mx-auto
          flex
          h-16
          max-w-7xl
          items-center
          justify-between
          px-4
          lg:px-6
        "
      >
        <Link
          to="/dashboard"
          className="
            flex
            items-center
            gap-2
            font-semibold
            text-foreground
          "
        >
          <CheckSquare className="h-5 w-5" />

          <span>TaskFlow</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setTheme(
                theme === "dark"
                  ? "light"
                  : "dark"
              )
            }
            className="hover:cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="cursor-pointer bg-gray-100 hover:bg-gray-200  dark:bg-stone-900 dark:hover:bg-stone-800 ">
                  {user.email}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="cursor-pointer bg-gray-100 hover:bg-gray-200  dark:bg-stone-900 dark:hover:bg-stone-800 w-full m-0">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />

                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </header>
  );
}