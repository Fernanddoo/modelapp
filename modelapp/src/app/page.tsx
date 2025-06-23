"use client"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div
      className="
        flex
        bg-gray-100
        min-h-screen
        justify-center
        items-center
      "
    >
      <div className="text-center">
        <h1 
          className="
            text-gray-800
            text-5xl 
            md:text-6xl 
            font-semibold
          "
        >Bem-vindo!</h1>
        <button 
          className="
            text-gray-800 
            mt-5 text-2xl 
            border px-4 py-1 
            rounded-md
            hover:bg-gray-800
            hover:text-white
            transition-colors
            cursor-pointer
            "
          onClick={
            () => router.push("/generateDiagram")
          }
        >
          Ir para o gerador
        </button>
      </div>
    </div>
  );
}
