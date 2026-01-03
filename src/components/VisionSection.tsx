import { motion } from "framer-motion";
import { Eye, Check } from "lucide-react";

const VisionSection = () => {
  const principles = [
    "Free-to-play and paying players share the exact same fair ground",
    "Skill, strategy, and effort always matter more than Robux",
    "Paid options are bonuses, never requirements",
    "Full game experience accessible to all players",
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Gradient orbs */}
      <div className="absolute top-1/2 -left-1/4 w-[400px] md:w-[500px] h-[400px] md:h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px] md:blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-accent/5 dark:bg-accent/10 rounded-full blur-[80px] md:blur-[100px]" />

      <div className="container relative z-10 px-6">
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 border-primary/30"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Eye className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">Our Mission</span>
          </motion.div>
          <h2 className="section-title">Our Vision</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          {/* Vision text card */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div 
              className="relative glass-card p-6 md:p-8 h-full"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Our Vision is to create Roblox games where free‑to‑play and paying players share the exact same fair ground, so there is never any need to spend money just to be equal to others. In our games, skill, strategy, and effort always matter more than how much Robux someone has, and any paid option is designed as a bonus, not a requirement.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm md:text-base">
                Free players will always be able to experience the full game and reach the same power, progression, and content as paying players, even if it takes more time or dedication. Paying for products is only there to offer cosmetics, convenience, and optional shortcuts, never unbeatable power or exclusive advantages that break the balance.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm md:text-base">
                Our Vision is to prove that a Roblox game can respect every player, be fair to everyone, and still succeed without becoming pay‑to‑win or forcing anyone to open their wallet just to have fun.
              </p>
            </motion.div>
          </motion.div>

          {/* Principles card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div 
              className="glass-card p-6 md:p-8 h-full border-accent/20"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-display text-lg md:text-xl text-foreground mb-5 md:mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-accent" />
                </span>
                Our Principles
              </h3>
              
              <div className="space-y-3 md:space-y-4">
                {principles.map((principle, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 p-3 md:p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-accent/30 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
                    </div>
                    <span className="text-foreground/90 text-sm md:text-base">{principle}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
