import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../hooks/use-auth';
import { getUserProfile } from '@/lib/firebase';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/navbar';
import CriarCartao from '@/components/CriarCartao';
import { Skeleton } from '@/components/ui/skeleton';

export default function CardCreationPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: userProfile, isLoading } = useQuery({
    queryKey: [`/api/usuarios/${user?.uid}`],
    queryFn: async () => {
      if (!user) return null;
      return await getUserProfile(user.uid);
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
    } else if (userProfile === null && !isLoading) {
      // If profile doesn't exist but we're not loading anymore, redirect to profile creation
      navigate('/perfil');
    }
  }, [user, userProfile, isLoading, navigate]);

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Crie Seu Cartão Digital
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Projete sua identidade digital profissional em minutos
            </p>
          </div>

          <div className="mt-12">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                  <div className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <Skeleton className="h-[600px] w-full rounded-lg" />
              </div>
            ) : (
              <CriarCartao />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
