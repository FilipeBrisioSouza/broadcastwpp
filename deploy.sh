#!/bin/bash

# Configurações
GIT_REPO="https://github.com/FilipeBrisioSouza/broadcastwpp.git"
BRANCH="main"
LAMBDA_FUNCTION_NAME="minha-lambda"
AWS_REGION="us-east-1"

# 1️⃣ Instalar Node.js e Claudia.js (se necessário)
if ! command -v node &> /dev/null; then
    echo "🔧 Instalando Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

if ! command -v claudia &> /dev/null; then
    echo "🔧 Instalando Claudia.js..."
    npm install -g claudia
fi

# 2️⃣ Clonar o repositório
rm -rf lambda-code  # Remove versão anterior (se existir)
git clone -b $BRANCH $GIT_REPO lambda-code
cd lambda-code || exit

# 3️⃣ Instalar dependências do projeto
npm install

# 4️⃣ Verificar se a Lambda já existe e criar ou atualizar
if claudia list | grep -q "$LAMBDA_FUNCTION_NAME"; then
    echo "🔄 Atualizando Lambda existente..."
    claudia update
else
    echo "🚀 Criando nova Lambda..."
    claudia create --region $AWS_REGION --handler index.handler --runtime nodejs18.x
fi

echo "✅ Deploy finalizado com sucesso!"
