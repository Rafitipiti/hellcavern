import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import { saveMatchHistory, fetchMatchHistory } from './lib/supabase.js';

// Configuración de Jugadores
const INITIAL_PLAYERS = [
  { id: 0, name: 'Elena', title: 'La Rebelde', hp: 10, str: 3, rob: 3, vel: 4, money: 0, artifacts: [], avatar: '💎' },
  { id: 1, name: 'Alan', title: 'El Valiente', hp: 10, str: 5, rob: 3, vel: 2, money: 0, artifacts: [], avatar: '🔥' },
  { id: 2, name: 'Laura', title: 'La Sabia', hp: 10, str: 3, rob: 2, vel: 5, money: 0, artifacts: [], avatar: '👁️' },
  { id: 3, name: 'Marcos', title: 'El Indomable', hp: 10, str: 2, rob: 5, vel: 3, money: 0, artifacts: [], avatar: '🌑' },
];

const CHARACTER_IMAGES = {
  'Elena': '/characters/elena.png',
  'Alan': '/characters/alan.png',
  'Laura': '/characters/laura.png',
  'Marcos': '/characters/marcos.png',
  'default': '/characters/default.png'
};

const SCENARIOS = [
  '🏛️ Ruinas Ancestrales', '🍄 Bosque de Hongos', '🕳️ Cavernas Profundas', '🐉 Guarida de la Bestia',
  '💰 Puesto del Mercader', '🔥 Cámara de Magma', '❄️ Gruta Escarchada', '🧪 El Río de Azufre',
  '💀 Altar de Sacrificios', '🪞 Cámara de Espejos', '🕸️ Nido de Arácnidos', '⏳ Grieta del Tiempo',
  '👹 Entrada al Infierno', '🤢 Pantano Pestilente', '⚠️ Terreno Inestable', '⛲ Manantial de Éter',
  '🌸 Valle de la Paz', '💰 Mina de Oro', '🪓 Trampa del Verdugo', '🪦 Cementerio Abandonado'
];

const SCENARIO_COLORS = {
  '🌑 Entrada a la Caverna': '#1a1a1a',
  '🏛️ Ruinas Ancestrales': '#2c3e50',
  '🍄 Bosque de Hongos': '#1b4d3e',
  '🕳️ Cavernas Profundas': '#1a1a1a',
  '🐉 Guarida de la Bestia': '#3d2b1f',
  '💰 Puesto del Mercader': '#2c3e50',
  '🔥 Cámara de Magma': '#4d1b1b',
  '❄️ Gruta Escarchada': '#1b3b4d',
  '🧪 El Río de Azufre': '#4d4d1b',
  '💀 Altar de Sacrificios': '#2a002a',
  '🪞 Cámara de Espejos': '#334455',
  '🕸️ Nido de Arácnidos': '#222222',
  '⏳ Grieta del Tiempo': '#001133',
  '👹 Entrada al Infierno': '#2a0000',
  '🤢 Pantano Pestilente': '#2a2a00',
  '⚠️ Terreno Inestable': '#332211',
  '⛲ Manantial de Éter': '#002a2a',
  '🌸 Valle de la Paz': '#1e3d2b',
  '💰 Mina de Oro': '#2a2200',
  '🪓 Trampa del Verdugo': '#240000',
  '🪦 Cementerio Abandonado': '#1a1a24'
};
const SCENARIO_IMAGES = {
  '🏛️ Ruinas Ancestrales': '/escenarios/ruinas-ancestrales.png',
  '🍄 Bosque de Hongos': '/escenarios/bosque-hongos.png',
  '🕳️ Cavernas Profundas': '/escenarios/cavernas-profundas.png',
  '🐉 Guarida de la Bestia': '/escenarios/guarida-bestia.png',
  '💰 Puesto del Mercader': '/escenarios/puesto-mercader.png',
  '🔥 Cámara de Magma': '/escenarios/camara-magma.png',
  '❄️ Gruta Escarchada': '/escenarios/gruta-escarchada.png',
  '🧪 El Río de Azufre': '/escenarios/el-rio-de-azufre.png',
  '💀 Altar de Sacrificios': '/escenarios/altar-sacrificios.png',
  '🪞 Cámara de Espejos': '/escenarios/camara-espejos.png',
  '🕸️ Nido de Arácnidos': '/escenarios/nido-aracnidos.png',
  '⏳ Grieta del Tiempo': '/escenarios/grieta-tiempo.png',
  '👹 Entrada al Infierno': '/escenarios/entrada-infierno.png',
  '🤢 Pantano Pestilente': '/escenarios/pantano-pestilente.png',
  '⚠️ Terreno Inestable': '/escenarios/terreno-inestable.png',
  '⛲ Manantial de Éter': '/escenarios/manantial-eter.png',
  '🌸 Valle de la Paz': '/escenarios/valle-paz.png',
  '💰 Mina de Oro': '/escenarios/mina-oro.png',
  '🪓 Trampa del Verdugo': '/escenarios/trampa-verdugo.png',
  '🪦 Cementerio Abandonado': '/escenarios/cementerio-abandonado.png',
  'default': '/escenarios/default.png'
};

const MONSTERS = [
  {
    name: '👾 Sombra Voraz',
    hp: 8, str: 5, rob: 2, vel: 6,
    desc: 'Se mueve más rápido que la vista. Difícil de golpear.'
  },
  {
    name: '🪨 Gólem de Azufre',
    hp: 20, str: 7, rob: 5, vel: 1,
    desc: 'Lento pero imparable. Su piel de roca mitiga casi todo el daño.'
  },
  {
    name: '🍄 Micónido Infecto',
    hp: 12, str: 4, rob: 3, vel: 3,
    desc: 'Sus esporas debilitan a los aventureros cada turno.'
  },
  {
    name: '🕷️ Tejedora de Almas',
    hp: 15, str: 6, rob: 2, vel: 5,
    desc: 'Atrapa a su presa en hilos de energía antes de atacar.'
  },
  {
    name: '🔥 Arconte de Magma',
    hp: 18, str: 8, rob: 4, vel: 2,
    desc: 'Irradia un calor que quema incluso antes de tocarlo.'
  }
];

const ENEMY_IMAGES = {
  '👾 Sombra Voraz': '/enemies/sombra-voraz.png',
  '🪨 Gólem de Azufre': '/enemies/golem-azufre.png',
  '🍄 Micónido Infecto': '/enemies/miconido-infecto.png',
  '🕷️ Tejedora de Almas': '/enemies/tejedora-almas.png',
  '🔥 Arconte de Magma': '/enemies/arconte-magma.png',
  'default': '/enemies/default-monster.png'
};

let backgroundMusic = null;
if (typeof window !== 'undefined') {
  backgroundMusic = window.__bgMusic || new Audio('/bg-music.mp3');
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.3;
  window.__bgMusic = backgroundMusic;
}

const playSound = (url) => {
  const audio = new Audio(url);
  audio.volume = 0.5;
  audio.play().catch(e => console.error("Error al sonar:", e));
  audio.onended = () => {
    audio.remove();
  };
};

const grantScenarioReward = (currentPlayers, setPlayers, setMessage) => {
  setPlayers(currentPlayers.map(p => ({
    ...p,
    money: (p.money || 0) + 1
  })));
  setMessage("¡Escenario superado! Todos reciben 🪙 1.");
};

function App() {

  const [isMuted, setIsMuted] = useState(true);
  const [gameState, setGameState] = useState('START');
  const [teamNickname, setTeamNickname] = useState('');
  const [matchHistory, setMatchHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [turn, setTurn] = useState(1);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [scenario, setScenario] = useState('🌑 Entrada a la Caverna');
  const [diceResult, setDiceResult] = useState(null);
  const [message, setMessage] = useState('La expedición aguarda tus órdenes...');
  const [isRolling, setIsRolling] = useState(false);
  const [shakingTarget, setShakingTarget] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [activeMinigame, setActiveMinigame] = useState(null);
  const [minigameClicks, setMinigameClicks] = useState(0);
  const [raceState, setRaceState] = useState({ selected: null, positions: [0, 0, 0, 0], finished: false });
  const [shellState, setShellState] = useState({ phase: 'REVEAL', cups: [false, false, false], shuffleCount: 0, cupsPositions: [0, 1, 2], goldCupId: 0 });
  const [shakeState, setShakeState] = useState({ progress: 0, lastX: 0, lastY: 0 });
  const [deathCause, setDeathCause] = useState('');
  const [stats, setStats] = useState({
    totalDamageTaken: 0,
    totalArtifactsFound: 0,
    totalRolls: 0
  });
  const WIN_ARTIFACT = "✨ Fragmento de Edén";
  const [activeMonster, setActiveMonster] = useState(null);
  const [turnOrder, setTurnOrder] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingDecision, setPendingDecision] = useState(null);
  const [isMerchantMinimizedBox, setIsMerchantMinimizedBox] = useState(false);

  const startCombat = (monster) => {
    setActiveMonster({ ...monster, currentHp: monster.hp });

    const participants = players.map(p => ({
      id: p.id,
      name: p.name,
      vel: p.vel + (p.artifacts.includes("🥾 Botas Hermes") ? 3 : 0) - (p.artifacts.includes("🔮 Alma Oscura") ? 1 : 0),
      type: 'player'
    }));

    participants.push({ id: 'monster', name: monster.name, vel: monster.vel, type: 'monster' });

    const sortedOrder = participants.sort((a, b) => b.vel - a.vel);
    setTurnOrder(sortedOrder);
    setGameState('COMBAT');
  };

  const executeCombatTurn = () => {
    const attacker = turnOrder[0];
    let newPlayers = [...players];
    let monster = { ...activeMonster };
    let logTurno = "";

    if (attacker.type === 'player') {
      const p = newPlayers.find(pl => pl.id === attacker.id);
      const fTotal = p.str + (p.artifacts.includes("🦴 Colmillo") ? 3 : 0) + (p.artifacts.includes("🔮 Alma Oscura") ? 7 : 0);

      const damage = Math.max(1, fTotal - monster.rob);
      monster.currentHp -= damage;
      logTurno = `${p.name} ataca al ${monster.name} y causa ${damage} de daño.`;
      setShakingTarget('monster');
    } else {
      const target = newPlayers[Math.floor(Math.random() * newPlayers.length)];
      const rTotal = target.rob + (target.artifacts.includes("🛡️ Armadura") ? 3 : 0) - (target.artifacts.includes("🔮 Alma Oscura") ? 1 : 0);

      const damage = Math.max(1, monster.str - rTotal);
      target.hp -= damage;
      logTurno = `¡El ${monster.name} golpea a ${target.name} causando ${damage} de daño!`;
      setShakingTarget(target.id);

      if (target.hp <= 0) {
        setGameState('GAMEOVER');
        setDeathCause(`${target.name} ha caído en combate contra el ${monster.name}.`);
        setMessage(`GAME OVER: La expedición ha fracasado.`);
        return;
      }
    }

    setPlayers(newPlayers);
    setActiveMonster(monster);
    setMessage(logTurno);

    const newOrder = [...turnOrder.slice(1), turnOrder[0]];
    setTurnOrder(newOrder);

    setTimeout(() => setShakingTarget(null), 500);

    if (monster.currentHp <= 0) {
      let extraMsg = "";
      if (monster.name === '🔥 Arconte de Magma') {
        const newPlayersWithReward = [...newPlayers];
        const attacker = turnOrder[0];
        if (attacker.type === 'player') {
          const p = newPlayersWithReward.find(pl => pl.id === attacker.id);
          p.artifacts.push("✨ Fragmento Estelar");
          extraMsg = ` ¡${p.name} ha obtenido un ✨ Fragmento Estelar de sus restos calcinados!`;
        }
        setPlayers(newPlayersWithReward);
      }

      setMessage(`¡El ${monster.name} ha sido derrotado! El camino está despejado.` + extraMsg);
      setGameState('EXPLORE');
      setActiveMonster(null);
      setIsRolling(false);
      setIsTransitioning(false);
      setPendingDecision(null);
      setTurnOrder([]);
      setTimeout(() => {
        setDiceResult(null);
      }, 100);
    }
  };

  const handleUseArtifact = (playerId, artifactName) => {
    if (gameState !== 'COMBAT' || !activeMonster) return;

    const newPlayers = players.map(p => ({ ...p, artifacts: [...p.artifacts] }));
    const monster = { ...activeMonster };
    const player = newPlayers.find(p => p.id === playerId);

    let logAction = "";

    if (artifactName === '🧪 Vial Ácido') {
      monster.currentHp = Math.max(0, monster.currentHp - 10);
      logAction = `¡${player.name} lanza el Vial Ácido! 10 de daño al ${monster.name}.`;
      setShakingTarget('monster');
    }
    else if (artifactName === '🕸️ Seda') {
      logAction = `¡${player.name} usa la Seda! El ${monster.name} pierde su turno.`;
      setTurnOrder(prev => {
        const filtered = prev.filter(t => t.id !== 'monster');
        return [...filtered, { id: 'monster', name: monster.name, vel: monster.vel, type: 'monster' }];
      });
    }
    else if (artifactName === '🌿 Loto Negro') {
      monster.str = Math.max(1, monster.str - 3);
      monster.rob = Math.max(1, monster.rob - 3);
      monster.vel = Math.max(1, monster.vel - 3);
      logAction = `¡${player.name} usa el Loto Negro! Atributos del enemigo reducidos.`;
    }

    const index = player.artifacts.indexOf(artifactName);
    if (index > -1) {
      player.artifacts.splice(index, 1);
    }

    setPlayers(newPlayers);
    setActiveMonster(monster);
    setMessage(logAction);
    setTimeout(() => setShakingTarget(null), 500);

    if (monster.currentHp <= 0) {
      setTimeout(() => {
        let extraMsg = "";
        if (monster.name === '🔥 Arconte de Magma') {
          player.artifacts.push("✨ Fragmento Estelar");
          extraMsg = " ¡Se ha obtenido un ✨ Fragmento Estelar!";
          setPlayers(newPlayers);
        }

        setMessage(`¡El ${monster.name} ha sido aniquilado!` + extraMsg);
        setGameState('EXPLORE');
        setActiveMonster(null);
        setIsRolling(false);
        setIsTransitioning(false);
        setPendingDecision(null);
        setTurnOrder([]);
        setTimeout(() => {
          setDiceResult(null);
        }, 100);
      }, 800);
    }
  };

  useEffect(() => {
    if (!backgroundMusic) return;
    if (!isMuted) {
      backgroundMusic.play().catch(() => console.log("Esperando interacción..."));
    } else {
      backgroundMusic.pause();
    }
  }, [isMuted]);

  useEffect(() => {
    if (!backgroundMusic) return;
    backgroundMusic.playbackRate = (gameState === 'COMBAT') ? 1.2 : 1.0;
  }, [gameState]);

  // El escenario ahora se cambia directamente en la lógica de avanzar turno en lanzarDados o executeMove
  // para evitar saltos inesperados tras finalizar minijuegos.



  useEffect(() => {
    if (gameState === 'VICTORY' || gameState === 'GAMEOVER') {
      const totalArtifacts = players.reduce((a, b) => a + b.artifacts.length, 0);
      saveMatchHistory({
        nickname: teamNickname || 'Anónimo',
        gameState,
        turn,
        totalArtifacts,
        deathCause,
        scenario
      });
    }
  }, [gameState]);

  const startGame = () => {
    if (backgroundMusic) {
      backgroundMusic.currentTime = 0;
      if (!isMuted) {
        backgroundMusic.play().catch(() => console.log("Esperando interacción..."));
      }
    }
    setGameState('PLAYING');
  };

  const viewHistory = async () => {
    setGameState('HISTORY');
    setIsLoadingHistory(true);
    const history = await fetchMatchHistory();
    setMatchHistory(history || []);
    setIsLoadingHistory(false);
  };

  const rollDice = () => {
    if (isRolling || gameState === 'COMBAT' || isTransitioning || pendingDecision) return;

    setIsRolling(true);
    setDiceResult(null);
    setMessage("Lanzando los dados...");

    if (!isMuted) {
      try {
        playSound('/dice-roll.mp3');
      } catch (e) {
        console.log("Error al reproducir sonido del dado:", e);
      }
    }

    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1;
      setDiceResult(result);
      setIsTransitioning(true);

      if (result === 1 && scenario !== '🌑 Entrada a la Caverna') {
        const mgTypes = ['MASH', 'HOVER_COINS', 'RIDDLE', 'RACE', 'SHELL', 'MOUSE_SHAKE'];
        const randMg = mgTypes[Math.floor(Math.random() * mgTypes.length)];
        if (isAutoPlaying) {
          setIsAutoPlaying(false);
        }

        let initialTime = 5000;
        if (randMg === 'RACE') initialTime = 7000;
        if (randMg === 'SHELL') initialTime = 8000;

        setActiveMinigame({
          type: randMg,
          goldReward: Math.floor(Math.random() * 3) + 3,
          timeLeft: initialTime,
          initialTime: initialTime // Guardamos el tiempo base para el UI
        });

        setMinigameClicks(0);
        setRaceState({ selected: null, positions: [0, 0, 0, 0], finished: false });

        const goldPos = Math.floor(Math.random() * 3);
        setShellState({ phase: 'REVEAL', cups: [false, false, false], shuffleCount: 0, cupsPositions: [0, 1, 2], goldCupId: goldPos });
        setShakeState({ progress: 0, lastX: 0, lastY: 0 });

        setGameState('MINIGAME');
        setIsRolling(false);
      } else {
        resolveEvent(result);
        setIsRolling(false);
      }
    }, 500);
  };

  const finishMinigame = (won) => {
    let newPlayers = [...players];
    const currentPlayer = newPlayers[currentPlayerIdx];
    let minigameMessage = "";
    if (won) {
      currentPlayer.money = (currentPlayer.money || 0) + activeMinigame.goldReward;
      minigameMessage = `¡Prueba Superada! ${currentPlayer.name} ganó 🪙 ${activeMinigame.goldReward}.`;
    } else {
      minigameMessage = `¡Tiempo o opción incorrecta! ${currentPlayer.name} fracasó en su prueba.`;
    }

    setPlayers(newPlayers);
    setMessage(minigameMessage);
    setActiveMinigame(null);
    setGameState('EXPLORE');

    setTimeout(() => {
      setDiceResult(null);
      if (currentPlayerIdx === 3) {
        grantScenarioReward(newPlayers, setPlayers, setMessage);
        setTurn(t => t + 1);
        setCurrentPlayerIdx(0);
      } else {
        setCurrentPlayerIdx(i => i + 1);
      }
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }, 1500);
  };

  const buyItem = (type) => {
    setPlayers(prev => {
      let temp = [...prev];
      const currentP = temp[currentPlayerIdx];
      let txt = "";

      if (type === 'FRAGMENT' && (currentP.money || 0) >= 20) {
        currentP.money -= 20;
        currentP.artifacts.push(WIN_ARTIFACT);
        txt = `¡${currentP.name} ha comprado un ✨ Fragmento Estelar!`;
      } else if (type === 'HEAL' && (currentP.money || 0) >= 5) {
        let alive = temp.filter(p => p.hp > 0);
        if (alive.length === 0) return temp;
        let lowest = alive.reduce((prevC, curr) => (curr.hp < prevC.hp ? curr : prevC));

        const maxHP = 10 + (lowest.artifacts.filter(a => a === "💧 Gota Luz").length * 5);
        if (lowest.hp >= maxHP) {
          txt = `¡Todos están con salud máxima, no hay necesidad de pócimas!`;
        } else {
          currentP.money -= 5;
          lowest.hp = Math.min(maxHP, lowest.hp + 5);
          txt = `¡${currentP.name} gastó oro! ${lowest.name} recuperó 5 HP.`;
        }
      } else if (type === 'MYSTERY' && (currentP.money || 0) >= 12) {
        currentP.money -= 12;
        const attrs = ['str', 'rob', 'vel'];
        const attrNames = { str: 'FUERZA', rob: 'ROBUSTEZ', vel: 'VELOCIDAD' };
        const chosen = attrs[Math.floor(Math.random() * attrs.length)];
        currentP[chosen] += 1;
        txt = `¡${currentP.name} bebió el ⚡ Brebaje Ancestral! Sintió cómo su ${attrNames[chosen]} aumentó (+1).`;
      } else {
        txt = `¡A ${currentP.name} no le alcanza su cartera!`;
      }
      setMessage(txt);
      return temp;
    });
  };

  const handleDecision = (accept) => {
    const { type, player } = pendingDecision;
    let newPlayers = [...players];
    const p = newPlayers.find(pl => pl.id === player.id);
    let customDeathMsg = `${p.name} no sobrevivió a su elección.`;
    let iraACombate = false;

    if (accept) {
      switch (type) {
        case 'DARK_PACT':
          p.hp -= 2;
          p.money -= 1;
          p.artifacts.push("🔮 Alma Oscura");
          setMessage(`¡PACTO SELLADO! ${p.name} ahora porta el Alma Oscura.`);
          customDeathMsg = `${p.name} sucumbió ante el peso del Alma Oscura.`;
          setShakingTarget('all');
          break;
        case 'MERCANTE_OFERTA':
          if (p.money >= 5) {
            p.money -= 5;
            if (!p.artifacts.includes("🛡️ Armadura")) {
              p.artifacts.push("🛡️ Armadura");
              setMessage(`¡TRATO HECHO! ${p.name} paga 5 monedas y se equipa la 🛡️ Armadura.`);
            } else {
              p.hp = Math.min(10 + (p.artifacts.filter(a => a === "💧 Gota Luz").length * 5), p.hp + 6);
              setMessage(`${p.name} ya tiene armadura, así que paga por un refuerzo místico (+6 HP).`);
            }
          } else {
            setMessage("Al final no tenías suficiente oro... El Mercader te echa de su puesto.");
          }
          break;
        case 'MANANTIAL_ETER':
          p.hp -= 5;
          p.artifacts.push("💧 Gota Luz");
          setMessage(`${p.name} entrega su vitalidad al manantial y su alma se expande.`);
          customDeathMsg = `${p.name} se disolvió en el éter del manantial.`;
          break;
        case 'RUINS_RISK': {
          const exito = Math.random() > 0.5;
          if (exito) {
            p.artifacts.push(WIN_ARTIFACT);
            setMessage(`¡SENSACIONAL! ${p.name} fue lo suficientemente rápido y obtuvo el ${WIN_ARTIFACT} sin despertar a nadie.`);
          } else {
            iraACombate = true;
            const guardian = MONSTERS.find(m => m.name === '👾 Sombra Voraz') || MONSTERS[0];
            setMessage(`¡ERROR! Una trampa se activa y el ${guardian.name} emerge de las sombras. ¡A LUCHAR!`);
            setTimeout(() => {
              startCombat(guardian);
            }, 1500);
          }
          break;
        }
        case 'VALLE_PAZ':
          if (accept) {
            p.vel += 2;
            p.str = Math.max(1, p.str - 2);
            setMessage(`${p.name} alcanza la iluminación. +2 VEL, -2 FUE.`);
          } else {
            setMessage(`${p.name} prefiere mantener su instinto guerrero.`);
          }
          break;
        case 'MINA_ORO':
          if (accept) {
            if (Math.random() > 0.5) {
              p.artifacts.push("🛡️ Armadura");
              setMessage(`¡ÉXITO! ${p.name} desentierra una armadura antigua.`);
            } else {
              p.hp -= 4;
              setShakingTarget('all');
              setMessage(`¡DERRUMBE! ${p.name} queda atrapado bajo las rocas. (-4 HP)`);
            }
          } else {
            setMessage(`${p.name} sale de la mina antes de que algo malo ocurra.`);
          }
          break;
        case 'CEMENTERIO_SAQUEO':
          if (accept) {
            if (Math.random() > 0.4) {
              p.artifacts.push("🕸️ Seda");
              setMessage(`${p.name} encuentra Seda fantasmal en la tumba.`);
            } else {
              if (p.artifacts.includes("💧 Gota Luz")) {
                p.artifacts = p.artifacts.filter((a, i, arr) => i !== arr.indexOf("💧 Gota Luz"));
                setMessage(`¡MALDICIÓN! El espíritu drena la esencia de ${p.name} (-5 HP MAX).`);
              } else {
                p.hp -= 2;
                setMessage("El espíritu hiere tu cuerpo mortal. -2 HP.");
              }
            }
          } else {
            setMessage(`${p.name} presenta sus respetos y se aleja.`);
          }
          break;
        default:
          console.warn("Tipo de decisión no reconocido:", type);
      }
    } else {
      setMessage(`${p.name} decidió no tomar el riesgo.`);
    }

    setPlayers(newPlayers);
    setPendingDecision(null);

    setTimeout(() => {
      if (p.hp <= 0 || iraACombate) {
        if (p.hp <= 0) {
          setDeathCause(customDeathMsg);
          setGameState('GAMEOVER');
        }
        setIsTransitioning(false);
        return;
      }

      setDiceResult(null);
      setIsRolling(false);

      if (currentPlayerIdx === 3) {
        grantScenarioReward(newPlayers, setPlayers, setMessage);
        setTurn(t => t + 1);
        setCurrentPlayerIdx(0);
      } else {
        setCurrentPlayerIdx(i => i + 1);
      }

      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }, 1000);
  };

  const resolveEvent = (dice) => {
    let newPlayers = [...players];
    const p = newPlayers[currentPlayerIdx];
    let msg = "";

    const maxHPActual = 10 + (p.artifacts.filter(a => a === "💧 Gota Luz").length * 5);
    const tieneColmillo = p.artifacts.includes("🦴 Colmillo");
    const fuerzaTotal = p.str + (tieneColmillo ? 3 : 0);
    const robustezTotal = p.rob + (p.artifacts.includes("🛡️ Armadura") ? 3 : 0);
    const velTotal = p.vel + (p.artifacts.includes("🥾 Botas Hermes") ? 3 : 0);
    const esquivaExito = Math.random() * 20 < velTotal;

    switch (scenario) {
      case '🌑 Entrada a la Caverna':
        msg = "El silencio y la oscuridad son absolutos. No hay peligro aparente.";
        break;
      case '🏛️ Ruinas Ancestrales':
        if (dice <= 2) {
          setPendingDecision({
            type: 'RUINS_RISK',
            title: "EL TESORO DEL GUARDIÁN",
            description: `Ves un ${WIN_ARTIFACT} brillando en un pedestal. Si intentas tomarlo, podrías alertar al Guardián de las Ruinas. ¿Te arriesgas?`,
            player: p
          });
          msg = `${p.name} observa el artefacto con codicia... las ruinas vibran.`;
          return;
        } else if (dice <= 3) {
          msg = "Las ruinas permanecen en silencio.";
        } else {
          if (esquivaExito) {
            msg = `¡REFLEJOS DE FELINO! El Guardián atacó, pero ${p.name} esquivó el golpe limpiamente.`;
          } else {
            const daño = Math.max(1, 4 - Math.floor(robustezTotal / 2));
            p.hp -= daño;
            setShakingTarget('all');
            msg = `¡ZAS! El Guardián golpea a ${p.name}. Pierde ${daño} HP.`;
          }
        }
        break;
      case '🍄 Bosque de Hongos':
        if (dice === 1) {
          const monstruoElegido = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
          startCombat(monstruoElegido);
          msg = `¡Un ${monstruoElegido.name} bloquea el camino! ¡A luchar!`;
        }
        else if (dice <= 2) msg = "Las esporas están quietas. Nada ocurre.";
        else if (dice <= 4) { p.hp = Math.min(maxHPActual, p.hp + 1); msg = `${p.name} consume frutos sanadores y se cura 1 HP.`; }
        else { p.hp -= 2; setShakingTarget('all'); msg = "Lianas venenosas azotan a " + p.name + " produciendo 2 HP de daño."; }
        break;
      case '🕳️ Cavernas Profundas':
        if (dice === 1) {
          const monstruoElegido = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
          startCombat(monstruoElegido);
          msg = `¡Un ${monstruoElegido.name} bloquea el camino! ¡A luchar!`;
        }
        else if (dice <= 2) { p.hp -= 1; msg = `${p.name} cae en una fosa por la oscuridad (-1 HP). `; }
        else if (dice <= 4) { p.hp -= 2; setShakingTarget('all'); msg = "Algo muerde a " + p.name + " desde las sombras (-2 HP)."; }
        else msg = "Cruzas el túnel con cautela y éxito.";
        break;
      case '🐉 Guarida de la Bestia':
        if (dice === 1) {
          const monstruoElegido = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
          startCombat(monstruoElegido);
          msg = `¡Un ${monstruoElegido.name} bloquea el camino! ¡A luchar!`;
        } else if (dice <= 3) {
          if (esquivaExito) {
            msg = `¡INCREÍBLE! La Bestia lanzó un zarpazo brutal, pero ${p.name} rodó por el suelo esquivándolo por milímetros.`;
          }
          else {
            const dañoBase = 5;
            const mitigacionFuerza = fuerzaTotal >= 6 ? 2 : 0;
            const dañoTrasFuerza = dañoBase - mitigacionFuerza;
            const dañoFinal = Math.max(1, dañoTrasFuerza - Math.floor(robustezTotal / 3));
            p.hp -= dañoFinal;
            setShakingTarget('all');
            msg = mitigacionFuerza > 0
              ? `¡La Bestia hiere a ${p.name}! Su fuerza evitó lo peor, pero recibe ${dañoFinal} HP de daño.`
              : `¡ZARPAZO! ${p.name} no pudo reaccionar a tiempo y recibe ${dañoFinal} HP de daño.`;
          }
        }
        else if (dice <= 5) {
          if (!p.artifacts.includes("🦴 Colmillo")) {
            p.artifacts.push("🦴 Colmillo");
            msg = `¡VALIENTE! ${p.name} aprovecha que la Bestia duerme para arrancar un 🦴 Colmillo (+3 FUE).`;
          } else {
            msg = `${p.name} ya tiene un Colmillo. No necesita otro para luchar.`;
          }
        }
        else {
          msg = "Cruzas la guarida conteniendo el aliento. La Bestia ronca y no se percata de tu presencia.";
        }
        break;
      case '💰 Puesto del Mercader':
        if (dice <= 2) {
          if (p.money >= 5) {
            setPendingDecision({
              type: 'MERCANTE_OFERTA',
              title: "EQUIPAMIENTO PESADO",
              description: `El Mercader te ofrece una 🛡️ Armadura (+3 ROB) por 🪙 5 monedas. ¿Deseas comprarla?`,
              player: p
            });
            msg = `${p.name} revisa su bolsa mientras el Mercader muestra su mercancía...`;
            return;
          } else {
            msg = `${p.name} ve una 🛡️ Armadura brillante, pero el Mercader se ríe: "Vuelve cuando tengas 5 monedas, novato".`;
          }
        } else if (dice === 6) {
          if (!p.artifacts.includes("🛡️ Armadura")) {
            p.artifacts.push("🛡️ Armadura");
            msg = `${p.name} confía en ti y te otorga una 🛡️ Armadura. ¡Su Robustez aumenta en +3!`;
          } else {
            p.hp = Math.min(maxHPActual, p.hp + 4);
            msg = `${p.name} ya tiene una armadura, así que usa los materiales para reforzar su escudo (+4 HP).`;
          }
        }
        else msg = "El Mercader no confía en ti. No hay trato.";
        break;
      case '🔥 Cámara de Magma':
        if (dice <= 3) { newPlayers.forEach(pl => pl.hp -= 2); setShakingTarget('all'); msg = "¡Ola de calor! Todo el grupo sufre quemaduras (-2 HP)."; }
        else if (dice <= 5) { p.hp -= 3; msg = `${p.name} colapsa por deshidratación (-3 HP).`; }
        else msg = "Una corriente de aire fresco te salva.";
        break;
      case '❄️ Gruta Escarchada':
        if (dice <= 3) { newPlayers.forEach(pl => pl.hp -= 2); setShakingTarget('all'); msg = "Viento gélido drena la vida del equipo (-2 HP)."; }
        else if (dice <= 5) { p.hp -= 3; msg = `${p.name} sufre de hipotermia grave (-3 HP).`; }
        else msg = "Encuentras una fogata aún encendida.";
        break;
      case '🧪 El Río de Azufre':
        if (dice === 1) {
          const monstruoElegido = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
          startCombat(monstruoElegido);
          msg = `¡Un ${monstruoElegido.name} bloquea el camino! ¡A luchar!`;
        }
        else if (dice <= 2) {
          p.hp -= 2;
          const nextP = newPlayers[(currentPlayerIdx + 1) % 4];
          nextP.hp -= 1;
          msg = `${p.name} cae al ácido (-2 HP) y salpica a ${nextP.name} (-1 HP).`;
        }
        else if (dice <= 4) { p.artifacts.push("🧪 Vial Ácido"); msg = "Recoges un vial extraño de la orilla."; }
        else msg = "Cruzas el puente de piedra con éxito.";
        break;
      case '💀 Altar de Sacrificios':
        if (dice === 1) {
          const monstruoElegido = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
          startCombat(monstruoElegido);
          msg = `¡Un ${monstruoElegido.name} bloquea el camino! ¡A luchar!`;
        }
        else if (dice <= 2) {
          setPendingDecision({
            type: 'DARK_PACT',
            title: "EL PACTO OSCURO",
            description: `Las sombras te ofrecen el 🔮 Alma Oscura. Obtendrás +7 FUE, pero perderás 2 HP y -1 en el resto de atributos. ¿Aceptas el sacrificio?`,
            player: p
          });
          msg = `${p.name} susurra a las sombras... el Altar espera una respuesta.`;
        }
        else { p.hp = maxHPActual; msg = "Las sombras te consideran digno y te sanan."; }
        break;
      case '🪞 Cámara de Espejos':
        if (dice <= 2) {
          p.hp -= 4;
          setShakingTarget('all');
          msg = `Tu reflejo te atraviesa con su espada. ¡Pierdes 4 puntos de vida!`;
        }
        else if (dice <= 4) {
          const otrosJugadores = newPlayers.filter(pl => pl.id !== p.id);
          const elMasDebil = [...otrosJugadores].sort((a, b) => a.hp - b.hp)[0];
          const maxHPPasivoActual = 10 + (p.artifacts.filter(a => a === "💧 Gota Luz").length * 5);
          const maxHPDebil = 10 + (elMasDebil.artifacts.filter(a => a === "💧 Gota Luz").length * 5);
          const tempHpActualP = p.hp;
          p.hp = Math.min(maxHPPasivoActual, elMasDebil.hp);
          elMasDebil.hp = Math.min(maxHPDebil, tempHpActualP);
          msg = `¡DISONANCIA! ${p.name} intercambió su esencia con ${elMasDebil.name}. Los cuerpos se ajustan a su nueva realidad.`;
        }
        else {
          msg = "Ves tu muerte en el reflejo, pero sales ileso.";
        }
        break;
      case '🕸️ Nido de Arácnidos':
        if (dice <= 3) {
          p.hp -= 2;
          setShakingTarget('all');
          if (p.artifacts.length > 0) {
            const objetoPerdido = p.artifacts.pop();
            msg = `¡EMBOSCADA! ${p.name} pierde 2 HP y en el forcejeo las arañas le arrebatan su ${objetoPerdido}.`;
          } else {
            msg = `Atrapado en seda. ${p.name} pierde 2 HP y queda inmovilizado un momento.`;
          }
        }
        else if (dice <= 5) {
          p.artifacts.push("🕸️ Seda");
          msg = `${p.name} saquea un capullo abandonado y encuentra 🕸️ Seda.`;
        }
        else {
          msg = "Caminas con sigilo. Ni una sola tela de araña se ha movido.";
        }
        break;
      case '⏳ Grieta del Tiempo':
        if (dice <= 3) {
          newPlayers.forEach(pl => {
            const maxHPPasivo = 10 + (pl.artifacts.filter(a => a === "💧 Gota Luz").length * 5);
            pl.hp = Math.min(maxHPPasivo, pl.hp + 2);
          });
          msg = "Una distorsión sana al grupo. ¡Todos recuperan 2 HP!";
        }
        else if (dice === 4 || dice === 5) {
          const teniaObjetos = p.artifacts.length > 0;
          p.artifacts = [];
          const nuevoMax = 10;
          const vidaConCuracion = p.hp + 3;
          p.hp = Math.min(nuevoMax, vidaConCuracion);
          if (teniaObjetos) {
            msg = `¡COLAPSO TEMPORAL! ${p.name} recupera 3 HP, pero pierde todo su equipo en el vacío. Su vitalidad se estabiliza en ${p.hp}/10 HP.`;
          } else {
            msg = `El tiempo se distorsiona. ${p.name} recupera 3 HP, pero siente un vacío inmenso en su mochila.`;
          }
        }
        else {
          if (!p.artifacts.includes("🥾 Botas Hermes")) {
            p.artifacts.push("🥾 Botas Hermes");
            msg = `¡VELOCIDAD DIVINA! ${p.name} encuentra las 🥾 Botas de Hermes. ¡Su Velocidad aumenta en +3!`;
          } else {
            msg = `${p.name} ya es veloz. Las botas se desvanecen en el tiempo.`;
          }
        }
        break;
      case '👹 Entrada al Infierno':
        if (dice === 1) {
          p.artifacts.push(WIN_ARTIFACT);
          msg = `¡DESAFÍO SUPERADO! ${p.name} arrebató un ${WIN_ARTIFACT} de las llamas.`;
        }
        else if (dice <= 4) msg = "El calor es insoportable, pero sigues adelante.";
        else { p.hp -= 5; setShakingTarget('all'); msg = `¡EL GUARDIÁN TE JUZGA! ${p.name} pierde 5 puntos de vida.`; }
        break;
      case '🤢 Pantano Pestilente':
        if (dice === 1) {
          const monstruoElegido = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
          startCombat(monstruoElegido);
          msg = `¡Un ${monstruoElegido.name} bloquea el camino! ¡A luchar!`;
        }
        else if (dice <= 2) {
          p.hp -= 2;
          setShakingTarget('all');
          if (p.artifacts.length > 0) {
            const objetoPerdido = p.artifacts.pop();
            msg = `¡TRAGADO POR EL LODO! ${p.name} pierde 2 HP y su ${objetoPerdido} se hunde en el pantano para siempre.`;
          } else {
            msg = `Miasmas tóxicos debilitan los pulmones de ${p.name}. Pierde 2 HP.`;
          }
        }
        else if (dice <= 4) msg = "Burbujas de gas estallan a tu alrededor.";
        else { p.artifacts.push("🌿 Loto Negro"); msg = "Extraes una flor mística del fango."; }
        break;
      case '⚠️ Terreno Inestable':
        if (dice <= 3) { newPlayers.forEach(pl => pl.hp -= 2); setShakingTarget('all'); msg = "¡Derrumbe! Todo el equipo cae al vacío (-2 HP)."; }
        else if (dice <= 5) {
          p.hp -= 3;
          setShakingTarget('all');
          if (p.artifacts.length > 0) {
            const objetoPerdido = p.artifacts.pop();
            msg = `¡IMPACTO! Una roca golpea a ${p.name} (-3 HP) y destruye su ${objetoPerdido}.`;
          } else {
            msg = `¡ROCA! Una piedra gigante golpea a ${p.name}. Pierde 3 puntos de vida.`;
          }
        }
        else msg = `${p.name} logra saltar a una plataforma firme.`;
        break;
      case '⛲ Manantial de Éter':
        if (dice <= 2) {
          setPendingDecision({
            type: 'MANANTIAL_ETER',
            title: "COMUNIÓN DE ÉTER",
            description: `El agua brilla frente a ${p.name}. Si decide beber profundamente, su vida máxima aumentará (+5 HP Max), pero el proceso drenará su energía actual (-4 HP). ¿Debería ${p.name} beber del manantial?`, player: p
          });
          msg = `${p.name} siente la llamada del éter...`;
          return;
        }
        else if (dice <= 3) {
          newPlayers.forEach(pl => {
            const maxHP = 10 + (pl.artifacts.filter(a => a === "💧 Gota Luz").length * 5);
            pl.hp = Math.min(maxHP, pl.hp + 5);
          });
          msg = "¡AGUAS PRIMORDIALES! Todo el grupo recupera 5 puntos de vida.";
        }
        else if (dice <= 5) {
          const maxHP = 10 + (p.artifacts.filter(a => a === "💧 Gota Luz").length * 5);
          p.hp = maxHP;
          msg = `${p.name} se sumerge y recupera toda su vida (${maxHP} HP).`;
        }
        else {
          p.artifacts.push("💧 Gota Luz");
          p.hp += 5;
          msg = `¡ESENCIA PURA! ${p.name} encuentra una 💧 Gota Luz. ¡Su vida máxima aumenta a ${10 + (p.artifacts.filter(a => a === "💧 Gota Luz").length * 5)}!`;
        }
        break;
      case '🌸 Valle de la Paz':
        if (dice <= 3) {
          setPendingDecision({
            type: 'VALLE_PAZ',
            title: "MEDITACIÓN ZEN",
            description: `El aire es puro. ¿Debería ${p.name} meditar para ganar +2 VELOCIDAD permanente a cambio de perder 2 de FUERZA por la paz interior?`,
            player: p
          });
          msg = `${p.name} respira hondo bajo los cerezos...`;
          return;
        } else {
          p.hp = Math.min(maxHPActual, p.hp + 4);
          msg = "La armonía del valle sana las heridas de " + p.name;
        }
        break;
      case '💰 Mina de Oro':
        if (dice <= 2) {
          p.artifacts.push("🧪 Vial Ácido");
          msg = `${p.name} encuentra suministros químicos. ¡Obtiene un Vial Ácido!`;
        } else if (dice <= 4) {
          setPendingDecision({
            type: 'MINA_ORO',
            title: "CODICIA EN LA MINA",
            description: `${p.name} Ve una veta de oro puro. Si intenta picar, podrías causar un derrumbe, pero si tiene éxito ganará un objeto valioso. ¿Te arriesgas?`,
            player: p
          });
          return;
        } else {
          msg = "La mina está vacía, solo escuchas el goteo del agua.";
        }
        break;
      case '🪓 Trampa del Verdugo':
        if (dice === 1) {
          const monstruoElegido = MONSTERS.find(m => m.name === '🪨 Gólem de Azufre');
          startCombat(monstruoElegido);
          msg = "¡El Verdugo ha invocado a su mascota! ¡A luchar!";
        } else if (dice <= 4) {
          p.hp -= 3;
          setShakingTarget('all');
          msg = "¡CLACK! Una guillotina roza a " + p.name + ". Pierde 3 HP.";
        } else {
          msg = `${p.name} logra deshabilitar los mecanismos de la trampa.`;
        }
        break;
      case '🪦 Cementerio Abandonado':
        if (dice <= 2) {
          const monstruoElegido = MONSTERS.find(m => m.name === '👾 Sombra Voraz');
          startCombat(monstruoElegido);
          msg = "¡Los muertos no descansan! Una Sombra emerge de una tumba.";
        } else if (dice <= 4) {
          setPendingDecision({
            type: 'CEMENTERIO_SAQUEO',
            title: "SAQUEO DE TUMBAS",
            description: ` ${p.name} encuentra una tumba antigua. ¿Debería saquearla? Podría encontrar una Seda o recibir una maldición permanente.`,
            player: p
          });
          return;
        } else {
          msg = "Caminas entre las lápidas. El frío te cala los huesos.";
        }
        break;
    }

    setStats(prev => ({
      ...prev,
      totalRolls: prev.totalRolls + 1,
    }));

    setPlayers(newPlayers);
    setMessage(msg);
    setTimeout(() => setShakingTarget(null), 500);

    const totalFragments = newPlayers.reduce((acc, pl) =>
      acc + pl.artifacts.filter(art => art === WIN_ARTIFACT).length, 0
    );

    if (totalFragments >= 3) {
      setDeathCause("¡EXPEDICIÓN EXITOSA! Han reunido los 3 Fragmentos de Edén y sellado la caverna.");
      setTimeout(() => setGameState('VICTORY'), 1500);
      return;
    }

    if (newPlayers.some(pl => pl.hp <= 0)) {
      const fallen = newPlayers.find(pl => pl.hp <= 0);
      setDeathCause(`${fallen.name} sucumbió en ${scenario}. Motivo: ${msg}`);
      setTimeout(() => setGameState('GAMEOVER'), 1500);
      return;
    }

    if (dice <= 2 && scenario === '💀 Altar de Sacrificios') {
      return;
    }

    setTimeout(() => {
      if (newPlayers.some(pl => pl.hp <= 0) || totalFragments >= 3 || activeMonster || gameState === 'COMBAT') {
        setIsTransitioning(false);
        return;
      }

      setDiceResult(null);
      if (currentPlayerIdx === 3) {
        grantScenarioReward(newPlayers, setPlayers, setMessage);
        setTurn(t => t + 1);
        setCurrentPlayerIdx(0);
        // Cambiamos el escenario AQUÍ para evitar saltos inesperados tras finalizar minijuegos o eventos
        const nextScenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
        setScenario(nextScenario);
      } else {
        setCurrentPlayerIdx(i => i + 1);
      }


      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }, 1500);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    if (gameState === 'GAMEOVER' || gameState === 'VICTORY') {
      setIsAutoPlaying(false);
      return;
    }
    let timer;
    if (gameState === 'COMBAT' && activeMonster) {
      timer = setTimeout(() => {
        executeCombatTurn();
      }, 500);
    } else if (pendingDecision) {
      timer = setTimeout(() => {
        handleDecision(Math.random() > 0.5);
      }, 500);
    } else if ((gameState === 'PLAYING' || gameState === 'EXPLORE') && !isRolling && !isTransitioning) {
      timer = setTimeout(() => {
        rollDice();
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, gameState, activeMonster, pendingDecision, isRolling, isTransitioning, turnOrder, activeMinigame]);

  useEffect(() => {
    if (gameState !== 'MINIGAME' || !activeMinigame || isAutoPlaying) return;
    // RACE y SHELL gestionan su propio ciclo de fin, pero el contador debe seguir corriendo
    if (activeMinigame.type === 'RACE' && raceState.selected !== null) return;
    // Eliminado el bloqueo de timer para SHELL durante SHUFFLE/GUESS

    const timer = setInterval(() => {
      setActiveMinigame((prev) => {
        if (!prev) return prev;
        if (prev.timeLeft <= 100) {
          clearInterval(timer);
          return { ...prev, timeLeft: 0, failed: true };
        }
        return { ...prev, timeLeft: prev.timeLeft - 100 };
      });
    }, 100);
    return () => clearInterval(timer);
  }, [gameState, activeMinigame?.type, isAutoPlaying, raceState.selected, shellState.phase]);

  useEffect(() => {
    if (gameState !== 'MINIGAME' || activeMinigame?.type !== 'RACE' || raceState.selected === null || raceState.finished) return;
    const interval = setInterval(() => {
      setRaceState(prev => {
        if (prev.finished) return prev;
        const newPos = prev.positions.map(p => p + Math.random() * 4);
        if (newPos.some(p => p >= 100)) {
          return { ...prev, positions: newPos.map(p => Math.min(p, 100)), finished: true };
        }
        return { ...prev, positions: newPos };
      });
    }, 100);
    // Failsafe: auto-finish race if it somehow stalls after 15s
    const failsafe = setTimeout(() => {
      setRaceState(prev => {
        if (prev.finished) return prev;
        return { ...prev, positions: prev.positions.map(p => Math.min(p + 50, 100)), finished: true };
      });
    }, 15000);
    return () => { clearInterval(interval); clearTimeout(failsafe); };
  }, [gameState, activeMinigame?.type, raceState.selected, raceState.finished]);

  useEffect(() => {
    if (activeMinigame?.type === 'RACE' && raceState.finished) {
      const winnerIndex = raceState.positions.indexOf(Math.max(...raceState.positions));
      const won = (winnerIndex === raceState.selected);
      const timer = setTimeout(() => finishMinigame(won), 2500);
      return () => clearTimeout(timer);
    }
  }, [raceState.finished]);

  useEffect(() => {
    if (gameState !== 'MINIGAME' || activeMinigame?.type !== 'SHELL') return;
    if (shellState.phase === 'REVEAL') {
      const t = setTimeout(() => setShellState(p => ({ ...p, phase: 'SHUFFLE' })), 1500);
      return () => clearTimeout(t);
    }
    if (shellState.phase === 'SHUFFLE') {
      const t = setInterval(() => {
        setShellState(p => {
          if (p.shuffleCount >= 10) {
            clearInterval(t);
            return { ...p, phase: 'GUESS' };
          }
          let newCups = [...p.cupsPositions];
          const i1 = Math.floor(Math.random() * 3);
          const i2 = Math.floor(Math.random() * 3);
          [newCups[i1], newCups[i2]] = [newCups[i2], newCups[i1]];
          return { ...p, cupsPositions: newCups, shuffleCount: p.shuffleCount + 1 };
        });
      }, 250);
      return () => clearTimeout(t);
    }
  }, [gameState, activeMinigame?.type, shellState.phase]);

  useEffect(() => {
    if (activeMinigame?.type === 'MOUSE_SHAKE' && shakeState.progress >= 100) {
      finishMinigame(true);
    }
  }, [shakeState.progress]);

  const handleMouseShake = (e) => {
    if (gameState !== 'MINIGAME' || activeMinigame?.type !== 'MOUSE_SHAKE') return;
    const { clientX, clientY } = e;
    setShakeState(prev => {
      if (prev.progress >= 100) return prev;
      if (prev.lastX === 0 && prev.lastY === 0) {
        return { ...prev, lastX: clientX, lastY: clientY };
      }
      const dx = Math.abs(clientX - prev.lastX);
      const dy = Math.abs(clientY - prev.lastY);
      const dist = dx + dy;
      const newProgress = Math.min(100, prev.progress + (dist > 5 ? dist * 0.07 : 0));
      return { progress: newProgress, lastX: clientX, lastY: clientY };
    });
  };

  useEffect(() => {
    if (activeMinigame?.failed) {
      finishMinigame(false);
    }
  }, [activeMinigame?.failed]);

  const resetGame = () => {
    setIsAutoPlaying(false);
    setIsRolling(false);
    setIsTransitioning(false);
    setPendingDecision(null);
    setIsMerchantMinimizedBox(false);
    setActiveMinigame(null);
    setActiveMonster(null);
    const cleanPlayers = INITIAL_PLAYERS.map(p => ({ ...p, money: 0, artifacts: [] }));
    setPlayers(cleanPlayers);
    setTurn(1);
    setCurrentPlayerIdx(0);
    setScenario('🌑 Entrada a la Caverna');
    setDiceResult(null);
    setMessage('La expedición aguarda tus órdenes...');
    setStats({ totalDamageTaken: 0, totalArtifactsFound: 0, totalRolls: 0 });
    setGameState('START');
  };

  if (gameState === 'START') {
    return (
      <div className="game-container" style={{ justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
        <div className="portrait-warning">
          <h2 className="death-title">GIRA TU DISPOSITIVO</h2>
          <p style={{ color: 'var(--color-neon)', fontSize: '1.2rem' }}>Este juego se disfruta mejor en horizontal ⚔️</p>
        </div>
        <motion.h1

          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="death-title flicker"
        >
          HELLCAVERN
        </motion.h1>

        <input
          type="text"
          placeholder="Tu Apodo (Ej: CazadorDeDemonios)"
          value={teamNickname}
          onChange={(e) => setTeamNickname(e.target.value)}
          style={{
            padding: '15px 20px',
            marginBottom: '30px',
            background: 'rgba(20,20,20,0.9)',
            color: 'var(--color-neon)',
            border: 'none',
            borderBottom: '3px solid var(--color-neon)',
            borderRadius: '0',
            fontFamily: 'var(--font-retro)',
            fontSize: '1.2rem',
            textAlign: 'center',
            width: '80%',
            maxWidth: '350px',
            outline: 'none',
            textTransform: 'uppercase',
            boxShadow: '0 15px 15px -15px var(--color-neon)',
            transition: 'all 0.3s'
          }}
        />

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '30px',
          alignItems: 'center',
          marginTop: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button className="btn-fate" style={{ fontSize: '1.1rem', padding: '15px 35px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={startGame}>
            <span>⚔️</span> INICIAR EXPEDICIÓN
          </button>

          <button
            className="btn-fate"
            style={{
              padding: '15px 35px',
              fontSize: '1.1rem',
              background: 'rgba(0,0,0,0.5)',
              borderColor: '#888',
              color: '#ccc',
              borderRadius: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onClick={viewHistory}
          >
            <span>📜</span> VER REGISTROS
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'HISTORY') {
    return (
      <div className="game-container" style={{ justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'center', padding: '40px', overflowY: 'auto' }}>
        <div className="portrait-warning">
          <h2 className="death-title">GIRA TU DISPOSITIVO</h2>
          <p style={{ color: 'var(--color-neon)', fontSize: '1.2rem' }}>Este juego se disfruta mejor en horizontal ⚔️</p>
        </div>
        <h2 className="death-title flicker" style={{ fontSize: '2.5rem', marginBottom: '30px', color: 'var(--color-warning)' }}>

          CRÓNICAS DE LA CAVERNA
        </h2>

        {isLoadingHistory ? (
          <p style={{ color: 'var(--color-neon)', fontFamily: 'var(--font-retro)', fontSize: '1.5rem', marginTop: '50px' }}>BUSCANDO REGISTROS EN EL ÉTER...</p>
        ) : (
          <div style={{ width: '90%', maxWidth: '800px', background: 'rgba(5,5,5,0.9)', border: '2px solid #555', borderRadius: '10px', padding: '20px', boxShadow: '0 0 20px rgba(0,0,0,0.8)' }}>
            <table style={{ width: '100%', textAlign: 'left', color: '#ddd', fontFamily: 'var(--font-main)', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #444', color: 'var(--color-warning)', fontSize: '1.1rem' }}>
                  <th style={{ padding: '15px 10px' }}>APODO</th>
                  <th style={{ padding: '15px 10px' }}>ESTADO</th>
                  <th style={{ padding: '15px 10px' }}>TURNOS</th>
                  <th style={{ padding: '15px 10px' }}>LUGAR FINAL</th>
                  <th style={{ padding: '15px 10px' }}>FECHA</th>
                </tr>
              </thead>
              <tbody>
                {matchHistory && matchHistory.length > 0 ? matchHistory.map((match, idx) => (
                  <tr key={match.id || idx} style={{ borderBottom: '1px solid #222', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '15px 10px', fontWeight: 'bold' }}>{match.nickname}</td>
                    <td style={{ padding: '15px 10px', color: match.game_state === 'VICTORY' ? '#0f0' : '#f00', fontWeight: 'bold' }}>{match.game_state === 'VICTORY' ? 'VICTORIA' : 'DERROTA'}</td>
                    <td style={{ padding: '15px 10px' }}>{match.turns_survived}</td>
                    <td style={{ padding: '15px 10px', color: '#aaa' }}>{match.final_scenario}</td>
                    <td style={{ padding: '15px 10px', fontSize: '0.9rem', color: '#888' }}>{new Date(match.created_at).toLocaleDateString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                      Las crónicas están vacías. Sé el primero en forjar tu leyenda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <button className="btn-fate" style={{ marginTop: '40px' }} onClick={() => setGameState('START')}>
          VOLVER A LA ENTRADA
        </button>
      </div>
    );
  }

  if (gameState === 'MINIGAME' && activeMinigame) {
    const currentP = players[currentPlayerIdx];
    return (
      <div className="game-container" style={{ justifyContent: 'center', flexDirection: 'column', alignItems: 'center', backgroundColor: '#000' }}>
        <div className="portrait-warning">
          <h2 className="death-title">GIRA TU DISPOSITIVO</h2>
          <p style={{ color: 'var(--color-neon)', fontSize: '1.2rem' }}>Este juego se disfruta mejor en horizontal ⚔️</p>
        </div>
        <h2 className="death-title flicker" style={{ fontSize: '2.5rem', color: 'var(--color-neon)', textAlign: 'center' }}>

          ¡DESAFÍO SORPRESA EN {scenario.toUpperCase()}!
        </h2>
        <p style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '20px' }}>Atención {currentP.name}. Recompensa: 🪙 {activeMinigame.goldReward}</p>

        <div style={{ width: '80%', maxWidth: '400px', height: '20px', backgroundColor: '#333', border: '2px solid #555', marginBottom: '40px', overflow: 'hidden' }}>
          <div style={{
            width: `${Math.min(100, Math.max(0, (activeMinigame.timeLeft / (activeMinigame.initialTime || 5000)) * 100))}%`,
            height: '100%',

            backgroundColor: activeMinigame.timeLeft > 2000 ? 'var(--color-warning)' : 'var(--color-danger)',
            transition: 'width 0.1s linear'
          }} />
        </div>

        {activeMinigame.type === 'MASH' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <p style={{ color: '#ccc', fontSize: '1.2rem' }}>¡Haz CLICK RÁPIDO para romper el cristal!</p>
            <p style={{ color: 'var(--color-warning)', fontSize: '1.5rem' }}>Poder: {minigameClicks}/10</p>
            <button
              className="btn-fate"
              style={{ fontSize: '2rem', padding: '15px 30px', borderRadius: '15px' }}
              onClick={() => {
                const newClicks = minigameClicks + 1;
                setMinigameClicks(newClicks);
                if (newClicks === 10) finishMinigame(true);
              }}
            >
              🔨 GOLPEAR
            </button>
          </div>
        )}

        {activeMinigame.type === 'HOVER_COINS' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ color: '#ccc', fontSize: '1.5rem', marginBottom: '20px' }}>¡Atrapa los Orbes Luminosos antes de que caigan! (Pasa el cursor por encima)</p>
            <div style={{ position: 'relative', width: '300px', height: '300px', border: '1px dashed #555' }}>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  onMouseEnter={() => {
                    if ((minigameClicks & (1 << i)) !== 0) return;
                    const newClicks = minigameClicks | (1 << i);
                    setMinigameClicks(newClicks);
                    if (newClicks === 7) finishMinigame(true);
                  }}
                  onTouchStart={() => {
                    if ((minigameClicks & (1 << i)) !== 0) return;
                    const newClicks = minigameClicks | (1 << i);
                    setMinigameClicks(newClicks);
                    if (newClicks === 7) finishMinigame(true);
                  }}

                  style={{
                    position: 'absolute',
                    top: `${((activeMinigame.timeLeft * [13, 19, 29][i]) % 80) + 10}%`,
                    left: `${((activeMinigame.timeLeft * [11, 17, 23][i]) % 80) + 10}%`,
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'var(--color-neon)',
                    borderRadius: '50%',
                    boxShadow: '0 0 15px var(--color-neon)',
                    display: ((minigameClicks & (1 << i)) !== 0) ? 'none' : 'block'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {activeMinigame.type === 'RIDDLE' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', maxWidth: '600px', textAlign: 'center' }}>
            <p style={{ color: '#ccc', fontSize: '1.5rem' }}>Una esfinge de azufre bloquea el camino. Tiene un cofre en sus manos. Te pide que elijas el lado en el cual brilla la ilusión.</p>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
              <button className="btn-fate" onClick={() => { if (Math.random() > 0.5) finishMinigame(true); else finishMinigame(false); }}>VERDAD IZQUIERDA</button>
              <button className="btn-fate" onClick={() => { if (Math.random() > 0.5) finishMinigame(true); else finishMinigame(false); }}>ILUSIÓN DERECHA</button>
            </div>
          </div>
        )}

        {activeMinigame.type === 'RACE' && (
          <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ color: '#ccc', fontSize: '1.5rem', textAlign: 'center', marginBottom: '20px' }}>
              {raceState.selected === null ? "RÁPIDO: Apuesta por tu Cucaracha Corredora favorita 🪳" : "¡LA CARRERA ESTÁ EN MARCHA!"}
            </p>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#222', borderRadius: '5px', height: '45px', position: 'relative' }}>
                <button
                  disabled={raceState.selected !== null}
                  onClick={() => setRaceState(prev => ({ ...prev, selected: i }))}
                  style={{
                    minWidth: '80px', padding: '10px', background: raceState.selected === i ? 'var(--color-warning)' : '#444',
                    color: raceState.selected === i ? '#000' : '#fff', border: 'none', cursor: raceState.selected === null ? 'pointer' : 'default', fontWeight: 'bold'
                  }}
                >
                  {["A", "B", "C", "D"][i]}
                </button>
                <div style={{ flex: 1, position: 'relative', height: '100%', borderLeft: '2px solid #555', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute', top: '50%', left: `calc(${raceState.positions[i]}% - 25px)`,
                    transition: 'left 0.1s linear', fontSize: '1.5rem', transform: 'translateY(-50%)', zIndex: 2
                  }}>
                    🪳
                  </div>
                  {raceState.finished && raceState.positions[i] >= 100 && (
                    <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#0f0', fontWeight: 'bold', zIndex: 1, background: 'rgba(0,0,0,0.8)', padding: '2px 5px', borderRadius: '4px' }}>
                      ¡GANADOR!
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeMinigame.type === 'SHELL' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <p style={{ color: '#ccc', fontSize: '1.5rem', textAlign: 'center' }}>
              {shellState.phase === 'REVEAL' ? "¡MIRA BIEN! Aquí está la Pepita de Oro:" :
                shellState.phase === 'SHUFFLE' ? "¡MEZCLANDO!" :
                  "¿DÓNDE ESTÁ EL ORO?"}
            </p>
            <div style={{ position: 'relative', width: '300px', height: '150px', margin: '30px 0' }}>
              {[0, 1, 2].map((cupId) => {
                const posIndex = shellState.cupsPositions[cupId];
                const isGold = shellState.goldCupId === cupId;
                return (
                  <div
                    key={cupId}
                    onClick={() => {
                      if (shellState.phase === 'GUESS') finishMinigame(isGold);
                    }}
                    style={{
                      width: '80px', height: '120px',
                      backgroundColor: '#444',
                      borderRadius: '10px 10px 0 0',
                      borderBottom: '10px solid #222',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: shellState.phase === 'GUESS' ? 'pointer' : 'default',
                      position: 'absolute',
                      top: 0,
                      left: `${posIndex * 110}px`,
                      transition: 'left 0.3s ease-in-out'
                    }}
                  >
                    <span style={{ fontSize: '3rem', opacity: (shellState.phase === 'REVEAL' && isGold) ? 1 : 0 }}>
                      🪙
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeMinigame.type === 'MOUSE_SHAKE' && (
          <div
            onMouseMove={handleMouseShake}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              handleMouseShake({ clientX: touch.clientX, clientY: touch.clientY });
            }}

            style={{ width: '100%', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#222', border: '2px dashed var(--color-danger)', cursor: 'crosshair', position: 'relative' }}
          >
            <p style={{ color: 'var(--color-danger)', fontSize: '1.2rem', marginBottom: '10px', textAlign: 'center', pointerEvents: 'none' }}>
              ¡SANGUIJUELAS DEL ABISMO!<br />¡SACUDE EL RATÓN AQUÍ ADENTRO PARA QUITARLAS!
            </p>
            <div style={{ width: '80%', height: '20px', backgroundColor: '#000', border: '1px solid #fff', pointerEvents: 'none' }}>
              <div style={{ width: `${shakeState.progress}%`, height: '100%', backgroundColor: 'var(--color-neon)' }} />
            </div>
            <p style={{ pointerEvents: 'none', marginTop: '5px', fontSize: '1rem' }}>{Math.floor(shakeState.progress)}%</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`game-container ${shakingTarget === 'all' ? 'shake-effect' : ''}`}
      style={{
        backgroundColor: SCENARIO_COLORS[scenario] || '#050505',
        display: 'flex',
        flexDirection: 'row',
        width: '100vw',
        height: '100dvh',

        overflow: 'hidden',
        position: 'relative',
        backgroundImage: `radial-gradient(circle at 50% 50%, ${SCENARIO_COLORS[scenario]}44 0%, #050505 100%)`,
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.2,
        backgroundImage: `url('https://www.transparenttextures.com/patterns/carbon-fibre.png')`,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,0.8) 100%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      <div className="left-panel">
        <div className="portrait-warning">
          <h2 className="death-title">GIRA TU DISPOSITIVO</h2>
          <p style={{ color: 'var(--color-neon)', fontSize: '1.2rem' }}>Este juego se disfruta mejor en horizontal ⚔️</p>
        </div>


        <div className="overlay-dark" />

        <header
          className="game-header retro-border"
          style={{
            zIndex: 2,
            marginTop: '10px'
          }}
        >

          <div>TURNO: {turn}</div>

          <div style={{ color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            LUGAR: {scenario.toUpperCase()}
          </div>
        </header>

        {gameState === 'COMBAT' && activeMonster && (
          <div className={`monster-arena retro-border ${shakingTarget === 'monster' ? 'shake-effect' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', minWidth: '250px' }}>
              <img
                src={ENEMY_IMAGES[activeMonster.name] || ENEMY_IMAGES['default']}
                alt={activeMonster.name}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '4px',
                  border: '1px solid #ff4444',
                  boxShadow: '0 0 10px rgba(255, 68, 68, 0.5)',
                  objectFit: 'cover'
                }}
              />
              <h2 style={{
                color: '#ff4444',
                margin: 0,
                fontSize: '1.5rem',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                textShadow: '2px 2px #000'
              }}>
                {activeMonster.name}
              </h2>
            </div>

            <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>HP:</span>
              <div className="hp-container" style={{ height: '8px', margin: 0, flexGrow: 1 }}>
                <div
                  className="hp-bar"
                  style={{
                    width: `${Math.max(0, (activeMonster.currentHp / activeMonster.hp) * 100)}%`,
                    backgroundColor: 'var(--color-danger)',
                    boxShadow: '0 0 10px var(--color-danger)'
                  }}
                />
              </div>
              <span style={{ fontSize: '1.5rem', minWidth: '40px' }}>
                {Math.max(0, activeMonster.currentHp)}/{activeMonster.hp}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', fontSize: '1.5rem', whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.7)' }}>
              <span>F:{activeMonster.str}</span>
              <span>R:{activeMonster.rob}</span>
              <span>V:{activeMonster.vel}</span>
            </div>

            <button
              className="btn-fate combat"
              onClick={executeCombatTurn}
              style={{
                padding: '2px 12px',
                fontSize: '0.65rem',
                minHeight: '30px',
                margin: 0
              }}
            >
              PELEAR
            </button>
          </div>
        )}

        <main className="players-grid"
          style={{
            zIndex: 5
          }}
        >


          {players.map((p, idx) => {
            const isTurnoVisible = idx === currentPlayerIdx && gameState !== 'COMBAT';
            const maxHPActual = 10 + (p.artifacts.filter(a => a === "💧 Gota Luz").length * 5);
            const porcentajeVida = (p.hp / maxHPActual) * 100;
            const fTotal = p.str + (p.artifacts.includes("🦴 Colmillo") ? 3 : 0) + (p.artifacts.includes("🔮 Alma Oscura") ? 7 : 0);
            const rTotal = p.rob + (p.artifacts.includes("🛡️ Armadura") ? 3 : 0) - (p.artifacts.includes("🔮 Alma Oscura") ? 1 : 0);
            const vTotal = p.vel + (p.artifacts.includes("🥾 Botas Hermes") ? 3 : 0) - (p.artifacts.includes("🔮 Alma Oscura") ? 1 : 0);

            return (
              <div
                key={p.id}
                className={`player-card retro-border ${isTurnoVisible ? 'active' : ''} ${shakingTarget === p.id ? 'shake-effect' : ''}`}
              >

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', flexWrap: 'wrap', gap: '5px' }}>
                  <img
                    src={CHARACTER_IMAGES[p.name] || CHARACTER_IMAGES['default']}
                    alt={p.name}
                    style={{
                      width: '30px',
                      height: '30px',
                      marginRight: '5px',
                      borderRadius: '50%',
                      border: '2px solid var(--color-neon)',
                      boxShadow: '0 0 5px var(--color-neon)',
                      flexShrink: 0
                    }}
                  />
                  <h3 style={{
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0px',
                    flex: '1 1 60px',
                    fontSize: '1rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {p.name}
                  </h3>


                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '6px',
                    flexShrink: 0,
                    minWidth: '80px'
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-retro)',
                      fontSize: '0.9rem',
                      color: p.hp < (maxHPActual * 0.3) ? 'red' : 'var(--color-neon)',
                      whiteSpace: 'nowrap'
                    }}>
                      {p.hp}/{maxHPActual} HP
                    </span>

                    <span style={{
                      fontFamily: 'var(--font-retro)',
                      fontSize: '0.8rem',
                      color: '#ffd700',
                      textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '4px',
                      lineHeight: 1
                    }}>
                      <span style={{
                        fontSize: '0.9rem',
                        display: 'inline-block',
                        transform: 'translateY(-3px)'
                      }}>
                        🪙
                      </span>
                      {p.money || 0}
                    </span>
                  </div>
                </div>

                <div style={{ margin: '5px 0' }} className="hide-on-mobile">
                  <p style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    color: 'var(--color-warning)',
                    opacity: 0.8,
                    fontStyle: 'italic'
                  }}>
                    {p.title}
                  </p>
                </div>


                <div className="hp-container">
                  <div
                    className="hp-bar"
                    style={{
                      width: `${Math.max(0, porcentajeVida)}%`,
                      backgroundColor: p.hp < (maxHPActual * 0.3) ? 'red' : '#0f0',
                      transition: 'width 0.5s ease-in-out',
                      boxShadow: p.hp < (maxHPActual * 0.3) ? '0 0 10px red' : '0 0 10px #0f0'
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '15px',
                  marginTop: '12px',
                  fontSize: '1.2rem',
                  fontFamily: 'var(--font-main)',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  paddingTop: '8px',
                  letterSpacing: '0.5px'
                }}>
                  <div style={{ color: '#ff4444', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ opacity: 0.8 }}>FUE:</span>
                    <span style={{ fontWeight: 'bold' }}>{fTotal}</span>
                  </div>

                  <div style={{ color: '#44ff44', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ opacity: 0.8 }}>ROB:</span>
                    <span style={{ fontWeight: 'bold' }}>{rTotal}</span>
                  </div>

                  <div style={{ color: '#4444ff', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ opacity: 0.8 }}>VEL:</span>
                    <span style={{ fontWeight: 'bold' }}>{vTotal}</span>
                  </div>
                </div>

                <div style={{
                  fontSize: '0.8rem',
                  color: '#666',
                  marginTop: '8px',
                  textTransform: 'uppercase',
                  borderTop: '1px dotted #333',
                  paddingTop: '5px'
                }}>
                  EQUIPO: {p.artifacts.join(' | ') || 'VACÍO'}
                </div>
                {gameState === 'COMBAT' && (
                  <div style={{ display: 'flex', gap: '5px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {p.artifacts.includes("🧪 Vial Ácido") && (
                      <button className="btn-artifact" onClick={() => handleUseArtifact(p.id, "🧪 Vial Ácido")}>
                        USAR VIAL (10 DMG)
                      </button>
                    )}
                    {p.artifacts.includes("🕸️ Seda") && (
                      <button className="btn-artifact" onClick={() => handleUseArtifact(p.id, "🕸️ Seda")}>
                        USAR SEDA (STUN)
                      </button>
                    )}
                    {p.artifacts.includes("🌿 Loto Negro") && (
                      <button className="btn-artifact" onClick={() => handleUseArtifact(p.id, "🌿 Loto Negro")}>
                        USAR LOTO (-3 STATS)
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </main>

        <footer className="game-console retro-border">
          <div className="dice-section">
            {isRolling ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.5 }}>
                🎲
              </motion.div>
            ) : (
              <span style={{ color: 'var(--color-neon)' }}>{diceResult || '?'}</span>
            )}
          </div>

          <div className="message-section">
            <div style={{ fontSize: '1.2rem', color: 'var(--color-warning)', marginBottom: '5px', letterSpacing: '2px' }}>
              LOCALIZACIÓN: {scenario.toUpperCase()}
            </div>

            <motion.p
              key={message}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ margin: 0 }}
            >
              {message}
            </motion.p>
          </div>
        </footer>

        <div style={{ display: 'flex', gap: '15px', marginTop: '10px', alignItems: 'center', justifyContent: 'center' }}>
          <button
            className="btn-fate"
            onClick={resetGame}
            title="Abandonar exploración"
            style={{
              padding: '12px 20px',
              margin: '0',
              background: 'rgba(40,0,0,0.8)',
              borderColor: 'var(--color-danger)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span>🚪</span> RENDIRSE
          </button>

          <button
            className={`btn-fate ${isRolling || isTransitioning || gameState === 'COMBAT' ? 'disabled-btn' : ''}`}
            onClick={rollDice}
            disabled={isRolling || isTransitioning || gameState === 'COMBAT' || pendingDecision || isAutoPlaying}
            style={{
              margin: '0',
              cursor: isRolling ? 'wait' : 'crosshair',
              flex: 1
            }}
          >
            {isRolling ? "INVOCANDO..." : "LANZAR DADOS"}
          </button>

          <button
            className="btn-fate"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            style={{
              padding: '12px',
              margin: '0',
              background: isAutoPlaying ? 'var(--color-neon)' : 'rgba(0,0,0,0.8)',
              color: isAutoPlaying ? '#000' : 'var(--color-neon)',
              borderColor: 'var(--color-neon)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isAutoPlaying ? '0 0 15px var(--color-neon)' : 'none'
            }}
            title="Auto-Play"
          >
            {isAutoPlaying ? "⏸️" : "⏩"}
          </button>
        </div>
      </div>

      <div className="right-panel" style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a', // Un gris oscuro para notar si la imagen (que es negra) carga
        overflow: 'hidden',
        minHeight: '100dvh' // Asegura que tenga altura

      }}>

        {/* Imagen de Fondo del Escenario con Transición */}
        <motion.div
          key={scenario}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("${SCENARIO_IMAGES[scenario] || SCENARIO_IMAGES['default']}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 1
          }}
        />
        {/* 2. CAPA DE ATMÓSFERA ÚNICA (Z-INDEX 2) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, rgba(0,0,0,0) 20%, rgba(0,0,0,0.8) 100%)',
          pointerEvents: 'none',
          zIndex: 2
        }} />

        {/* 3. EFECTO DE REJILLA/SCANLINE (Z-INDEX 3) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundImage: `url('https://www.transparenttextures.com/patterns/carbon-fibre.png')`,
          pointerEvents: 'none',
          zIndex: 3
        }} />

        {/* Contenedor vacío o para elementos de UI superpuestos si lo necesitas en el futuro */}
        <div style={{ position: 'relative', zIndex: 4 }}>
          {/* Aquí podrías poner, por ejemplo, el sprite del monstruo si quisieras */}
        </div>

        {/* Merchant Overlay Container */}
        {scenario === '💰 Puesto del Mercader' && gameState !== 'GAMEOVER' && gameState !== 'START' && gameState !== 'HISTORY' && gameState !== 'MINIGAME' && (
          <div style={{
            position: 'absolute', bottom: '0', left: '0', right: '0',
            zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}>
            {isMerchantMinimizedBox ? (
              <button
                onClick={() => setIsMerchantMinimizedBox(false)}
                style={{
                  backgroundColor: 'rgba(50,30,0,0.9)', color: 'var(--color-warning)', padding: '10px 20px',
                  border: '1px solid var(--color-warning)', borderBottom: 'none', borderRadius: '10px 10px 0 0',
                  cursor: 'pointer', fontFamily: 'var(--font-retro)'
                }}
              >
                ⛺ ABRIR TIENDA DEL MERCADER
              </button>
            ) : (
              <div style={{
                width: '100%', height: '170px', background: 'linear-gradient(to top, rgba(20,10,0,0.99), rgba(20,10,0,0.85) 70%, transparent)',
                borderTop: '2px dashed var(--color-warning)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '20px', position: 'relative'
              }}>
                <button
                  onClick={() => setIsMerchantMinimizedBox(true)}
                  style={{
                    position: 'absolute', top: '12px', right: '12px', width: '24px', height: '24px',
                    backgroundColor: 'transparent', border: '1px solid var(--color-warning)', color: 'var(--color-warning)',
                    cursor: 'pointer', fontFamily: 'var(--font-retro)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem'
                  }}
                  title="Cerrar tienda"
                >
                  X
                </button>
                <h3 style={{ color: 'var(--color-warning)', fontSize: '1.4rem', marginBottom: '12px', textShadow: '0 0 10px #000', letterSpacing: '1px' }}>
                  ⛺ Mercader Ancestral — {players[currentPlayerIdx].name}
                </h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="btn-fate"
                    onClick={() => buyItem('FRAGMENT')}
                    disabled={isRolling || isTransitioning}
                    style={{ background: 'rgba(50,50,0,0.8)', borderColor: 'var(--color-warning)', fontSize: '0.7rem', padding: '8px 14px', ...((isRolling || isTransitioning) ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}
                  >
                    ✨ Fragmento Estelar (20 🪙)
                  </button>
                  <button
                    className="btn-fate"
                    onClick={() => buyItem('MYSTERY')}
                    disabled={isRolling || isTransitioning}
                    style={{ background: 'rgba(0,40,60,0.8)', borderColor: '#0ff', fontSize: '0.7rem', padding: '8px 14px', ...((isRolling || isTransitioning) ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}
                  >
                    ⚡ Brebaje Ancestral (12 🪙)
                  </button>
                  <button
                    className="btn-fate"
                    onClick={() => buyItem('HEAL')}
                    disabled={isRolling || isTransitioning}
                    style={{ background: 'rgba(0,50,0,0.8)', borderColor: '#0f0', fontSize: '0.7rem', padding: '8px 14px', ...((isRolling || isTransitioning) ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}
                  >
                    💚 Pócima +5HP (5 🪙)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- BOTÓN DE MÚSICA: ANCLADO A LA DERECHA ABSOLUTA --- */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="btn-music"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 5000,     // El valor más alto para que nada lo tape
            background: isMuted ? '#333' : '#004400',
            border: '2px solid var(--color-neon)',
            padding: '12px',
            cursor: 'pointer',
            borderRadius: '50%',
            boxShadow: isMuted ? 'none' : '0 0 15px var(--color-neon)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50px',
            height: '50px'
          }}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>

      </div>

      <AnimatePresence>
        {pendingDecision && (
          <motion.div
            drag
            dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
            initial={{ scale: 0.8, opacity: 0, x: '-50%', y: '-50%' }}
            animate={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }}
            className="retro-border"
            style={{
              position: 'fixed',
              top: '40%',
              left: '50%',
              backgroundColor: 'rgba(20, 0, 30, 0.95)',
              padding: '20px',
              zIndex: 9999,
              width: '85%',
              maxWidth: '500px',
              textAlign: 'center',
              border: '2px solid var(--color-warning)',
              boxShadow: '0 0 50px rgba(0,0,0,0.9)',
              cursor: 'grab'
            }}
            whileDrag={{ cursor: 'grabbing', scale: 1.02 }}
          >
            {/* Un pequeño indicador visual para que el usuario sepa que puede arrastrar desde arriba */}
            <div style={{
              width: '40px',
              height: '4px',
              background: 'rgba(255,255,255,0.2)',
              margin: '0 auto 10px',
              borderRadius: '2px'
            }} />

            <h2 style={{
              color: 'var(--color-warning)',
              fontFamily: 'var(--font-retro)',
              fontSize: '0.8rem',
              pointerEvents: 'none' // Para que el texto no interfiera con el arrastre
            }}>
              {pendingDecision.title}
            </h2>

            <p style={{ margin: '15px 0', fontSize: '1.1rem', color: '#fff', pointerEvents: 'none' }}>
              {pendingDecision.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <button
                className="btn-artifact"
                onClick={() => handleDecision(true)}
                style={{ borderColor: '#0f0', color: '#0f0' }}
              >
                ACEPTAR
              </button>
              <button
                className="btn-artifact"
                onClick={() => handleDecision(false)}
                style={{ borderColor: '#f00', color: '#f00' }}
              >
                RECHAZAR
              </button>
            </div>
          </motion.div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="game-over-screen">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="retro-border"
              style={{ padding: '40px', maxWidth: '600px', backgroundColor: 'rgba(20,0,0,0.95)' }}
            >
              <h2 className="death-title flicker">EXPEDICIÓN FALLIDA</h2>

              <div style={{ textAlign: 'left', borderTop: '2px solid #555', paddingTop: '20px' }}>
                <p style={{ color: 'var(--color-danger)', marginBottom: '20px', fontSize: '1.2rem' }}>
                  <strong>DETALLES DEL DECESO:</strong> <br />
                  <span style={{ color: '#fff' }}>{deathCause}</span>
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', color: '#aaa' }}>
                  <div className="stat-item">
                    <span style={{ color: 'var(--color-neon)' }}>TURNOS SOBREVIVIDOS:</span> {turn}
                  </div>
                  <div className="stat-item">
                    <span style={{ color: 'var(--color-neon)' }}>DADOS LANZADOS:</span> {stats.totalRolls}
                  </div>
                  <div className="stat-item">
                    <span style={{ color: 'var(--color-neon)' }}>ARTEFACTOS TOTALES:</span> {players.reduce((a, b) => a + b.artifacts.length, 0)}
                  </div>
                  <div className="stat-item">
                    <span style={{ color: 'var(--color-neon)' }}>LUGAR FINAL:</span> {scenario}
                  </div>
                </div>
              </div>

              <button className="btn-fate" onClick={resetGame} style={{ marginTop: '30px' }}>
                REINTENTAR SIMULACIÓN
              </button>
            </motion.div>
          </div>
        )}

        {gameState === 'VICTORY' && (
          <div className="game-over-screen" style={{ background: 'rgba(0, 20, 0, 0.95)' }}>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="retro-border"
              style={{ padding: '40px', textAlign: 'center', borderColor: '#0f0' }}
            >
              <h2 className="death-title flicker" style={{ color: '#0f0', textShadow: '0 0 10px #0f0' }}>
                ¡LIBERACIÓN!
              </h2>
              <p style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '20px' }}>
                {deathCause}
              </p>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✨✨✨</div>
              <div style={{ color: '#aaa', marginBottom: '30px' }}>
                Turnos totales: {turn} | Dados lanzados: {stats.totalRolls}
              </div>
              <button className="btn-fate" onClick={resetGame}>VOLVER A LA SUPERFICIE</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;