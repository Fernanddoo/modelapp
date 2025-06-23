import { useEffect, useState } from 'react';
import mermaid from 'mermaid';

// Inicializa o Mermaid
mermaid.initialize({ startOnLoad: false });

const MermaidEditor = ({ initialSyntax = '' }) => {
  const [syntax, setSyntax] = useState(initialSyntax);
  const [diagram, setDiagram] = useState('');

  useEffect(() => {
    // Atualiza a sintaxe se a prop inicial mudar (ao carregar um projeto)
    setSyntax(initialSyntax);
  }, [initialSyntax]);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        // Gera um ID único para o SVG para evitar conflitos
        const id = `mermaid-diagram-${Math.random().toString(36).substr(2, 9)}`;
        // Renderiza o SVG a partir da sintaxe
        const { svg } = await mermaid.render(id, syntax);
        setDiagram(svg);
      } catch (error) {
        // Se a sintaxe estiver errada, você pode mostrar uma mensagem de erro
        console.error("Erro na sintaxe do Mermaid:", error);
        setDiagram('<p class="text-red-500">Erro na sintaxe. Verifique o texto.</p>');
      }
    };

    if (syntax) {
      renderDiagram();
    } else {
      setDiagram('');
    }
  }, [syntax]); // Re-renderiza sempre que a sintaxe mudar

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Área de Texto para Edição */}
      <textarea
        className="w-full md:w-1/2 h-96 p-2 font-mono border rounded"
        value={syntax}
        onChange={(e) => setSyntax(e.target.value)}
        placeholder="Digite a sintaxe do Mermaid ou gere um diagrama..."
      />

      {/* Área de Visualização do Diagrama */}
      <div
        className="w-full md:w-1/2 p-4 border rounded"
        dangerouslySetInnerHTML={{ __html: diagram }}
      />
    </div>
  );
};

export default MermaidEditor;