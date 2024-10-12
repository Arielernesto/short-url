/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { API_HOST } from "../lib/config";
import { toast } from "../components/ui/use-toast";

export const useAuthStore = create((set, get) => {

    return {
        loading: false,
        getAuth: async () => {
            set({loading: true})
            const { session } = get()
            if (session.auth) return
            const pet = await fetch(`${API_HOST}/auth/session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            const user = await pet.json()
            if (!user.auth) {
                set({loading: false})
                set({session: user})
            }
            set({loading: false})
            set({session: user})
        },
        session: false,
        logOut: async () => {
            const pet = await fetch(`${API_HOST}/auth/logout`, {
                method: "POST",
                credentials: "include"
            })
            const logout = await pet.json()
            if (logout.auth == false) {
                toast({title: logout.message})
                set({session: false})
                set({loading: false})
            }
        }
    }
})