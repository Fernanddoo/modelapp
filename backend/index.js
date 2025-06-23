// Importações necessárias
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const BpmnModdle = require('bpmn-moddle');
const cors = require("cors");
require("dotenv").config();

// Configuração inicial do Express
const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuração da API Gemini
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("A variável de ambiente GEMINI_API_KEY não foi definida.");
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// Definição da rota POST
app.post("/api/generate-diagram", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "O prompt é obrigatório" });
    }

    const fullPrompt = `
      Analise a seguinte ideia de negócio: "${prompt}".
      Sua tarefa é decompor essa ideia em um processo de negócio e retornar um objeto JSON.
      Responda APENAS com o código JSON. Não inclua a palavra "json" ou acentos graves (\`\`\`).
      O JSON deve ter duas chaves principais: "nodes" e "edges".
      1.  **nodes**: Um array de objetos com "id", "label", e "type" (StartEvent, EndEvent, Task, ExclusiveGateway).
      2.  **edges**: Um array de objetos com "id", "source", "target", e "label" (opcional para gateways).
      Comece o processo com um "StartEvent" e termine com pelo menos um "EndEvent".
    `;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const rawJsonText = response.text();
    const cleanedJsonText = rawJsonText.replace(/```json/g, "").replace(/```/g, "").trim();
    const processJson = JSON.parse(cleanedJsonText);
    
    // 1. GERAÇÃO DO XML BPMN 2.0 PADRÃO
    const moddle = new BpmnModdle();
    const bpmnElements = processJson.nodes.map(node => moddle.create(`bpmn:${node.type}`, { id: node.id, name: node.label }));
    const bpmnSequenceFlows = processJson.edges.map(edge => moddle.create('bpmn:SequenceFlow', { id: edge.id, name: edge.label || '', sourceRef: bpmnElements.find(e => e.id === edge.source), targetRef: bpmnElements.find(e => e.id === edge.target) }));
    const processElement = moddle.create('bpmn:Process', { id: 'Process_1', isExecutable: false, flowElements: [...bpmnElements, ...bpmnSequenceFlows] });
    const participant = moddle.create('bpmn:Participant', { id: 'Participant_1', name: 'Processo Principal', processRef: processElement });
    const collaboration = moddle.create('bpmn:Collaboration', { id: 'Collaboration_1', participants: [participant] });
    let currentX = 150;
    const shapes = [];
    const edges = [];
    const nodePositions = {};
    processJson.nodes.forEach(node => {
      const isEvent = node.type.includes('Event');
      const width = isEvent ? 36 : 100;
      const height = isEvent ? 36 : 80;
      const y = isEvent ? 102 : 80;
      const shape = moddle.create('bpmndi:BPMNShape', { id: `${node.id}_di`, bpmnElement: bpmnElements.find(e => e.id === node.id), bounds: moddle.create('dc:Bounds', { x: currentX, y, width, height }) });
      shapes.push(shape);
      nodePositions[node.id] = { x: currentX, y, width, height };
      currentX += width + 80;
    });
    processJson.edges.forEach(edge => {
      const sourcePos = nodePositions[edge.source];
      const targetPos = nodePositions[edge.target];
      const waypoints = [moddle.create('dc:Point', { x: sourcePos.x + sourcePos.width, y: sourcePos.y + sourcePos.height / 2 }), moddle.create('dc:Point', { x: targetPos.x, y: targetPos.y + targetPos.height / 2 })];
      const bpmnEdge = moddle.create('bpmndi:BPMNEdge', { id: `${edge.id}_di`, bpmnElement: bpmnSequenceFlows.find(e => e.id === edge.id), waypoint: waypoints });
      edges.push(bpmnEdge);
    });
    const plane = moddle.create('bpmndi:BPMNPlane', { id: 'BPMNPlane_1', bpmnElement: collaboration, planeElement: [...shapes, ...edges] });
    const diagram = moddle.create('bpmndi:BPMNDiagram', { id: 'BPMNDiagram_1', plane: plane });
    const definitions = moddle.create('bpmn:Definitions', { id: 'Definitions_1', targetNamespace: 'http://bpmn.io/schema/bpmn', rootElements: [collaboration, processElement], diagrams: [diagram] });
    
    const { xml: diagramXMLString } = await moddle.toXML(definitions, { format: true });

    res.setHeader('Content-Type', 'application/bpmn20-xml; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="processo.bpmn"`); // Mudar para .bpmn
    res.send(diagramXMLString);

  } catch (error) {
    console.error("Erro ao gerar o diagrama BPMN:", error);
    res.status(500).json({ error: "Falha ao gerar o diagrama BPMN" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}, pronto para gerar arquivos BPMN!`);
});