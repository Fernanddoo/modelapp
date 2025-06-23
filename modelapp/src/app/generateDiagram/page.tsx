"use client"

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function GenerateDiagram() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    // Estados da página 
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); 

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    const handleGenerateDiagram = async () => {
        if (!prompt) {
            alert("Por favor, digite uma ideia para o diagrama.");
            return;
        }

        setIsLoading(true);
        setIsSuccess(false); 

        try {
            const response = await fetch('http://localhost:3001/api/generate-diagram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                // Tenta ler o erro como JSON, pois o backend envia JSON em caso de erro
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro na API: ${response.statusText}`);
            }

            // 1. Pega a resposta como um 'blob' (objeto binário), não como JSON
            const blob = await response.blob();

            // 2. Cria um link temporário para iniciar o download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'processo.bpmn'); // Nome do arquivo para download
            
            // 3. Adiciona o link ao corpo do documento, clica nele e depois o remove
            document.body.appendChild(link);
            link.click();
            if (link.parentNode !== null) {
                link.parentNode.removeChild(link);
            }
            window.URL.revokeObjectURL(url); // Libera a memória

            setIsSuccess(true); // Mostra a mensagem de sucesso

        } catch (error: any) {
            console.error("Falha ao gerar o diagrama:", error);
            alert(`Não foi possível gerar o diagrama: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading || !user) {
        return <p className="text-center mt-20">Carregando...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col pt-24 items-center text-gray-800 px-4">
            <h1 className="text-4xl font-bold mb-4">Gerador de Processos de Negócio</h1>
            <p className="text-lg mb-8 text-center max-w-2xl">Descreva sua ideia e transforme-a em um modelo de processo profissional no padrão BPM.</p>

            {/* --- CONTROLES DE GERAÇÃO --- */}
            <div className="w-full max-w-2xl flex gap-2 mb-8">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: Uma cafeteria que também vende livros usados"
                    className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                />
                <button
                    onClick={handleGenerateDiagram}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? 'Gerando...' : 'Gerar e Baixar'}
                </button>
            </div>

            {/* --- MENSAGEM DE SUCESSO (OPCIONAL) --- */}
            {isSuccess && (
                <div className="w-full max-w-2xl mt-10 p-6 bg-green-100 border border-green-400 text-green-800 rounded-xl shadow-lg text-center animate-fade-in">
                    <h2 className="text-xl font-semibold">
                        Download iniciado com sucesso!
                    </h2>
                    <p>
                        Verifique sua pasta de downloads para encontrar o arquivo `processo.bpm`.
                    </p>
                </div>
            )}
        </div>
    );
}