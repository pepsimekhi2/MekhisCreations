import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Clock, Gamepad2 } from "lucide-react";

interface Game {
  id: number;
  name: string;
  description?: string;
  playing?: number;
  visits?: number;
  created?: string;
  updated?: string;
  icon?: string;
}

const GamesSection = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(
          "https://mekhis-creations-main.vercel.app/api/games?groupId=33719761"
        );
        const data = await response.json();
        setGames(data.data || []);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <section id="games" className="relative py-16 md:py-24">
      <div className="container px-6">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Gamepad2 className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Our Portfolio</span>
          </motion.div>
          <h2 className="section-title mb-4">Featured Games</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Explore our collection of Roblox experiences crafted with passion and creativity
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-4 animate-pulse">
                <div className="aspect-video bg-muted rounded-lg mb-4" />
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : games.length === 0 ? (
          <motion.div 
            className="glass-card p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Gamepad2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No games found</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {games.map((game, index) => (
              <GameCard key={game.id} game={game} formatNumber={formatNumber} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const GameCard = ({
  game,
  formatNumber,
  index,
}: {
  game: Game;
  formatNumber: (num: number) => string;
  index: number;
}) => (
  <motion.a
    href={`https://www.roblox.com/games/${game.id}`}
    target="_blank"
    rel="noopener noreferrer"
    className="glass-card overflow-hidden group block"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -6, scale: 1.02 }}
  >
    <div className="relative aspect-video overflow-hidden">
      {game.icon ? (
        <img
          src={game.icon}
          alt={game.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Gamepad2 className="w-12 h-12 text-muted-foreground" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      
      {/* Playing badge */}
      {game.playing !== undefined && game.playing > 0 && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-white text-xs font-semibold shadow-lg">
          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
          {formatNumber(game.playing)} playing
        </div>
      )}
    </div>

    <div className="p-4 md:p-5">
      <h3 className="font-display text-base md:text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
        {game.name}
      </h3>
      
      {game.description && (
        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-4">
          {game.description}
        </p>
      )}

      <div className="flex items-center gap-4 pt-3 md:pt-4 border-t border-border/50">
        {game.visits !== undefined && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>{formatNumber(game.visits)} visits</span>
          </div>
        )}
        {game.updated && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>Updated {new Date(game.updated).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  </motion.a>
);

export default GamesSection;
