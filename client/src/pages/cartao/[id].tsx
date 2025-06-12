import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { getCard, getUserProfile } from '@/lib/firebase';
import { useAuth } from '../../hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { NfcIcon, PhoneIcon, EmailIcon, GlobeIcon, LinkedInIcon, InstagramIcon, FacebookIcon, TwitterIcon, ShareIcon, CopyIcon, ContactIcon } from '@/components/ui/icons';
import ToastNotification from '@/components/ui/toast-notification';
import Navbar from '@/components/layout/navbar';

// Add proper type for user profile
interface UserProfile {
  id: string;
  imagemUrl?: string;
  nome?: string;
  email?: string;
  // Add other profile properties as needed
}

export default function CardViewPage() {
  const [, params] = useRoute('/cartao/:id');
  const { user } = useAuth();
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const cardId = params?.id;

  const { data: card, isLoading: cardLoading } = useQuery({
    queryKey: [`/api/cartoes/${cardId}`],
    queryFn: async () => {
      if (!cardId) return null;
      return await getCard(cardId);
    },
    enabled: !!cardId,
  });

  const { data: cardOwnerProfile, isLoading: profileLoading } = useQuery({
    queryKey: [`/api/usuarios/${cardId}`],
    queryFn: async () => {
      if (!cardId) return null;
      const profile = await getUserProfile(cardId);
      return profile as UserProfile; // Type assertion
    },
    enabled: !!cardId,
  });

  const isOwner = user?.uid === cardId;

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShowCopiedToast(true);
  };

  // Determine gradient based on selected design
  let gradientClass = "bg-gradient-to-r from-blue-400 to-indigo-500";
  
  if (card?.design === 'green') {
    gradientClass = "bg-gradient-to-r from-green-400 to-cyan-500";
  } else if (card?.design === 'purple') {
    gradientClass = "bg-gradient-to-r from-purple-400 to-pink-500";
  }

  if (!cardId) return <div>Cartão não encontrado</div>;

  const isLoading = cardLoading || profileLoading;

  return (
    <>
      {user && <Navbar />}
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow overflow-hidden rounded-lg">
            {isLoading ? (
              // Loading skeleton
              <>
                <Skeleton className="h-40 w-full" />
                <div className="flex justify-center -mt-12">
                  <Skeleton className="rounded-full h-24 w-24" />
                </div>
                <div className="pt-16 pb-6 px-6 text-center space-y-4">
                  <Skeleton className="h-6 w-40 mx-auto" />
                  <Skeleton className="h-4 w-32 mx-auto" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <div className="px-6 py-4 grid grid-cols-1 gap-4">
                  <Skeleton className="h-12 w-full" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="space-y-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                </div>
                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="flex justify-center space-x-5">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </>
            ) : card ? (
              // Actual card content
              <>
                <div className={`relative h-40 ${gradientClass}`}>
                  <div className="absolute top-4 left-4">
                    <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center">
                      <NfcIcon className="h-6 w-6 text-primary-500" />
                    </div>
                  </div>
                  <div className="absolute -bottom-12 left-0 right-0 flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
                      {cardOwnerProfile?.imagemUrl ? (
                        <img 
                          src={cardOwnerProfile.imagemUrl} 
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
                  </div>
                </div>
                
                <div className="pt-16 pb-6 px-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900">{card.nome}</h3>
                  <p className="text-sm text-gray-500">{card.titulo}</p>
                  <p className="mt-4 text-sm text-gray-600">{card.bio}</p>
                </div>

                <div className="px-6 py-4 grid grid-cols-1 gap-4">
                  <Button className="w-full flex items-center justify-center gap-2">
                    <ContactIcon className="w-5 h-5" />
                    Salvar Contacto
                  </Button>

                  <div className="flex space-x-2">
                    <Button 
                      variant="secondary" 
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <ShareIcon className="w-5 h-5" />
                      Partilhar
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="flex-1 flex items-center justify-center gap-2"
                      onClick={handleCopyLink}
                    >
                      <CopyIcon className="w-5 h-5" />
                      Copiar Link
                    </Button>
                  </div>

                  {isOwner && (
                    <Link href="/criar">
                      <Button 
                        variant="outline" 
                        className="w-full mt-2"
                      >
                        Editar Cartão
                      </Button>
                    </Link>
                  )}
                </div>

                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="space-y-4">
                    {card.telefone && (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 text-gray-400">
                          <PhoneIcon className="w-5 h-5" />
                        </div>
                        <a 
                          href={`tel:${card.telefone}`} 
                          className="ml-3 text-sm text-gray-500 hover:text-primary-600"
                        >
                          {card.telefone}
                        </a>
                      </div>
                    )}
                    
                    {card.email && (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 text-gray-400">
                          <EmailIcon className="w-5 h-5" />
                        </div>
                        <a 
                          href={`mailto:${card.email}`} 
                          className="ml-3 text-sm text-gray-500 hover:text-primary-600"
                        >
                          {card.email}
                        </a>
                      </div>
                    )}
                    
                    {card.website && (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 text-gray-400">
                          <GlobeIcon className="w-5 h-5" />
                        </div>
                        <a 
                          href={card.website.startsWith('http') ? card.website : `https://${card.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="ml-3 text-sm text-gray-500 hover:text-primary-600"
                        >
                          {card.website.replace(/(^\w+:|^)\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="flex justify-center space-x-5">
                    {card.linkedin && (
                      <a 
                        href={card.linkedin.startsWith('http') ? card.linkedin : `https://${card.linkedin}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-400 hover:text-blue-600 transition-all"
                      >
                        <LinkedInIcon className="w-6 h-6" />
                      </a>
                    )}
                    
                    {card.instagram && (
                      <a 
                        href={card.instagram.startsWith('http') ? card.instagram : `https://instagram.com/${card.instagram.replace('@', '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-400 hover:text-pink-600 transition-all"
                      >
                        <InstagramIcon className="w-6 h-6" />
                      </a>
                    )}
                    
                    {card.facebook && (
                      <a 
                        href={card.facebook.startsWith('http') ? card.facebook : `https://facebook.com/${card.facebook.replace('@', '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-400 hover:text-blue-800 transition-all"
                      >
                        <FacebookIcon className="w-6 h-6" />
                      </a>
                    )}

                    {card.twitter && (
                      <a 
                        href={card.twitter.startsWith('http') ? card.twitter : `https://twitter.com/${card.twitter.replace('@', '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-400 hover:text-gray-900 transition-all"
                      >
                        <TwitterIcon className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <p className="text-lg text-gray-700">Cartão não encontrado</p>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Desenvolvido pela <Link href="/" className="text-primary-600 hover:text-primary-500">Stellar Smart Card</Link>
            </p>
          </div>
        </div>
      </div>

      <ToastNotification
        message="Link copiado para a área de transferência!"
        isVisible={showCopiedToast}
        onClose={() => setShowCopiedToast(false)}
      />
    </>
  );
}