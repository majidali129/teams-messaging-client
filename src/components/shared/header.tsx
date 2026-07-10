import { Link } from "react-router";
import { Loader2Icon, LogOutIcon, MenuIcon, SettingsIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAvatar, getInitials } from "@/lib/utils";
import { profilePath, settingsPath, signInPath } from "@/paths";
import { useUser } from "@/features/auth/hooks/use-user";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { UserReceivedInvites } from "./user-received-invites";
import { socketInstance } from "@/sockets/instance";

export const Header = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const { user } = useUser();
  const {logout, isPending} = useLogout();

  const handleLogout =  () => {
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
    socketInstance().disconnect();
    logout();
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <MenuIcon />
        </Button>
      </div>

      <div className="flex items-center gap-3.5">
      <UserReceivedInvites />

        {user ? (
          <DropdownMenu>
              <DropdownMenuTrigger
              render={
                <Button variant="ghost" className="gap-2 px-1.5" size="lg" disabled={isPending}>
                    <Avatar size="default">
                      <AvatarImage src={getAvatar(user.name)} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium sm:inline">{user.name}</span>
                </Button>
              }
            >
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link to={profilePath()} />}>
              <UserIcon />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link to={settingsPath()} />}>
              <SettingsIcon />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout} disabled={isPending}>
              {isPending ? <Loader2Icon className="animate-spin" /> : <LogOutIcon />}
              Log out
            </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        ) : (
          <Button size="lg" className="tracking-wide">
            <Link to={signInPath()}>Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
};
