import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, ExternalLink, Crown } from "lucide-react";

interface Owner {
  userId: number;
  username: string;
  displayName: string;
}

interface GroupData {
  name: string;
  owner: Owner;
  memberCount: number;
}

const CommunitySection = () => {
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [ownerAvatar, setOwnerAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await fetch(
          "https://mekhis-creations-main.vercel.app/api/group?groupId=33719761"
        );
        const data = await response.json();
        setGroupData(data);

        // Fetch owner avatar
        if (data.owner?.userId) {
          const userResponse = await fetch(
            `https://mekhis-creations-main.vercel.app/api/userdata?userId=${data.owner.userId}`
          );
          const userData = await userResponse.json();
          setOwnerAvatar(userData.headshot);
        }
      } catch (error) {
        console.error("Failed to fetch group data:", error);
      }
    };

    fetchGroupData();
  }, []);

  return (
    <section id="community" className="relative py-16 md:py-24">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[300px] md:h-[400px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[80px] md:blur-[100px]" />
      </div>

      <div className="container relative z-10 px-6">
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
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Our Community</span>
          </motion.div>
          <h2 className="section-title mb-4">Join the Team</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Be part of an amazing community of Roblox developers and players
          </p>
        </motion.div>

        <div className="max-w-xl mx-auto">
          <motion.div
            className="glass-card p-6 md:p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.01 }}
          >
            {/* Owner section */}
            {groupData?.owner && (
              <motion.a
                href={`https://www.roblox.com/users/${groupData.owner.userId}/profile`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 mb-6 group hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative">
                  {ownerAvatar ? (
                    <img
                      src={ownerAvatar}
                      alt={groupData.owner.displayName}
                      className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-primary/30"
                    />
                  ) : (
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-muted flex items-center justify-center">
                      <Users className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-accent flex items-center justify-center shadow-lg">
                    <Crown className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-primary uppercase tracking-wider mb-1">
                    Group Owner
                  </div>
                  <div className="font-display text-base md:text-lg text-foreground truncate">
                    {groupData.owner.displayName}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground truncate">
                    @{groupData.owner.username}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </motion.a>
            )}

            {/* Member count */}
            <div className="text-center py-6 md:py-8 border-b border-border/50 mb-6 md:mb-8">
              <div className="font-display text-4xl md:text-5xl gradient-text mb-2">
                {groupData?.memberCount?.toLocaleString() || "—"}
              </div>
              <div className="text-muted-foreground text-sm md:text-base">Community Members</div>
            </div>

            {/* Join button */}
            <motion.a
              href="https://www.roblox.com/groups/33719761"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow block w-full text-center bg-gradient-to-r from-primary to-primary/90 text-white py-3 md:py-4 rounded-xl font-display text-base md:text-lg"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Join Mekhis Creations
            </motion.a>

            <p className="text-center text-xs md:text-sm text-muted-foreground mt-4">
              Opens Roblox group page
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
