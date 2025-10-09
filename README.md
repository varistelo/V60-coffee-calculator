# ☕ Calculadora de Café V60 (Método 4:6)

Este projeto é uma calculadora WEB/WPA desenvolvida para auxiliar no processo de percolação de café pelo método V60 (4:6).
Ideal para quem deseja dominar o preparo com medidas precisas e uma experiência prática e intuitiva.

## ⚙️ Funcionalidades

- Campo de entrada para quantidade de café em mililitros.
- Opção de seleção para tipo de café (Arábica ou Conilon).
- Cálculo automático da quantidade de água baseado em uma proporção de 15:1 para Arábica e 18:1 para Conilon.
- Design responsivo para uso ideal tanto em dispositivos desktop quanto móveis.
- Controle do perfil de sabor (Ácido, Equilibrado, Doce).
- Controle da intensidade (Leve, Médio, Forte).
- Timer integrado para acompanhar o tempo de extração.
- **PWA (Progressive Web App)** - Pode ser instalado como aplicativo nativo.
- **Modo escuro automático** - Segue a preferência do sistema operacional.
- **Funcionamento offline** - Funciona sem conexão à internet após primeira visita.

## 📱 PWA - Progressive Web App

### PWA
Este app pode ser instalado diretamente no seu dispositivo (celular, tablet ou computador) funcionando como um app nativo.

### Como Instalar:

#### 📱 **Android (Chrome/Edge/Opera):**
1. Acesse o site via web [https://coffee.varistelo.com.br/](https://coffee.varistelo.com.br/)
2. Toque no menu do navegador (3 pontinhos)
3. Selecione "Instalar app" ou "Adicionar à tela inicial"
4. Confirme a instalação

#### 🍎 **iPhone/iPad (Safari):**
1. Acesse o site via web [https://coffee.varistelo.com.br/](https://coffee.varistelo.com.br/)
2. Toque no botão de compartilhar (quadrado com seta)
3. Selecione "Adicionar à Tela de Início"
4. Confirme tocando em "Adicionar"

#### 💻 **Desktop (Chrome/Edge/Opera):**
1. Acesse o site da calculadora
2. Procure pelo ícone de instalação na barra de endereços
3. Clique em "Instalar" na barra de endereços
4. Ou use o menu: Mais ferramentas → Instalar [nome do app]

#### 🖥️ **Windows:**
- Após instalado, aparecerá no Menu Iniciar e pode ser fixado na barra de tarefas

#### 🍎 **macOS:**
- Após instalado, aparecerá no Launchpad e pode ser adicionado ao Dock

### Vantagens do PWA:
- ✅ **Funcionamento offline** após primeira visita
- ✅ **Inicialização rápida** como app nativo
- ✅ **Sem atualizações manuais** - sempre a versão mais recente
- ✅ **Menos espaço** que apps tradicionais
- ✅ **Interface otimizada** para dispositivos móveis
- ✅ **Acesso rápido** direto da tela inicial


## 📁 Arquivos do projeto

- **index.html**: O documento HTML principal contendo a estrutura completa da calculadora
- **css/style.css**: Estilos para a página web garantindo um layout visualmente atraente e responsivo.
- **js/calculator.js**: Lógica JavaScript que gerencia as entradas do usuário e realiza os cálculos.
- **manifest.json**: Configuração do PWA para instalação como app nativo.
- **service-worker.js**: Script para funcionamento offline e cache de recursos.

## 🚀 Como Usar

1. Acesse [https://coffee.varistelo.com.br/](https://coffee.varistelo.com.br/). Instale como PWA, ou abra o `index.html` em um navegador web.
2. Insira a quantidade desejada de café em mililitros.
3. Selecione o tipo de café (Arábica ou Conilon).
4. Ajuste os controles de sabor e intensidade conforme preferência.
5. Clique em "Calcular".
6. Siga as instruções de preparo e use o timer integrado para controlar os tempos de despejo.

### 🎨 **Temas**
- **Modo escuro**: Triple-clique na imagem do V60 para alternar tema

## 💾 Instalação para Desenvolvimento

Para executar a calculadora de café localmente:

1. Clone o repositório para sua máquina local:
   ```bash
   git clone [URL_DO_REPOSITORIO]
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd v60-coffee-calculator
   ```
3. Abra o arquivo `index.html` em seu navegador preferido.


## Licença

Este projeto está licenciado sob a GNU General Public License v3.0 (GPL-3.0) - veja o arquivo [LICENSE](LICENSE) para detalhes completos.

Em resumo: este é um software livre e de código aberto que você pode usar, modificar e redistribuir. Qualquer software derivado deste também deve permanecer como código aberto sob a mesma licença GPL-3.0, garantindo que todos os usuários mantenham as liberdades de usar, estudar, compartilhar e modificar o software.
