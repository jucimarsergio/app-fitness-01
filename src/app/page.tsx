"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Clock, Star, User, X, Check, Dumbbell, Heart, Zap, Wind, Target, Activity, Send, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

// Types
interface Trainer {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
  rating: number;
  pricePerHour: number;
  distance: number;
  lat: number;
  lng: number;
}

interface ChatMessage {
  id: string;
  sender: "user" | "trainer";
  message: string;
  timestamp: Date;
}

type ExerciseType = "Musculação" | "Cardio" | "HIIT" | "Yoga" | "CrossFit" | "Pilates";

// Mock data
const mockTrainers: Trainer[] = [
  {
    id: "1",
    name: "Carlos Silva",
    avatar: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=400&fit=crop",
    specialties: ["Musculação", "HIIT"],
    rating: 4.9,
    pricePerHour: 70,
    distance: 1.2,
    lat: -23.550520 + 0.01,
    lng: -46.633308 + 0.01
  },
  {
    id: "2",
    name: "Ana Costa",
    avatar: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop",
    specialties: ["Yoga", "Pilates"],
    rating: 4.8,
    pricePerHour: 60,
    distance: 2.5,
    lat: -23.550520 + 0.02,
    lng: -46.633308 - 0.01
  },
  {
    id: "3",
    name: "Rafael Mendes",
    avatar: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop",
    specialties: ["CrossFit", "Força"],
    rating: 4.7,
    pricePerHour: 80,
    distance: 0.8,
    lat: -23.550520 - 0.01,
    lng: -46.633308 + 0.02
  }
];

const exerciseTypes: { type: ExerciseType; icon: any; color: string }[] = [
  { type: "Musculação", icon: Dumbbell, color: "bg-blue-500" },
  { type: "Cardio", icon: Heart, color: "bg-red-500" },
  { type: "HIIT", icon: Zap, color: "bg-yellow-500" },
  { type: "Yoga", icon: Wind, color: "bg-purple-500" },
  { type: "CrossFit", icon: Target, color: "bg-orange-500" },
  { type: "Pilates", icon: Activity, color: "bg-green-500" }
];

export default function FitnessApp() {
  const [searchState, setSearchState] = useState<"idle" | "selecting" | "searching" | "found" | "arriving">("idle");
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType | null>(null);
  const [duration, setDuration] = useState<number>(60);
  const [trainerProgress, setTrainerProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(5);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Simulação de busca de personal
  useEffect(() => {
    if (searchState === "searching") {
      const timer = setTimeout(() => {
        const randomTrainer = mockTrainers[Math.floor(Math.random() * mockTrainers.length)];
        setSelectedTrainer(randomTrainer);
        setSearchState("found");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [searchState]);

  // Simulação de chegada do personal
  useEffect(() => {
    if (searchState === "arriving") {
      const interval = setInterval(() => {
        setTrainerProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
        setEstimatedTime(prev => Math.max(0, prev - 0.1));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [searchState]);

  // Auto scroll do chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Mensagem automática do personal quando aceito
  useEffect(() => {
    if (searchState === "arriving" && chatMessages.length === 0) {
      setTimeout(() => {
        setChatMessages([{
          id: "1",
          sender: "trainer",
          message: "Olá! Estou a caminho. Chegarei em aproximadamente 5 minutos. Já está preparado para o treino?",
          timestamp: new Date()
        }]);
      }, 1000);
    }
  }, [searchState]);

  const handleStartSelection = () => {
    setSearchState("selecting");
  };

  const handleSelectExercise = (exercise: ExerciseType) => {
    setSelectedExercise(exercise);
  };

  const handleSearchTrainer = () => {
    if (selectedExercise && duration > 0) {
      setSearchState("searching");
      setTrainerProgress(0);
      setEstimatedTime(5);
    }
  };

  const handleAcceptTrainer = () => {
    setSearchState("arriving");
  };

  const handleCancelSearch = () => {
    setSearchState("idle");
    setSelectedTrainer(null);
    setSelectedExercise(null);
    setDuration(60);
    setTrainerProgress(0);
    setShowChat(false);
    setChatMessages([]);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      message: newMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage("");

    // Simular resposta do personal
    setTimeout(() => {
      const responses = [
        "Perfeito! Vou levar os equipamentos necessários.",
        "Entendido! Estou quase chegando.",
        "Ótimo! Vamos fazer um treino incrível hoje!",
        "Pode deixar! Já estou preparado para isso.",
        "Combinado! Nos vemos em breve."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const trainerMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "trainer",
        message: randomResponse,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, trainerMessage]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Mapa simulado com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
        {/* Grid de ruas simulado */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full h-px bg-gray-400" style={{ top: `${i * 5}%` }} />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full w-px bg-gray-400" style={{ left: `${i * 5}%` }} />
          ))}
        </div>

        {/* Marcador de origem (usuário) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            <div className="w-4 h-4 bg-black rounded-full border-4 border-white shadow-lg" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black/10 rounded-full animate-ping" />
          </div>
        </div>

        {/* Rota animada quando personal está a caminho */}
        {searchState === "arriving" && selectedTrainer && (
          <>
            {/* Linha da rota */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
              </defs>
              <path
                d="M 20% 20% Q 50% 50% 50% 50%"
                stroke="url(#routeGradient)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="10,5"
                className="animate-pulse"
              />
            </svg>

            {/* Marcador do personal (animado) */}
            <div 
              className="absolute transition-all duration-1000 ease-linear z-20"
              style={{
                top: `${20 + (trainerProgress * 0.3)}%`,
                left: `${20 + (trainerProgress * 0.3)}%`
              }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-yellow-400 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                  <Navigation className="w-6 h-6 text-black" />
                </div>
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap">
                  {Math.ceil(estimatedTime)} min
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-30 bg-white shadow-md">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center border-2 border-black shadow-lg">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-700 tracking-tight border-2 border-black px-3 py-1 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 shadow-md">
                Fitness Connect
              </h1>
              <p className="text-lg font-bold text-slate-700 tracking-tight">
                Seu Treino, Seu Tempo
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Estado: Idle - Botão inicial */}
      {searchState === "idle" && (
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <MapPin className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Sua localização</p>
                <p className="font-semibold text-black">Av. Paulista, 1000 - São Paulo</p>
              </div>
            </div>

            <Button 
              onClick={handleStartSelection}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-6 text-lg rounded-xl shadow-lg"
            >
              Solicitar Personal Trainer
            </Button>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600">Rápido</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-xs text-gray-600">Avaliados</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-xs text-gray-600">Próximos</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estado: Selecting - Escolher exercício e duração */}
      {searchState === "selecting" && (
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-black">Configure seu treino</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleCancelSearch}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Seleção de tipo de exercício */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Tipo de exercício
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {exerciseTypes.map(({ type, icon: Icon, color }) => (
                  <button
                    key={type}
                    onClick={() => handleSelectExercise(type)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedExercise === type
                        ? "border-yellow-400 bg-yellow-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-black">{type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Seleção de duração */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Duração da aula
              </h3>
              
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="text-center">
                  <div className="text-5xl font-black text-black mb-1">
                    {duration}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">minutos</div>
                </div>

                <Slider
                  value={[duration]}
                  onValueChange={(value) => setDuration(value[0])}
                  min={15}
                  max={120}
                  step={15}
                  className="w-full"
                />

                <div className="flex justify-between text-xs text-gray-500">
                  <span>15 min</span>
                  <span>60 min</span>
                  <span>120 min</span>
                </div>
              </div>

              {/* Sugestões rápidas */}
              <div className="flex gap-2">
                {[15, 30, 45, 60, 90].map((time) => (
                  <button
                    key={time}
                    onClick={() => setDuration(time)}
                    className={`flex-1 py-2 px-2 rounded-lg text-sm font-semibold transition-all ${
                      duration === time
                        ? "bg-yellow-400 text-black"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {time}min
                  </button>
                ))}
              </div>
            </div>

            {/* Resumo e confirmação */}
            {selectedExercise && (
              <Card className="border-2 border-yellow-400 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Você selecionou</p>
                      <p className="text-lg font-bold text-black">{selectedExercise}</p>
                      <p className="text-sm text-gray-600 mt-1">{duration} minutos de treino</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-black">
                        R$ {Math.round((duration / 60) * 70)}
                      </p>
                      <p className="text-xs text-gray-600">estimado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button 
              onClick={handleSearchTrainer}
              disabled={!selectedExercise || duration === 0}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-6 text-lg rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buscar Personal Trainer
            </Button>
          </div>
        </div>
      )}

      {/* Estado: Searching - Buscando personal */}
      {searchState === "searching" && (
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-black">Buscando personal...</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleCancelSearch}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center justify-center py-8">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Navigation className="w-10 h-10 text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2 text-center">
              <p className="text-gray-600">Procurando profissionais especializados em</p>
              <p className="text-lg font-bold text-black">{selectedExercise}</p>
              <p className="text-sm text-gray-500">próximos à sua localização</p>
            </div>
          </div>
        </div>
      )}

      {/* Estado: Found - Personal encontrado */}
      {searchState === "found" && selectedTrainer && (
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-black">Personal encontrado!</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleCancelSearch}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <Card className="border-2 border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 border-2 border-yellow-400">
                    <AvatarImage src={selectedTrainer.avatar} alt={selectedTrainer.name} />
                    <AvatarFallback className="bg-yellow-400 text-black font-bold">
                      {selectedTrainer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-black">{selectedTrainer.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-sm">{selectedTrainer.rating}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{selectedTrainer.distance} km</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {selectedTrainer.specialties.map((spec, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-black">R$ {Math.round((duration / 60) * selectedTrainer.pricePerHour)}</p>
                    <p className="text-xs text-gray-500">{duration} min</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                onClick={handleCancelSearch}
                className="py-6 border-2 border-gray-300 hover:bg-gray-50"
              >
                Recusar
              </Button>
              <Button 
                onClick={handleAcceptTrainer}
                className="py-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
              >
                Aceitar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Estado: Arriving - Personal a caminho */}
      {searchState === "arriving" && selectedTrainer && (
        <>
          {/* Chat em tempo real */}
          {showChat && (
            <div className="absolute bottom-24 left-4 right-4 z-40 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 max-h-[60vh] flex flex-col">
              {/* Header do chat */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border-2 border-yellow-400">
                    <AvatarImage src={selectedTrainer.avatar} alt={selectedTrainer.name} />
                    <AvatarFallback className="bg-yellow-400 text-black font-bold text-sm">
                      {selectedTrainer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-black text-sm">{selectedTrainer.name}</h3>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                      Online
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowChat(false)}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        msg.sender === "user"
                          ? "bg-yellow-400 text-black"
                          : "bg-gray-100 text-black"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input de mensagem */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 rounded-full border-2 border-gray-200 focus:border-yellow-400"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    className="rounded-full bg-yellow-400 hover:bg-yellow-500 text-black"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-black">Personal a caminho</h2>
                  <p className="text-sm text-gray-600">Chegando em {Math.ceil(estimatedTime)} minutos</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleCancelSearch}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Barra de progresso */}
              <div className="space-y-2">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 transition-all duration-300 ease-linear"
                    style={{ width: `${trainerProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Saiu para encontro</span>
                  <span>{trainerProgress.toFixed(0)}%</span>
                  <span>Chegou</span>
                </div>
              </div>

              <Card className="border-2 border-yellow-400 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-14 h-14 border-2 border-yellow-400">
                      <AvatarImage src={selectedTrainer.avatar} alt={selectedTrainer.name} />
                      <AvatarFallback className="bg-yellow-400 text-black font-bold">
                        {selectedTrainer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h3 className="font-bold text-black">{selectedTrainer.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{selectedTrainer.rating}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{selectedExercise} • {duration} min</p>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="rounded-full"
                        onClick={() => setShowChat(!showChat)}
                      >
                        <MessageSquare className="w-5 h-5" />
                      </Button>
                      <Button size="icon" className="rounded-full bg-yellow-400 hover:bg-yellow-500 text-black">
                        <Phone className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {trainerProgress >= 100 && (
                <div className="bg-green-50 border-2 border-green-400 rounded-xl p-4 text-center">
                  <Check className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <h3 className="font-bold text-green-900 text-lg">Personal chegou!</h3>
                  <p className="text-sm text-green-700 mt-1">Seu treino de {selectedExercise} pode começar agora</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Ícones adicionais necessários
function MessageSquare({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}
