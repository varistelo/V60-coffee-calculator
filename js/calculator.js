document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('coffee-form');
    const resultDiv = document.getElementById('result');
    const aciditySlider = document.getElementById('acidity-slider');
    const strengthSlider = document.getElementById('strength-slider');
    
    // Função para atualizar as tags informativas no subtítulo
    function updateSubtitleTags() {
        const coffeeVolume = document.getElementById('coffee-quantity').value;
        const coffeeType = document.querySelector('input[name="coffee-type"]:checked').value;
        const acidityValue = parseInt(aciditySlider.value);
        const strengthValue = parseInt(strengthSlider.value);
        
        // Atualizar volume
        const volumeTag = document.getElementById('volume-display');
        volumeTag.textContent = `${coffeeVolume}ml`;
        volumeTag.classList.add('visible');
        
        // Atualizar tipo de café
        const typeTag = document.getElementById('type-display');
        typeTag.textContent = coffeeType === 'arabica' ? 'Arábica' : 'Conilon';
        typeTag.classList.add('visible');
        
        // Atualizar sabor
        const tasteLabels = ['Ácido', 'Equilibrado', 'Doce'];
        const tasteTag = document.getElementById('taste-display');
        tasteTag.textContent = tasteLabels[acidityValue];
        tasteTag.classList.add('visible');
        
        // Atualizar intensidade
        const strengthLabels = ['Leve', 'Médio', 'Forte'];
        const strengthTag = document.getElementById('strength-display');
        strengthTag.textContent = strengthLabels[strengthValue];
        strengthTag.classList.add('visible');
    }
    
    // Função para manipular o comportamento de expandir/recolher das seções
    function toggleSectionHandler() {
        const parentSection = this.closest('.basic-control, .flavor-control');
        parentSection.classList.toggle('collapsed');
        this.innerHTML = parentSection.classList.contains('collapsed') ? '&#9660;' : '&#9650;';
    }

    // Adiciona visualização em tempo real dos valores dos sliders
    aciditySlider.addEventListener('input', function() {
        updateSliderLabels(this, ['Ácido', 'Equilibrado', 'Doce']);
    });
    
    strengthSlider.addEventListener('input', function() {
        updateSliderLabels(this, ['Leve', 'Médio', 'Forte']);
    });
    
    // Tags só aparecem após calcular - não precisam de listeners em tempo real
    
    // Inicializa visualização dos sliders
    updateSliderLabels(aciditySlider, ['Ácido', 'Equilibrado', 'Doce']);
    updateSliderLabels(strengthSlider, ['Leve', 'Médio', 'Forte']);
    
    // NÃO inicializar as tags - elas só aparecem após calcular

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const coffeeVolume = parseFloat(document.getElementById('coffee-quantity').value);
        const coffeeType = document.querySelector('input[name="coffee-type"]:checked').value;
        const acidityValue = parseInt(aciditySlider.value); // Valores possíveis: 0, 1, 2
        const strengthValue = parseInt(strengthSlider.value); // Valores possíveis: 0, 1, 2
        
        if (coffeeVolume <= 0) {
            alert('Por favor, insira uma quantidade válida de café');
            return;
        }
        
        // Adicionar loading state
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Calculando...';
        submitButton.classList.add('loading');
        
        // Simular pequeno delay para mostrar o loading (melhor UX)
        setTimeout(() => {
            calculateRecipe(coffeeVolume, coffeeType, acidityValue, strengthValue);
            
            // Remover loading state
            submitButton.textContent = originalText;
            submitButton.classList.remove('loading');
        }, 300);
    });

    function calculateRecipe(coffeeVolume, coffeeType, acidityOption, strengthOption) {
        // Proporções de água para café
        const ratios = {
            arabica: 15,
            conilon: 18
        };
        
        // Calcular quantidade de café em gramas com base no volume e proporção
        const coffeeGrams = coffeeVolume / ratios[coffeeType];
        const waterTotal = coffeeVolume;
        
        // Divisão do método Kasuya 4:6
        const firstPhase = Math.floor(waterTotal * 0.4); // 40% para doçura/acidez
        const secondPhase = waterTotal - firstPhase; // 60% restantes para intensidade
        
        // Primeira fase - acidez/doçura tem exatamente 3 opções fixas:
        let pour1, pour2;
        
        switch(acidityOption) {
            case 0: // Mais ácido
                // Proporção exata 58.33%/41.67% (7:5)
                pour1 = Math.round(firstPhase * 0.5833);
                pour2 = firstPhase - pour1;
                break;
            case 1: // Equilibrado
                // Proporção exata 50%/50% (1:1)
                pour1 = Math.round(firstPhase * 0.5);
                pour2 = firstPhase - pour1;
                break;
            case 2: // Mais doce
                // Proporção exata 41.67%/58.33% (5:7)
                pour1 = Math.round(firstPhase * 0.4167);
                pour2 = firstPhase - pour1;
                break;
        }
        
        // Segunda fase - intensidade determina número de steps com volumes iguais
        let pourSteps = [
            { step: 1, time: "00:00", pour: pour1, total: pour1 },
            { step: 2, time: "00:45", pour: pour2, total: pour1 + pour2 }
        ];
        
        switch(strengthOption) {
            case 2: // Forte - 3 steps com volumes EXATAMENTE iguais
                // Calcular volume por despejo (igual para todos)
                const volumePerPourForte = Math.floor(secondPhase / 3);
                
                // Os dois primeiros despejos são exatamente iguais
                const pour3 = volumePerPourForte;
                const pour4 = volumePerPourForte;
                
                // O último recebe qualquer diferença (normalmente será 0 ou 1ml)
                const pour5 = secondPhase - (2 * volumePerPourForte);
                
                pourSteps.push(
                    { step: 3, time: "01:30", pour: pour3, total: pour1 + pour2 + pour3 },
                    { step: 4, time: "02:15", pour: pour4, total: pour1 + pour2 + pour3 + pour4 },
                    { step: 5, time: "03:00", pour: pour5, total: waterTotal }
                );
                break;
                
            case 1: // Média - 2 steps com volumes EXATAMENTE iguais
                // Calcular volume por despejo (igual para todos)
                const volumePerPourMedio = Math.floor(secondPhase / 2);
                
                // O primeiro despejo é exatamente metade
                const pour3Med = volumePerPourMedio;
                
                // O segundo recebe qualquer diferença (normalmente será 0 ou 1ml)
                const pour4Med = secondPhase - volumePerPourMedio;
                
                pourSteps.push(
                    { step: 3, time: "01:30", pour: pour3Med, total: pour1 + pour2 + pour3Med },
                    { step: 4, time: "02:15", pour: pour4Med, total: waterTotal }
                );
                break;
                
            case 0: // Leve - 1 step (todo volume de uma vez)
                const pour3Light = secondPhase;
                
                pourSteps.push(
                    { step: 3, time: "01:30", pour: pour3Light, total: waterTotal }
                );
                break;
        }
        
        displayResult(coffeeGrams, coffeeType, waterTotal, pourSteps, strengthOption);
    }

    function displayResult(coffeeGrams, type, totalWater, pourSteps, strengthOption) {
        // Determinar o tempo de remoção do filtro com base na intensidade
        let removeFilterTime;
        switch(strengthOption) {
            case 2: // Forte - 3 steps - remoção em 03:30
                removeFilterTime = "03:30";
                break;
            case 1: // Média - 2 steps - remoção em 02:45
                removeFilterTime = "02:45";
                break;
            case 0: // Leve - 1 step - remoção em 02:00
                removeFilterTime = "02:00";
                break;
        }
        
        // Obter os rótulos de sabor e intensidade baseados nos valores dos sliders
        const acidityValue = parseInt(document.getElementById('acidity-slider').value);
        const strengthValue = parseInt(document.getElementById('strength-slider').value);
        const flavorLabel = ['Ácido', 'Equilibrado', 'Doce'][acidityValue];
        const strengthLabel = ['Leve', 'Médio', 'Forte'][strengthValue];
        
        // Formatar o tipo de café para exibição
        const typeLabel = type === 'arabica' ? 'Arábica' : 'Conilon';
        
        // Gerar as linhas da tabela
        let tableRows = '';
        pourSteps.forEach((step, index) => {
            tableRows += `
                <tr class="step-row" data-step="${index}">
                    <td>${step.step}</td>
                    <td>${step.time}</td>
                    <td>${step.pour}ml</td>
                    <td>${step.total}ml</td>
                </tr>
            `;
        });
        
        // Adicionar linha para remoção do filtro
        tableRows += `
            <tr class="final-step step-row" data-step="${pourSteps.length}">
                <td>-</td>
                <td>${removeFilterTime}</td>
                <td>Remover filtro</td>
                <td></td>
            </tr>
        `;
        
        resultDiv.innerHTML = `
            <div class="recipe-info">
                <h3>Café necessário: ${coffeeGrams.toFixed(1)}g</h3>
            </div>
            
            <div class="timer-container">
                <div class="timer-display-wrapper">
                    <div class="timer-display" id="timer-display">00:00</div>
                    <div class="countdown-overlay" id="countdown-overlay">3</div>
                </div>
                <div class="flavor-tags-column">
                    <div class="flavor-tags-row">
                        <span class="flavor-tag volume-counter" id="volume-counter">0ml</span>
                    </div>
                </div>
            </div>
            
            <table class="recipe-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tempo</th>
                        <th>Despejo</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody id="recipe-steps">
                    ${tableRows}
                </tbody>
            </table>
            
            <div id="timer-controls" class="timer-controls">
                <button type="button" id="start-timer" class="timer-button">Iniciar Timer</button>
                <div id="timer-options" class="timer-options" style="display: none;">
                    <button type="button" id="reset-timer" class="timer-button reset-button">Resetar Timer</button>
                    <button type="button" id="continue-timer" class="timer-button continue-button">Continuar</button>
                </div>
            </div>
        `;
        
        resultDiv.classList.add('show');
        
        // Mostrar as tags informativas após o cálculo
        updateSubtitleTags();
        
        // Recolher os controles após calcular o resultado
        const basicControl = document.querySelector('.basic-control');
        const flavorControl = document.querySelector('.flavor-control');
        
        // Adicionar classe collapsed aos controles
        basicControl.classList.add('collapsed');
        flavorControl.classList.add('collapsed');
        
        // Atualizar ícones de todos os botões toggle e garantir que funcionem
        const toggleButtons = document.querySelectorAll('.toggle-btn');
        toggleButtons.forEach(btn => {
            const parentSection = btn.closest('.basic-control, .flavor-control');
            
            // Atualizar o ícone para refletir o estado colapsado
            btn.innerHTML = '&#9660;'; // seta para baixo
            
            // Limpar qualquer handler antigo para evitar duplicação
            btn.removeEventListener('click', toggleSectionHandler);
            
            // Adicionar o novo handler de evento
            btn.addEventListener('click', toggleSectionHandler);
        });
        
        // Rolar para o resultado após um pequeno atraso para garantir que a animação ocorra
        setTimeout(() => {
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        // Adicionar botão para expandir/recolher controles de sabor
        const controlLabel = document.querySelector('.control-label');
        if (controlLabel && !controlLabel.querySelector('.toggle-btn')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'toggle-btn';
            toggleBtn.innerHTML = '&#9650;';
            toggleBtn.setAttribute('type', 'button');
            toggleBtn.setAttribute('title', 'Expandir/Recolher');
            toggleBtn.addEventListener('click', function() {
                flavorControl.classList.toggle('collapsed');
                this.innerHTML = flavorControl.classList.contains('collapsed') ? '&#9660;' : '&#9650;';
            });
            controlLabel.appendChild(toggleBtn);
        }
        
        // Rolar para o resultado após calculado
        setTimeout(() => {
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        // Gerenciar os estados dos botões do timer
        const startButton = document.getElementById('start-timer');
        const timerOptions = document.getElementById('timer-options');
        const resetButton = document.getElementById('reset-timer');
        const continueButton = document.getElementById('continue-timer');
        
        // Variáveis para controlar o estado do timer - devem ser declaradas fora do event listener
        let isRunning = false;
        let timerInstance = null;
        let currentSeconds = 0;  // Guarda o tempo atual do timer
        let pausedSeconds = 0;   // Guarda o tempo quando pausado
        let pausedCurrentStep = -1;  // Guarda a etapa atual quando pausado
        
        // Converter os tempos para segundos e criar cache para uso posterior
        const timePointsCache = [];
        pourSteps.forEach(step => {
            const [min, sec] = step.time.split(':').map(Number);
            timePointsCache.push(min * 60 + sec);
        });
        
        // Adicionar o tempo de remoção do filtro ao cache
        const [min, sec] = removeFilterTime.split(':').map(Number);
        timePointsCache.push(min * 60 + sec);
        
        // Função auxiliar para determinar a etapa atual com base no tempo
        function getCurrentStep(seconds, timePoints) {
            let step = -1;
            for (let i = 0; i < timePoints.length; i++) {
                if (seconds >= timePoints[i]) {
                    step = i;
                } else {
                    break;
                }
            }
            return step;
        }
        
        startButton.addEventListener('click', function() {
            if (!isRunning) {
                // Iniciar o timer
                isRunning = true;
                
                // Se estamos retomando de uma pausa, não mostrar a contagem regressiva
                if (pausedSeconds > 0) {
                    timerInstance = startBrewingTimer(pourSteps, removeFilterTime, pausedSeconds, pausedCurrentStep, function(seconds) {
                        currentSeconds = seconds;  // Atualizar o contador global
                    });
                    this.textContent = 'Parar Timer';
                } else {
                    // Mostrar contagem regressiva para início
                    const countdownOverlay = document.getElementById('countdown-overlay');
                    const timerDisplay = document.querySelector('.timer-display');
                    
                    countdownOverlay.style.display = 'flex';
                    timerDisplay.style.opacity = '0'; // Esconder o timer zerado
                    
                    let countdown = 3;
                    countdownOverlay.textContent = countdown;
                    
                    const countdownInterval = setInterval(() => {
                        countdown--;
                        if (countdown > 0) {
                            countdownOverlay.textContent = countdown;
                        } else {
                            clearInterval(countdownInterval);
                            countdownOverlay.style.display = 'none';
                            timerDisplay.style.opacity = '1'; // Mostrar o timer novamente
                            
                            // Iniciar o timer após contagem regressiva
                            timerInstance = startBrewingTimer(pourSteps, removeFilterTime, 0, -1, function(seconds) {
                                currentSeconds = seconds;  // Atualizar o contador global
                            });
                            this.textContent = 'Parar Timer';
                        }
                    }, 1000);
                }
            } else {
                // Parar o timer e salvar o tempo atual
                if (timerInstance) {
                    clearInterval(timerInstance);
                    pausedSeconds = currentSeconds;  // Guardar o tempo atual para continuar depois
                    pausedCurrentStep = getCurrentStep(pausedSeconds, timePointsCache);
                }
                
                // Mostrar opções
                startButton.style.display = 'none';
                timerOptions.style.display = 'flex';
            }
        });
        
        resetButton.addEventListener('click', function() {
            // Resetar timer
            isRunning = false;
            currentSeconds = 0;
            pausedSeconds = 0;
            pausedCurrentStep = -1;
            
            // Resetar display do timer
            document.getElementById('timer-display').textContent = '00:00';
            document.getElementById('timer-display').className = 'timer-display';
            
            // Remover destaque de todas as linhas
            const rows = document.querySelectorAll('.step-row');
            rows.forEach(row => {
                row.classList.remove('active-step', 'step-highlight', 'step-completed', 'step-remove-filter');
            });
            
            // Voltar para o botão inicial
            timerOptions.style.display = 'none';
            startButton.style.display = 'block';
            startButton.textContent = 'Iniciar Timer';
            startButton.classList.remove('timer-finished');
        });
        
        continueButton.addEventListener('click', function() {
            // Continuar timer do tempo pausado
            isRunning = true;
            
            console.log("Continuando de:", pausedSeconds, "segundos, etapa:", pausedCurrentStep);
            
            timerInstance = startBrewingTimer(pourSteps, removeFilterTime, pausedSeconds, pausedCurrentStep, function(seconds) {
                currentSeconds = seconds;  // Atualizar o contador global
            });
            
            // Voltar para o botão de parar
            timerOptions.style.display = 'none';
            startButton.style.display = 'block';
            startButton.textContent = 'Parar Timer';
        });
    }

    // Função para iniciar o timer de preparação - agora com callback para atualizar o tempo atual
    function startBrewingTimer(steps, removeFilterTime, startFromSeconds = 0, startFromStep = -1, updateTimeCallback = null) {
        let audioContext;
        
        // Função para vibrar o dispositivo (se suportado)
        function vibrate(pattern) {
            // Verificar se a API de vibração está disponível
            if ('vibrate' in navigator) {
                navigator.vibrate(pattern);
            }
        }
        
        function playBeep(count = 1, type = 'regular') {
            try {
                // Usar AudioContext API para criar um beep consistente em todos navegadores
                if (!audioContext) {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }
                
                // Função para tocar um único beep regular
                function playRegularBeep() {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.type = 'sine';
                    oscillator.frequency.value = 800; // 800Hz
                    gainNode.gain.value = 0.5;
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.start(0);
                    
                    // Duração do beep
                    setTimeout(() => {
                        oscillator.stop();
                    }, 300);
                    
                    // Vibrar o dispositivo - pulso curto
                    vibrate(100);
                }
                
                // Função para tocar um beep de sino/início
                function playBellBeep() {
                    const context = audioContext;
                    const now = context.currentTime;
                    
                    // Primeiro som (mais grave)
                    const osc1 = context.createOscillator();
                    osc1.type = 'sine';
                    osc1.frequency.value = 700; // Frequência mais baixa
                    
                    const gain1 = context.createGain();
                    gain1.gain.setValueAtTime(0, now);
                    gain1.gain.linearRampToValueAtTime(0.5, now + 0.1);
                    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                    
                    osc1.connect(gain1);
                    gain1.connect(context.destination);
                    osc1.start(now);
                    osc1.stop(now + 0.5);
                    
                    // Segundo som (mais agudo) com pequeno atraso
                    setTimeout(() => {
                        const osc2 = context.createOscillator();
                        osc2.type = 'sine';
                        osc2.frequency.value = 1100; // Frequência mais alta
                        
                        const gain2 = context.createGain();
                        const startTime = context.currentTime;
                        gain2.gain.setValueAtTime(0, startTime);
                        gain2.gain.linearRampToValueAtTime(0.4, startTime + 0.1);
                        gain2.gain.exponentialRampToValueAtTime(0.01, startTime + 0.6);
                        
                        osc2.connect(gain2);
                        gain2.connect(context.destination);
                        osc2.start(startTime);
                        osc2.stop(startTime + 0.6);
                    }, 250); // Pequeno atraso para o efeito "TUUU RUUU"
                    
                    // Vibrar o dispositivo - dois pulsos curtos
                    vibrate([100, 50, 100]);
                }
                
                // Função para tocar beep de finalização
                function playFinishBeep() {
                    const context = audioContext;
                    const now = context.currentTime;
                    
                    // Criar uma sequência de beeps que soe como conclusão
                    // Primeiro som - ascendente
                    const osc1 = context.createOscillator();
                    osc1.type = 'sine';
                    osc1.frequency.setValueAtTime(400, now);
                    osc1.frequency.linearRampToValueAtTime(800, now + 0.2);
                    
                    const gain1 = context.createGain();
                    gain1.gain.setValueAtTime(0.1, now);
                    gain1.gain.linearRampToValueAtTime(0.5, now + 0.1);
                    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                    
                    osc1.connect(gain1);
                    gain1.connect(context.destination);
                    osc1.start(now);
                    osc1.stop(now + 0.3);
                    
                    // Segundo som - mais grave
                    setTimeout(() => {
                        const osc2 = context.createOscillator();
                        const startTime = context.currentTime;
                        osc2.type = 'sine';
                        osc2.frequency.value = 600;
                        
                        const gain2 = context.createGain();
                        gain2.gain.setValueAtTime(0.1, startTime);
                        gain2.gain.linearRampToValueAtTime(0.6, startTime + 0.1);
                        gain2.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
                        
                        osc2.connect(gain2);
                        gain2.connect(context.destination);
                        osc2.start(startTime);
                        osc2.stop(startTime + 0.5);
                    }, 300);
                    
                    // Terceiro som - mais agudo (finalização)
                    setTimeout(() => {
                        const osc3 = context.createOscillator();
                        const startTime = context.currentTime;
                        osc3.type = 'sine';
                        osc3.frequency.value = 1200;
                        
                        const gain3 = context.createGain();
                        gain3.gain.setValueAtTime(0.1, startTime);
                        gain3.gain.linearRampToValueAtTime(0.7, startTime + 0.1);
                        gain3.gain.exponentialRampToValueAtTime(0.01, startTime + 0.7);
                        
                        osc3.connect(gain3);
                        gain3.connect(context.destination);
                        osc3.start(startTime);
                        osc3.stop(startTime + 0.7);
                    }, 700);
                    
                    // Vibrar o dispositivo - padrão mais complexo para fim
                    vibrate([100, 50, 100, 50, 200]);
                }
                
                // Escolher qual tipo de beep tocar
                if (type === 'bell' || type === 'start') {
                    playBellBeep();
                } else if (type === 'finish') {
                    playFinishBeep();
                } else if (count > 1) {
                    // Para múltiplos beeps regulares
                    let beepCount = 0;
                    const beepInterval = setInterval(() => {
                        playRegularBeep();
                        beepCount++;
                        if (beepCount >= count) {
                            clearInterval(beepInterval);
                        }
                    }, 400); // Intervalo entre os beeps
                    
                    // Vibração específica para o alerta de 3 beeps (remover filtro)
                    if (count === 3) {
                        vibrate([100, 100, 100, 100, 100, 100, 300]);
                    }
                } else {
                    // Beep regular único
                    playRegularBeep();
                }
            } catch(e) {
                console.error("Erro ao reproduzir som:", e);
                // Mesmo se o áudio falhar, tenta vibrar
                if (type === 'bell' || type === 'start') {
                    vibrate([100, 50, 100]);
                } else if (type === 'finish') {
                    vibrate([100, 50, 100, 50, 200]);
                } else if (count > 1) {
                    vibrate([100, 100, 100, 100, 100, 100, 300]);
                } else {
                    vibrate(100);
                }
            }
        }
        
        const timerDisplay = document.getElementById('timer-display');
        const recipeSteps = document.getElementById('recipe-steps');
        const rows = recipeSteps.querySelectorAll('.step-row');
        
        // Converter os tempos para segundos
        const timePoints = [];
        steps.forEach(step => {
            const [min, sec] = step.time.split(':').map(Number);
            timePoints.push(min * 60 + sec);
        });
        
        // Adicionar o tempo de remoção do filtro
        const [filterMin, filterSec] = removeFilterTime.split(':').map(Number);
        const filterTimeInSeconds = filterMin * 60 + filterSec;
        timePoints.push(filterTimeInSeconds);
        
        // Tempo limite: exatamente 1 minuto após o tempo de remoção do filtro
        const timeLimit = filterTimeInSeconds + 60; // +60 segundos (1 minuto)
        
        // Resetar todas as classes visuais das linhas primeiro
        rows.forEach(row => {
            row.classList.remove('active-step', 'step-highlight', 'step-completed', 'step-remove-filter');
        });
        
        // Usar a etapa fornecida ou calcular com base no tempo
        let currentStep = startFromStep;
        const volumeCounter = document.getElementById('volume-counter');
        
        // Inicializar o contador de volume
        if (volumeCounter) {
            if (startFromSeconds === 0) {
                volumeCounter.textContent = '0ml';
            } else if (currentStep >= 0 && currentStep < steps.length) {
                // Se estamos retomando, mostrar o volume TOTAL da etapa atual
                volumeCounter.textContent = `${steps[currentStep].total}ml`;
            } else {
                // Para outros casos, inicializar como 0
                volumeCounter.textContent = '0ml';
            }
        }
        
        // Se estamos começando do zero, sempre destacar a primeira linha
        if (startFromSeconds === 0) {
            currentStep = 0;  // Sempre começa na primeira etapa
            if (rows.length > 0) {
                rows[0].classList.add('active-step');
                flashGreen(timerDisplay, 0, steps);
                // Usar o som de sino/início para o primeiro step
                playBeep(1, 'bell');
            }
        } 
        // Se estamos retomando, encontrar a etapa atual
        else if (currentStep === -1) {
            for (let i = 0; i < timePoints.length; i++) {
                if (startFromSeconds >= timePoints[i]) {
                    currentStep = i;
                } else {
                    break;
                }
            }
            
            // Marcar etapas anteriores como concluídas
            for (let i = 0; i < rows.length; i++) {
                if (i < currentStep) {
                    rows[i].classList.add('step-completed');
                } else if (i === currentStep) {
                    rows[i].classList.add('active-step');
                    
                    if (i === rows.length - 1) {
                        rows[i].classList.add('step-remove-filter');
                    }
                }
            }
        }
        
        console.log("Iniciando timer de:", startFromSeconds, "segundos, etapa:", currentStep);
        
        // Exibir o tempo inicial correto
        const startMins = Math.floor(startFromSeconds / 60).toString().padStart(2, '0');
        const startSecs = (startFromSeconds % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${startMins}:${startSecs}`;
        
        // Aplicar classes de aviso se necessário
        timerDisplay.classList.remove('time-warning', 'time-exceeded');
        
        if (startFromSeconds >= timeLimit) {
            timerDisplay.classList.add('time-exceeded');
        } else if (startFromSeconds > timePoints[timePoints.length - 1]) {
            timerDisplay.classList.add('time-warning');
        }
        
        let seconds = startFromSeconds;
        
        // Função para criar o efeito de piscar em verde por 10 segundos
        function flashGreen(element, stepIndex, stepPours) {
            let flashCount = 0;
            const maxFlashes = 33; // 10 segundos com intervalo de ~300ms = 33 piscadas
            
            // Pegar o volume TOTAL do step atual (não só o despejo)
            const stepVolume = stepPours && stepPours[stepIndex] ? stepPours[stepIndex].total : 0;
            // Pegar o volume total do step anterior (onde começar a contagem)
            const previousStepVolume = stepIndex > 0 && stepPours[stepIndex - 1] ? stepPours[stepIndex - 1].total : 0;
            
            const volumeCounter = document.getElementById('volume-counter');
            let currentVolume = previousStepVolume;
            
            // Reset do contador de volume para o valor do step anterior
            if (volumeCounter) {
                volumeCounter.textContent = `${previousStepVolume}ml`;
                volumeCounter.classList.add('counting'); // Adicionar classe de destaque
                currentVolume = previousStepVolume;
            }
            
            console.log('Iniciando flashGreen para step', stepIndex, 'de', previousStepVolume, 'ml até', stepVolume, 'ml');
            
            const flashInterval = setInterval(() => {
                // Alternar entre destacado e normal
                if (flashCount % 2 === 0) {
                    element.classList.add('step-highlight-green');
                } else {
                    element.classList.remove('step-highlight-green');
                }
                
                // Incrementar o volume durante os primeiros 10 segundos
                if (volumeCounter && flashCount < maxFlashes && stepVolume > 0) {
                    // Calcular incremento baseado no tempo decorrido
                    const progress = (flashCount + 1) / maxFlashes;
                    // Interpolar entre o volume anterior e o volume total atual
                    currentVolume = Math.round(previousStepVolume + (stepVolume - previousStepVolume) * progress);
                    volumeCounter.textContent = `${currentVolume}ml`;
                }
                
                flashCount++;
                
                // Parar após 10 segundos (33 piscadas)
                if (flashCount >= maxFlashes) {
                    clearInterval(flashInterval);
                    element.classList.remove('step-highlight-green');
                    
                    // Remover classe de destaque e garantir volume final correto
                    if (volumeCounter && stepVolume > 0) {
                        volumeCounter.classList.remove('counting');
                        volumeCounter.textContent = `${stepVolume}ml`;
                    }
                }
            }, 300); // Piscar a cada 300ms para durar 10 segundos
        }
        
        let timer = setInterval(() => {
            // Incrementar o contador
            seconds++;
            
            // Atualizar o callback externo se fornecido
            if (updateTimeCallback) {
                updateTimeCallback(seconds);
            }
            
            // Formatar o tempo atual
            const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `${mins}:${secs}`;
            
            // Verificar se estamos em uma nova etapa
            let newStep = currentStep;
            for (let i = 0; i < timePoints.length; i++) {
                if (seconds === timePoints[i]) {
                    newStep = i;
                    break;
                }
            }
            
            // Atualizar o contador de volume baseado na etapa atual
            // (não fazer nada aqui - deixar o flashGreen gerenciar o contador)
            
            // Se mudou de etapa, atualizar a interface
            if (newStep !== currentStep && newStep >= 0) {
                // Marcar etapa anterior como concluída
                if (currentStep >= 0 && currentStep < rows.length) {
                    rows[currentStep].classList.remove('active-step');
                    rows[currentStep].classList.add('step-completed');
                }
                
                // Adicionar destaque à nova etapa
                if (newStep >= 0 && newStep < rows.length) {
                    rows[newStep].classList.add('active-step');
                    
                    // Verificar se é a última etapa (remover filtro)
                    if (newStep === rows.length - 1) {
                        rows[newStep].classList.add('step-remove-filter');
                        
                        // Tocar o som de beep 3 vezes para o step final
                        playBeep(3, 'regular');
                        
                        // Para a última etapa, manter o volume total final
                        if (volumeCounter && steps.length > 0) {
                            const finalVolume = steps[steps.length - 1].total;
                            volumeCounter.textContent = `${finalVolume}ml`;
                        }
                    } else {
                        // Efeito de piscar em verde para as outras etapas
                        flashGreen(timerDisplay, newStep, steps);
                        // Tocar o som de beep 1 vez para steps regulares
                        playBeep(1, 'regular');
                    }
                    
                    // Garantir que a linha é visível na tabela
                    rows[newStep].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                currentStep = newStep;
            }
            
            // Verificar se ultrapassou o tempo limite de extração (1 minuto após o último step)
            if (seconds >= timeLimit) {
                timerDisplay.classList.remove('time-warning');
                timerDisplay.classList.add('time-exceeded');
                
                // Parar o timer exatamente no tempo limite
                if (seconds === timeLimit) {
                    clearInterval(timer);
                    
                    // Tocar o som de finalização
                    playBeep(1, 'finish');
                    
                    // Piscar o display em vermelho
                    flashRed(timerDisplay);
                    
                    // Atualizar o botão de iniciar timer
                    const startButton = document.getElementById('start-timer');
                    startButton.textContent = 'Timer finalizado!';
                    startButton.classList.add('timer-finished');
                    startButton.style.display = 'block';
                    document.getElementById('timer-options').style.display = 'none';
                    isRunning = false;
                }
            }
            // Verificar se ultrapassou o tempo da etapa final
            else if (seconds > timePoints[timePoints.length - 1]) {
                timerDisplay.classList.add('time-warning');
            }
            
        }, 1000);
        
        // Função para criar efeito piscante em vermelho
        function flashRed(element) {
            const originalClass = element.className;
            let flashCount = 0;
            const maxFlashes = 5;
            
            const flashInterval = setInterval(() => {
                if (flashCount % 2 === 0) {
                    element.className = 'timer-display time-exceeded';
                } else {
                    element.className = 'timer-display';
                }
                
                flashCount++;
                if (flashCount >= maxFlashes * 2) {
                    clearInterval(flashInterval);
                    element.className = originalClass + ' time-exceeded';
                }
            }, 300);
        }
        
        return timer; // Retorna a instância para permitir cancelamento
    }

    // Função para destacar o rótulo correspondente ao valor do slider
    function updateSliderLabels(slider, labels) {
        const value = parseInt(slider.value);
        const sliderContainer = slider.closest('.slider-container');
        const sliderValues = sliderContainer.querySelector('.slider-values');
        
        // Destacar o valor atual
        const allSpans = sliderValues.querySelectorAll('span');
        allSpans.forEach((span, index) => {
            span.classList.remove('active');
            if (index === value) {
                span.classList.add('active');
            }
        });
    }
    
    // Função para inicializar os botões de recolher/expandir
    function initToggleButtons() {
        const toggleButtons = document.querySelectorAll('.toggle-btn');
        
        toggleButtons.forEach(btn => {
            // Remover eventos antigos para evitar duplicação
            btn.removeEventListener('click', toggleSectionHandler);
            // Adicionar o novo handler
            btn.addEventListener('click', toggleSectionHandler);
        });
    }

    // Inicializar os botões de toggle para recolher/expandir
    initToggleButtons();
    
    // Easter Egg: Dark/Light Mode toggle na imagem do V60
    initDarkModeEasterEgg();
});

// Função para inicializar o easter egg do dark mode

// Função para inicializar o easter egg das tags
function initVolumeCounterEasterEgg() {
    let clickCount = 0;
    let clickTimer = null;
    
    // Função para encontrar o volume counter (mesmo se ainda não existir)
    function setupTagsClick() {
        const tagsContainer = document.querySelector('.flavor-tags-column');
        
        if (tagsContainer && !tagsContainer.hasEasterEgg) {
            tagsContainer.hasEasterEgg = true;
            
            // Por padrão: mostrar 4 tags de info, esconder contador
            const infoTags = document.querySelectorAll('.info-tag');
            const counterTags = document.querySelectorAll('.counter-tag');
            
            infoTags.forEach(tag => tag.classList.add('visible'));
            counterTags.forEach(tag => tag.classList.remove('visible'));
            
            // Adicionar title hint
            volumeCounter.setAttribute('title', 'Dic 3 vezes para modo minimalista �');
            
            volumeCounter.addEventListener('click', function(e) {
                e.stopPropagation(); // Evitar conflitos com outros cliques
                
                clickCount++;
                
                // Se é o primeiro clique, começar o timer
                if (clickCount === 1) {
                    clickTimer = setTimeout(() => {
                        clickCount = 0; // Reset após 500ms
                    }, 500);
                }
                
                // Se clicou 3 vezes rapidamente (dentro de 500ms)
                if (clickCount === 3) {
                    clearTimeout(clickTimer);
                    clickCount = 0;
                    
                    // Alternar entre modo info e contador
                    window.toggleTagsMode();
                    
                    // Feedback visual no contador
                    this.style.transform = 'scale(1.2) rotate(10deg)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 300);
                    
                    // Mostrar notificação
                    showTagsNotification(showingInfoTags);
                }
            });
        }
    }
    
    // Tentar configurar imediatamente
    setupTagsClick();
    
    // Observer para quando o contador for criado dinamicamente
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                setupTagsClick();
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Função para mostrar notificação das tags
function showTagsNotification(showingInfo) {
    const notification = document.createElement('div');
    const message = showingInfo ? '🏷️ Modo informações ativo' : '📊 Modo contador ativo';
    notification.innerHTML = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: linear-gradient(135deg, #2ecc71, #27ae60);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        animation: slideInLeft 0.3s ease-out;
        box-shadow: 0 8px 25px rgba(46, 204, 113, 0.3);
    `;
    
    // Adicionar animação CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInLeft {
            from { transform: translateX(-100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutLeft {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(-100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remover após 2 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutLeft 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        }, 300);
    }, 2000);
}

// Função para inicializar o easter egg do dark mode
function initDarkModeEasterEgg() {
    const coffeeImage = document.querySelector('.coffee-cup-illustration');
    let clickCount = 0;
    let clickTimer = null;
    
    if (coffeeImage) {
        // Verificar se já tem preferência salva
        const savedTheme = localStorage.getItem('v60-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        coffeeImage.addEventListener('click', function() {
            clickCount++;
            
            // Se é o primeiro clique, começar o timer
            if (clickCount === 1) {
                clickTimer = setTimeout(() => {
                    clickCount = 0; // Reset após 500ms
                }, 500);
            }
            
            // Se clicou 3 vezes rapidamente (dentro de 500ms)
            if (clickCount === 3) {
                clearTimeout(clickTimer);
                clickCount = 0;
                
                // Toggle do tema
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('v60-theme', newTheme);
                
                // Efeito especial na imagem com rotações múltiplas PRIMEIRO
                coffeeImage.style.transition = 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                coffeeImage.style.transform = 'rotate(720deg) scale(1.3)';
                
                // Reset mais lento para garantir que a animação seja vista
                setTimeout(() => {
                    coffeeImage.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55), filter 0.2s ease';
                    coffeeImage.style.transform = '';
                }, 1000);
                
                // Feedback visual DEPOIS da animação começar
                setTimeout(() => {
                    showThemeChangeNotification(newTheme);
                }, 200);
            }
        });
        
        // Adicionar title hint sutil
        coffeeImage.setAttribute('title', '3x rapidamente = Dark Mode 😉');
    }
}

// Função para mostrar notificação de mudança de tema
function showThemeChangeNotification(theme) {
    const notification = document.createElement('div');
    const themeText = theme === 'dark' ? '🌙 Modo Escuro Ativado' : '☀️ Modo Claro Ativado';
    
    notification.innerHTML = themeText;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary);
        color: var(--white);
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: var(--shadow);
    `;
    
    // Adicionar animação CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }, 300);
    }, 3000);
}

console.log("Script de calculadora carregado");