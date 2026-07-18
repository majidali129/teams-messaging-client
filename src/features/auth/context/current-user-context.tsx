import { createContext, useContext, type ReactNode } from "react";
import type { User } from "@/types";

const CurrentUserContext = createContext<User | null>(null);

export const CurrentUserProvider = ({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) => {
  return (
    <CurrentUserContext.Provider value={user}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = (): User => {
  const user = useContext(CurrentUserContext);
  if (!user) {
    throw new Error(
      "useCurrentUser must be used within a CurrentUserProvider (inside ProtectRoute).",
    );
  }
  return user;
};
