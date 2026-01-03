import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Gamepad2, Star } from "lucide-react";

interface GroupData {
  name: string;
  description: string;
  memberCount: number;
  shout?: {
    body: string;
    poster: {
      userId: number;
      username: string;
      displayName: string;
    };
  };
}

const HeroSection = () => {
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [gamesCount, setGamesCount] = useState(0);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await fetch(
          "https://mekhis-creations-main.vercel.app/api/group?groupId=33719761"
        );
        const data = await response.json();
        setGroupData(data);
      } catch (error) {
        console.error("Failed to fetch group data:", error);
      }
    };

    const fetchGamesCount = async () => {
      try {
        const response = await fetch(
          "https://mekhis-creations-main.vercel.app/api/games?groupId=33719761"
        );
        const data = await response.json();
        setGamesCount(data.data?.length || 0);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      }
    };

    fetchGroupData();
    fetchGamesCount();
  }, []);

  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 -left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary/10 dark:bg-primary/20 rounded-full blur-[100px] md:blur-[120px]"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-accent/10 dark:bg-accent/15 rounded-full blur-[80px] md:blur-[100px]"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="container relative z-10 px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 md:mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Star className="w-4 h-4 text-accent" />
              <span className="text-xs md:text-sm text-muted-foreground">Roblox Development Group</span>
            </motion.div>

            <motion.h1 
              className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl mb-4 md:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <span className="gradient-text">Mekhis</span>
              <br />
              <span className="text-foreground">Creations</span>
            </motion.h1>

            <motion.p
              className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 md:mb-12 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {groupData?.description || "Creating amazing Roblox experiences for players worldwide. Join our community and explore our games!"}
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-3 md:gap-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <StatCard
              icon={<Users className="w-5 h-5 md:w-6 md:h-6" />}
              value={groupData?.memberCount || 0}
              label="Members"
            />
            <StatCard
              icon={<Gamepad2 className="w-5 h-5 md:w-6 md:h-6" />}
              value={gamesCount}
              label="Games"
            />
            <StatCard
              icon={<Star className="w-5 h-5 md:w-6 md:h-6" />}
              value="Active"
              label="Development"
              isText
            />
          </motion.div>

          {/* Shout */}
          {groupData?.shout?.body && (
            <motion.div
              className="mt-10 md:mt-12 glass-card p-5 md:p-6 max-w-2xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Latest Announcement
                </span>
              </div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {groupData.shout.body}
              </p>
              {groupData.shout.poster && (
                <p className="text-xs text-muted-foreground/60 mt-3">
                  — {groupData.shout.poster.displayName}
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

const StatCard = ({
  icon,
  value,
  label,
  isText = false,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  isText?: boolean;
}) => (
  <motion.div
    className="glass-card p-4 md:p-6 text-center group cursor-default"
    whileHover={{ y: -4, scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 text-primary mb-3 md:mb-4 group-hover:bg-primary/20 transition-colors">
      {icon}
    </div>
    <div className={isText ? "font-display text-lg md:text-2xl text-foreground" : "font-display text-2xl sm:text-4xl md:text-5xl gradient-text"}>
      {typeof value === "number" ? value.toLocaleString() : value}
    </div>
    <div className="text-xs md:text-sm text-muted-foreground mt-1">{label}</div>
  </motion.div>
);

export default HeroSection;
