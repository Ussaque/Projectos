import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../hooks/use-auth";
import { NfcIcon } from "@/components/ui/icons";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white mr-2">
                <NfcIcon className="w-5 h-5" />
              </div>
              <span className="font-bold text-gray-900">Stellar Smart Card</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/perfil" className={`${location === '/perfil' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                Perfil
              </Link>
              <Link href="/criar" className={`${location === '/criar' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                Criar Cartão
              </Link>
              {isAdmin && (
                <Link href="/admin" className={`${location === '/admin' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <Button 
              variant="outline" 
              onClick={() => logout()}
              className="ml-3"
            >
              Sair
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
