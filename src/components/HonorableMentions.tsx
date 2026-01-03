import { motion } from "framer-motion";
import { Award } from "lucide-react";

const mentions = [
  {
    name: "Spadebloke",
    username: "Spadebloke",
  },
  {
    name: "Santi",
    username: "im_santi_",
  },
  {
    name: "Hobee",
    username: "Hobee",
  },
];

const HonorableMentions = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Animated gradient border top */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 dark:from-primary/10 dark:via-accent/10 dark:to-primary/10 rounded-full blur-[100px]" />
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 border-accent/30"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Award className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">Special Thanks</span>
          </motion.div>
          <h2 className="section-title mb-4">Honorable Mentions</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            These individuals have shown incredible dedication to our development and deserve a huge thank you for their contributions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {mentions.map((person, index) => (
            <motion.div
              key={person.username}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <motion.div 
                className="relative glass-card p-6 text-center"
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {/* Avatar placeholder with gradient */}
                <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full opacity-30 dark:opacity-50 animate-pulse" />
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
                    <span className="font-display text-xl md:text-2xl gradient-text">
                      {person.name.charAt(0)}
                    </span>
                  </div>
                  {/* Medal icon */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center border-2 border-background shadow-lg">
                    <Award className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
                  </div>
                </div>

                <h3 className="font-display text-base md:text-lg text-foreground mb-1">
                  {person.name}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  @{person.username}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HonorableMentions;
