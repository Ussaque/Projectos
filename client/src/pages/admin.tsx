import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/use-auth';
import { getAllCards, deleteCard } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { SearchIcon, FilterIcon, PlusIcon, NfcIcon } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/navbar';

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);

  const { data: allCards, isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/cartoes'],
    queryFn: async () => {
      const cards = await getAllCards();
      return cards;
    },
    enabled: !!user && isAdmin,
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
    } else if (!isAdmin) {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para acessar esta página.",
        variant: "destructive",
      });
      navigate('/perfil');
    }
  }, [user, isAdmin, navigate, toast]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteCard = async () => {
    if (!deletingCardId) return;
    
    try {
      await deleteCard(deletingCardId);
      toast({
        title: "Sucesso!",
        description: "Cartão excluído com sucesso.",
      });
      refetch();
    } catch (error) {
      console.error("Erro ao excluir cartão:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o cartão.",
        variant: "destructive",
      });
    } finally {
      setDeletingCardId(null);
    }
  };

  const filteredCards = allCards?.filter(card => 
    card.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    card.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || !isAdmin) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <div className="py-10">
          <header>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Painel de Administração
              </h1>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 rounded-md bg-primary-100 p-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-primary-600 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total de Usuários
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {isLoading ? <Skeleton className="h-6 w-16" /> : allCards?.length || 0}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 rounded-md bg-green-100 p-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-green-600 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Cartões Ativos
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {isLoading ? <Skeleton className="h-6 w-16" /> : allCards?.length || 0}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 rounded-md bg-blue-100 p-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-blue-600 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Visualizações Totais
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {isLoading ? <Skeleton className="h-6 w-16" /> : "-"}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 rounded-md bg-purple-100 p-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-purple-600 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Downloads
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {isLoading ? <Skeleton className="h-6 w-16" /> : "-"}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search bar */}
                <div className="bg-white shadow rounded-lg mb-6 p-4">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          className="pl-10"
                          placeholder="Buscar cartões por nome ou email..."
                          value={searchTerm}
                          onChange={handleSearch}
                        />
                      </div>
                    </div>
                    <div className="ml-3">
                      <Button variant="outline" className="flex items-center">
                        <FilterIcon className="h-5 w-5 text-gray-500 mr-2" />
                        Filtro
                      </Button>
                    </div>
                    <div className="ml-3">
                      <Link href="/criar">
                        <Button className="flex items-center">
                          <PlusIcon className="h-5 w-5 mr-2" />
                          Adicionar Cartão
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Cards Table */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Usuário
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Título do Cartão
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Criado em
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Visualizações
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                          // Loading skeletons
                          Array.from({ length: 3 }).map((_, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Skeleton className="h-10 w-10 rounded-full" />
                                  <div className="ml-4">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-32 mt-1" />
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24 mt-1" />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Skeleton className="h-4 w-24" />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Skeleton className="h-5 w-16 rounded-full" />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Skeleton className="h-4 w-12" />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <Skeleton className="h-4 w-32 ml-auto" />
                              </td>
                            </tr>
                          ))
                        ) : filteredCards?.length ? (
                          // Actual cards
                          filteredCards.map((card) => (
                            <tr key={card.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {card.imagemUrl ? (
                                      <img 
                                        src={card.imagemUrl} 
                                        alt={card.nome} 
                                        className="h-full w-full object-cover" 
                                      />
                                    ) : (
                                      <NfcIcon className="h-5 w-5 text-gray-400" />
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {card.nome}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {card.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{card.titulo}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {new Date(card.createdAt).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Ativo
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                -
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link href={`/cartao/${card.id}`}>
                                  <a className="text-primary-600 hover:text-primary-900 mr-3">Ver</a>
                                </Link>
                                <Link href={`/criar`}>
                                  <a className="text-indigo-600 hover:text-indigo-900 mr-3">Editar</a>
                                </Link>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <button
                                      className="text-red-600 hover:text-red-900"
                                      onClick={() => setDeletingCardId(card.id)}
                                    >
                                      Excluir
                                    </button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. O cartão será permanentemente excluído.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel onClick={() => setDeletingCardId(null)}>
                                        Cancelar
                                      </AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={handleDeleteCard}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                              Nenhum cartão encontrado
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {filteredCards && filteredCards.length > 0 && (
                    <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                          <Button variant="outline" size="sm">Anterior</Button>
                          <Button variant="outline" size="sm" className="ml-3">Próximo</Button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-gray-700">
                              Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredCards.length}</span> de <span className="font-medium">{filteredCards.length}</span> resultados
                            </p>
                          </div>
                          <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Paginação">
                              <Button variant="outline" size="icon" className="rounded-l-md">
                                <span className="sr-only">Anterior</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </Button>
                              <Button variant="outline" className="bg-primary-50 border-primary-500 text-primary-600">1</Button>
                              <Button variant="outline" size="icon" className="rounded-r-md">
                                <span className="sr-only">Próximo</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                              </Button>
                            </nav>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
