import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 dark:bg-accent/10 rounded-full blur-[100px]" />
      
      <div className="container relative z-10 px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            {/* Decorative corner accents */}
            <div className="absolute -top-2 -left-2 w-6 md:w-8 h-6 md:h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-lg" />
            <div className="absolute -top-2 -right-2 w-6 md:w-8 h-6 md:h-8 border-t-2 border-r-2 border-primary/40 rounded-tr-lg" />
            <div className="absolute -bottom-2 -left-2 w-6 md:w-8 h-6 md:h-8 border-b-2 border-l-2 border-primary/40 rounded-bl-lg" />
            <div className="absolute -bottom-2 -right-2 w-6 md:w-8 h-6 md:h-8 border-b-2 border-r-2 border-primary/40 rounded-br-lg" />
            
            <motion.div 
              className="glass-card p-6 md:p-8 lg:p-12 border-primary/20"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Shield className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <h2 className="font-display text-xl md:text-2xl lg:text-3xl gradient-text">Who We Are</h2>
              </div>
              
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base lg:text-lg">
                Mekhis Creations is a Roblox development studio dedicated to creating games that offer fair opportunities for free-to-play players, without giving pay-to-win advantages. With a growing community and thousands of game visits across our titles, we're rapidly expanding as a passionate development team.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
