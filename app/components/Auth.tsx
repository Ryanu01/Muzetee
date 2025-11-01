/*
 * Not Being used any where
 * need to change the schema to let user log in as a creator or as a user
 * and then use this function over there 
 */
import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Redirect } from "./Redirect";

export default function Auth({creatorId}: {
    creatorId: string
}) {
    const session = useSession();
  return (
    <div className="flex">
      {session.data?.user && (
        <button className="cursor-pointer" onClick={() => signOut()}>
          <LogOut></LogOut>
        </button>
      )}
      {!session.data?.user && (
        <button
          onClick={() => signIn()}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition cursor-pointer"
        >
        <LogIn />
        </button>
      )}
      
    </div>
  );
}
