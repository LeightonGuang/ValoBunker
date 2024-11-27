import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

import { getSupabase } from "@/utils/supabase/client";

export function useUser() {
  const supabase = getSupabase();

  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error);
        setUser(null);
      } else {
        setUser(data.session?.user || null);
      }
      setIsLoadingUser(false);
    };

    fetchUser();
  }, [supabase]);

  return { user, isLoadingUser };
}
