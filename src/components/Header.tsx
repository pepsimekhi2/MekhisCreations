import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Users, Menu, X } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="/"
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="font-display text-xl md:text-2xl gradient-text">
                Mekhis Creations
              </span>
            </motion.a>

            {/* Desktop Nav - Centered */}
            <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              <NavLink href="#games" icon={<Gamepad2 className="w-4 h-4" />}>
                Games
              </NavLink>
              <NavLink href="#community" icon={<Users className="w-4 h-4" />}>
                Community
              </NavLink>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <motion.a
                href="https://www.roblox.com/groups/33719761"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:block btn-glow bg-gradient-to-r from-primary to-primary/90 text-white px-5 py-2.5 rounded-xl font-semibold text-sm"
              >
                Join Group
              </motion.a>

              {/* Mobile menu button */}
              <motion.button
                className="md:hidden p-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-foreground" />
                ) : (
                  <Menu className="w-5 h-5 text-foreground" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-[73px] left-0 right-0 bg-background border-b border-border z-40 md:hidden"
            >
              <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
                <MobileNavLink 
                  href="#games" 
                  icon={<Gamepad2 className="w-5 h-5" />}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Games
                </MobileNavLink>
                <MobileNavLink 
                  href="#community" 
                  icon={<Users className="w-5 h-5" />}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Community
                </MobileNavLink>
                <motion.a
                  href="https://www.roblox.com/groups/33719761"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glow bg-gradient-to-r from-primary to-primary/90 text-white px-5 py-3 rounded-xl font-semibold text-center mt-2"
                  whileTap={{ scale: 0.95 }}
                >
                  Join Group
                </motion.a>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const NavLink = ({
  href,
  children,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) => (
  <motion.a
    href={href}
    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium relative group"
    whileHover={{ y: -2 }}
  >
    {icon}
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-full transition-all duration-300" />
  </motion.a>
);

const MobileNavLink = ({
  href,
  children,
  icon,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
}) => (
  <motion.a
    href={href}
    onClick={onClick}
    className="flex items-center gap-3 text-foreground p-3 rounded-xl hover:bg-secondary/50 transition-colors"
    whileTap={{ scale: 0.98 }}
  >
    <span className="text-primary">{icon}</span>
    <span className="font-medium">{children}</span>
  </motion.a>
);

export default Header;
