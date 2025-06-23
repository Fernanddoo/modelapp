// app/cadastro/page.tsx
"use client";

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig'; // Ajuste o caminho
import { useRouter } from 'next/navigation';

export default function Cadastro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/login'); // Redireciona para o login após o sucesso
    } catch (error: any) {
      setError(error.message);
      console.error("Erro no cadastro:", error);
    }
  };

  return (
    <div className='
      bg-gray-100
      text-gray-800
      flex
      flex-col
      min-h-screen
      items-center
      justify-center
    '>
      <div className='border border-gray-800 p-8 rounded-lg'>
        <h1 className='
            text-center 
            text-2xl 
            font-sans
            font-semibold
            mb-8
          '
        >
          Cadastro
        </h1>
        <form 
          className='
            flex
            flex-col
            gap-4
          '
          onSubmit={handleSignUp}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email..."
            required
            className='
              p-3 border 
              border-gray-300 
              rounded
              font-sans
            '
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha..."
            required
            className='
              p-3 border 
              border-gray-300 
              rounded
              font-sans
            '
          />
          <button 
            type="submit"
            className='
              border
              border-gray-800
              rounded
              hover:bg-gray-400 
              hover:text-white
              transition-colors
              font-sans
              font-semibold
              py-2
            '
          >
            Cadastrar
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>  
      <button
        onClick={() => router.push("/login")}
        className='
          mt-2
          text-sm
          underline
          cursor-pointer
          hover:text-gray-600
        ' 
      >
        Já possui uma conta?
      </button>
    </div>
  );
}