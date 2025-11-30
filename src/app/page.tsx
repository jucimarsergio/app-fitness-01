      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-r from-blue-600 to-green-600 shadow-md">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center border-2 border-white shadow-lg">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight border-2 border-white px-3 py-1 rounded-lg bg-gradient-to-r from-white/20 to-white/10 shadow-md">
                Fitness Connect
              </h1>
              <p className="text-lg font-bold text-white tracking-tight">
                Seu Treino, Seu Tempo
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/20">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </header>