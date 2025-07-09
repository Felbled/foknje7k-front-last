import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Qrcode } from "../../../assets/images";
import { 
  faComments, 
  faUserGroup, 
  faBook, 
  faHeadset,
  faTimes,
  faQrcode,
  faUsers,
  faMessage
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { motion, AnimatePresence } from "framer-motion";

export default function DiscordBanner() {
  const discordInviteLink = "https://discord.gg/v5f6c726";
  const [showPopup, setShowPopup] = useState(false);
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [floatingIcons, setFloatingIcons] = useState<{id: number, top: number, left: number, icon: React.ReactNode}[]>([]);
  
  const togglePopup = () => setShowPopup(!showPopup);
  const toggleQRPopup = () => setShowQRPopup(!showQRPopup);

  // Générer des icônes flottantes avec positions ajustées
  useEffect(() => {
    const icons = [
      { icon: <FontAwesomeIcon icon={faComments} className="text-indigo-400" /> },
      { icon: <FontAwesomeIcon icon={faUserGroup} className="text-purple-400" /> },
      { icon: <FontAwesomeIcon icon={faBook} className="text-indigo-400" /> },
      { icon: <FontAwesomeIcon icon={faHeadset} className="text-purple-400" /> },
      { icon: <FontAwesomeIcon icon={faUsers} className="text-indigo-400" /> },
      { icon: <FontAwesomeIcon icon={faMessage} className="text-purple-400" /> },
      { icon: <FontAwesomeIcon icon={faComments} className="text-indigo-400" /> },
      { icon: <FontAwesomeIcon icon={faUserGroup} className="text-purple-400" /> },
      { icon: <FontAwesomeIcon icon={faBook} className="text-indigo-400" /> },
      { icon: <FontAwesomeIcon icon={faHeadset} className="text-purple-400" /> },
      { icon: <FontAwesomeIcon icon={faUsers} className="text-indigo-400" /> },
      { icon: <FontAwesomeIcon icon={faMessage} className="text-purple-400" /> },
      { icon: <FontAwesomeIcon icon={faComments} className="text-indigo-400" /> },
      { icon: <FontAwesomeIcon icon={faUserGroup} className="text-purple-400" /> },
      { icon: <FontAwesomeIcon icon={faBook} className="text-indigo-400" /> },
      { icon: <FontAwesomeIcon icon={faHeadset} className="text-purple-400" /> },
      { icon: <FontAwesomeIcon icon={faUsers} className="text-indigo-400" /> },
      { icon: <FontAwesomeIcon icon={faMessage} className="text-purple-400" /> },
      
    ];
    
    const newIcons = icons.map((item, index) => ({
      id: index,
      // Positions ajustées pour rester dans le conteneur (10-90% au lieu de 0-100%)
      top: 10 + Math.random() * 80,  // Entre 10% et 90%
      left: 5 + Math.random() * 80, // Entre 10% et 90%
      icon: item.icon
    }));
    
    setFloatingIcons(newIcons);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 relative overflow-hidden">
      {/* Icônes flottantes animées en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {floatingIcons.map((icon) => (
          <motion.div
            key={icon.id}
            className="absolute text-2xl opacity-20"
            style={{ top: `${icon.top}%`, left: `${icon.left}%` }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() > 0.5 ? 15 : -15, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {icon.icon}
          </motion.div>
        ))}
      </div>

      {/* Popup QR Code */}
      <AnimatePresence>
        {showQRPopup && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={toggleQRPopup}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="relative bg-gradient-to-br from-white to-gray-100 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "backOut" }}
            >
              <button 
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10 bg-white/80 rounded-full p-2 transition-all hover:scale-110"
                onClick={toggleQRPopup}
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
              <div className="p-8 flex flex-col items-center">
                <motion.div
                  initial={{ rotate: -5, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <FontAwesomeIcon 
                    icon={faDiscord} 
                    className="text-[#5865F2] text-5xl mb-4"
                  />
                </motion.div>
                
                <motion.h3 
                  className="text-xl font-bold text-gray-800 mb-4"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Rejoindre via QR Code
                </motion.h3>
                
                <motion.div 
                  className="bg-white p-4 rounded-lg border-4 border-indigo-600 mb-6 shadow-lg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <img 
                    src={Qrcode} 
                    alt="QR Code Discord"
                    className="w-48 h-48 object-contain"
                  />
                </motion.div>
                
                <motion.p 
                  className="text-gray-600 text-center mb-6"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Scannez ce QR Code avec l'appareil photo de votre téléphone pour rejoindre instantanément notre serveur Discord
                </motion.p>
                
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <a 
                    href={discordInviteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center group"
                  >
                    <FontAwesomeIcon icon={faDiscord} className="mr-2 transition-transform group-hover:scale-110" />
                    <span>Ou rejoindre via le lien direct</span>
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bannière principale */}
      <motion.div 
        className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-xl overflow-hidden relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.01 }}
      >
        {/* Effet de particules au survol */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
              }}
              animate={{
                y: [0, -100],
                opacity: [1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
        
        <div className="md:flex relative z-10">
          {/* Section visuelle */}
          <div 
            className="md:w-2/5 p-8 flex flex-col justify-center items-center bg-indigo-800 border-r-[2px] border-[#5865F2]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div 
              className="bg-white/20 p-6 rounded-full mb-4 cursor-pointer transition-all duration-300 hover:bg-white/30 group relative"
              onClick={togglePopup}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#5865F2] opacity-0 group-hover:opacity-100"
                animate={{
                  scale: isHovered ? [1, 1.2, 1] : 1,
                  opacity: isHovered ? [0, 0.5, 0] : 0
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <FontAwesomeIcon 
                icon={faDiscord} 
                className="text-[#5865F2] text-6xl"
              />
            </motion.div>
            <motion.h3 
              className="text text-xl font-bold text-center "
              animate={{ 
                textShadow: isHovered 
                  ? ["0 0 0px rgba(255,255,255,0)", "0 0 10px rgba(255,255,255,0.5)", "0 0 0px rgba(255,255,255,0)"] 
                  : "0 0 0px rgba(255,255,255,0)"
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Communauté d'Apprentissage
            </motion.h3>
          </div>

          {/* Contenu */}
          <div className="md:w-3/5 p-8 bg-white dark:bg-gray-800">
            <motion.h2 
              className="text-2xl font-bold text-gray-800 dark:text- mb-2"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Rejoignez notre serveur Discord
            </motion.h2>
            
            <motion.p 
              className="text-gray-600 dark:text-gray-300 mb-6"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Collaborez, posez des questions et échangez avec la communauté dans nos salons dédiés à l'apprentissage.
            </motion.p>

            {/* Avantages */}
            <motion.div 
              className="grid grid-cols-2 gap-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <FeatureCard 
                icon={<FontAwesomeIcon icon={faComments} style={{ color: '#5865F2' }} className="text-2xl" />} 
                title="Chat en direct" 
              />
              <FeatureCard 
                icon={<FontAwesomeIcon icon={faUserGroup} style={{ color: '#9b59b6' }} className="text-2xl" />} 
                title="Réseautage" 
              />
              <FeatureCard 
                icon={<FontAwesomeIcon icon={faBook} style={{ color: '#5865F2' }} className="text-2xl" />} 
                title="Ressources" 
              />
              <FeatureCard 
                icon={<FontAwesomeIcon icon={faHeadset} style={{ color: '#9b59b6' }} className="text-2xl" />} 
                title="Support rapide" 
              />
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.a 
                href={discordInviteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-700  font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Effet de vague au survol */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -inset-10 bg-gradient-to-r from-white/10 via-white/30 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shine" />
                </div>
                
                <FontAwesomeIcon 
                  icon={faDiscord} 
                  style={{ color: '#ffffff' }} 
                  className="mr-2 text-xl transition-transform group-hover:scale-110" 
                />
                <span>Rejoindre le serveur</span>
                <motion.span 
                  className="ml-2"
                  animate={{
                    x: [0, 5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  →
                </motion.span>
              </motion.a>
              
              <motion.button
                onClick={toggleQRPopup}
                className="flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition-all duration-300 group relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FontAwesomeIcon 
                  icon={faQrcode} 
                  className="text-xl mr-2 transition-transform group-hover:scale-110" 
                />
                QR Code
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Composant de fonctionnalité avec animations
const FeatureCard = ({ icon, title }: { 
  icon: React.ReactElement; 
  title: string 
}) => (
  <motion.div 
    className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
    whileHover={{ 
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    <motion.div whileHover={{ rotate: 10, scale: 1.2 }}>
      {icon}
    </motion.div>
    <span className="text-gray-700 dark:text-gray-200 font-medium">{title}</span>
  </motion.div>
);