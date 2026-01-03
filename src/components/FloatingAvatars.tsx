import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Member {
  user?: {
    userId: number;
    username: string;
    displayName: string;
  };
  thumbnailUrl: string;
}

const FloatingAvatars = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [positions, setPositions] = useState<Array<{ x: number; y: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(
          "https://mekhis-creations-main.vercel.app/api/members?groupId=33719761"
        );
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          const shuffled = data.data.sort(() => 0.5 - Math.random()).slice(0, 20);
          setMembers(shuffled);
          
          // Generate random positions for each avatar
          const newPositions = shuffled.map(() => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 2,
            duration: 4 + Math.random() * 4,
          }));
          setPositions(newPositions);
        }
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };

    fetchMembers();
  }, []);

  if (members.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {members.map((member, index) => {
        const pos = positions[index];
        if (!pos || !member.thumbnailUrl) return null;

        return (
          <motion.img
            key={member.user?.userId || index}
            src={member.thumbnailUrl}
            alt=""
            className="absolute w-14 h-14 md:w-16 md:h-16 floating-avatar opacity-15 dark:opacity-25"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: pos.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: pos.delay,
            }}
          />
        );
      })}
    </div>
  );
};

export default FloatingAvatars;
