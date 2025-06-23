"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { useEffect } from "react";

export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const goHome = () => {
    router.push("/");
  }

  const login = () => {
    router.push("/login");
  }

  const logOut = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // Redireciona para o login após o logout
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div
      className="
                bg-white
                text-gray-800
                p-3
                fixed 
                top-0 
                left-0 
                right-0 
                z-50 
                flex
                shadow-lg
                justify-between
                items-center
            "
    >
      <button
      onClick={() => goHome()}
        className="
                    font-bold
                    hover:text-cyan-800
                    cursor-pointer
                    transition-colors
                "
      >
        Modelagem
      </button>
      <div>
        {loading ? (
            <p>Carregando...</p>
        ) : user ? (
            <button
                onClick={() => logOut()}
                className="
                  text-red-800
                  hover:text-red-400
                "
            >
                Sair
            </button>
        ) : (
            <button
                onClick={() => login()}
                className="
                    hover:text-cyan-800

                "
            >
                Entrar
            </button>
        )}
      </div>
    </div>
  );
}
