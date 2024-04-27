"use client";
import { createClient } from "@/lib/supbase/client";
import { Button } from "./ui/button";

const supabase = createClient();
export default function Logout() {
    const logout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };
    return (
        <Button onClick={logout} className="m-4">
        Logout
        </Button>
    );
    }