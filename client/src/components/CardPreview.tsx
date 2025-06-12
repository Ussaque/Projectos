import { motion } from 'framer-motion';
import { LinkedInIcon, InstagramIcon, FacebookIcon, TwitterIcon, PhoneIcon, EmailIcon, GlobeIcon } from '@/components/ui/icons';

interface CardPreviewProps {
  card: {
    nome: string;
    titulo: string;
    bio?: string;
    telefone?: string;
    email: string;
    website?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    imagemUrl?: string;
    design?: string;
  };
}

export default function CardPreview({ card }: CardPreviewProps) {
  // Determine gradient based on selected design
  let gradientClass = "bg-gradient-to-r from-blue-400 to-indigo-500";
  
  if (card.design === 'green') {
    gradientClass = "bg-gradient-to-r from-green-400 to-cyan-500";
  } else if (card.design === 'purple') {
    gradientClass = "bg-gradient-to-r from-purple-400 to-pink-500";
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg h-full">
      <div className="h-full flex flex-col">
        <div className={`relative h-40 ${gradientClass}`}>
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <motion.div 
              className="relative -mb-12"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
                {card.imagemUrl ? (
                  <img 
                    src={card.imagemUrl} 
                    alt={card.nome} 
                    className="h-full w-full object-cover rounded-full" 
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          className="pt-16 pb-8 px-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-gray-900">{card.nome || 'Nome Completo'}</h3>
          <p className="text-sm text-gray-500">{card.titulo || 'Título Profissional'}</p>
          <p className="mt-4 text-sm text-gray-600">{card.bio || 'Sua biografia profissional aparecerá aqui. Descreva suas habilidades e experiências.'}</p>
        </motion.div>
        
        <motion.div 
          className="border-t border-gray-200 px-6 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="space-y-4">
            {card.telefone && (
              <div className="flex items-center">
                <div className="flex-shrink-0 text-gray-400">
                  <PhoneIcon className="w-5 h-5" />
                </div>
                <div className="ml-3 text-sm text-gray-500">{card.telefone}</div>
              </div>
            )}
            
            {card.email && (
              <div className="flex items-center">
                <div className="flex-shrink-0 text-gray-400">
                  <EmailIcon className="w-5 h-5" />
                </div>
                <div className="ml-3 text-sm text-gray-500">{card.email}</div>
              </div>
            )}
            
            {card.website && (
              <div className="flex items-center">
                <div className="flex-shrink-0 text-gray-400">
                  <GlobeIcon className="w-5 h-5" />
                </div>
                <div className="ml-3 text-sm text-gray-500">
                  {card.website.replace(/(^\w+:|^)\/\//, '')}
                </div>
              </div>
            )}
          </div>
        </motion.div>
        
        <motion.div 
          className="border-t border-gray-200 px-6 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-center space-x-5">
            {card.linkedin && (
              <div className="text-gray-400 hover:text-blue-600 transition-all">
                <LinkedInIcon className="w-5 h-5" />
              </div>
            )}
            
            {card.instagram && (
              <div className="text-gray-400 hover:text-pink-600 transition-all">
                <InstagramIcon className="w-5 h-5" />
              </div>
            )}
            
            {card.facebook && (
              <div className="text-gray-400 hover:text-blue-600 transition-all">
                <FacebookIcon className="w-5 h-5" />
              </div>
            )}
            
            {card.twitter && (
              <div className="text-gray-400 hover:text-gray-900 transition-all">
                <TwitterIcon className="w-5 h-5" />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}