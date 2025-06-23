🚀 Como Começar!
Bem-vindo! Para colocar esta aplicação em funcionamento, siga os passos abaixo. O projeto é dividido em frontend e backend, e ambos precisam de configuração e instalação de dependências.

✅ Pré-requisitos
Antes de iniciar, você precisará das seguintes credenciais. Crie um arquivo .env na raiz tanto do diretório frontend quanto do backend para armazenar estas informações.

API do Gemini: É necessária uma chave de API para que as funcionalidades de IA generativa funcionem.

# Dentro do arquivo .env do backend
GEMINI_API_KEY=SUA_CHAVE_API_AQUI

# Dentro do arquivo .env do frontend
VITE_API_KEY=SUA_CREDENCIAL_AQUI
VITE_AUTH_DOMAIN=SUA_CREDENCIAL_AQUI
VITE_PROJECT_ID=SUA_CREDENCIAL_AQUI
VITE_STORAGE_BUCKET=SUA_CREDENCIAL_AQUI
VITE_MESSAGING_SENDER_ID=SUA_CREDENCIAL_AQUI
VITE_APP_ID=SUA_CREDENCIAL_AQUI

⚙️ Instalação
Siga estes passos para configurar o ambiente de desenvolvimento.

1. Clone o Repositório
Primeiro, clone o repositório para a sua máquina local, caso ainda não tenha feito.


git clone https://URL-DO-SEU-REPOSITORIO.git
cd nome-do-diretorio
2. Crie os Arquivos de Ambiente
Conforme mencionado nos pré-requisitos, crie os arquivos .env dentro das pastas frontend e backend e preencha com suas credenciais.

3. Instale as Dependências
Este comando instalará todas as dependências necessárias listadas no package.json de cada diretório. Você precisa executar o comando tanto para o frontend quanto para o backend.

# No diretório do frontend
cd frontend
npm install

# No diretório do backend
cd ../backend
npm install

✨ Pronto para Rodar!
Após a instalação, consulte as seções "Como Rodar o Frontend" e "Como Rodar o Backend" para iniciar os servidores de desenvolvimento.
