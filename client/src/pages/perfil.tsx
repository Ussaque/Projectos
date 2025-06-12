import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/use-auth';
import { createUserProfile, uploadImage } from '@/lib/firebase';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { UserIcon } from '@/components/ui/icons';
import ImageUpload from '@/components/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/navbar';

const formSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }),
  bio: z.string().max(150, { message: 'A bio deve ter no máximo 150 caracteres' }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProfileSetupPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      bio: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      let profileImageUrl = '';
      
      if (selectedImage) {
        // Upload the image to Firebase Storage
        profileImageUrl = await uploadImage(selectedImage, `profile-images/${user.uid}`);
      }
      
      // Save profile data to Firestore
      await createUserProfile(user.uid, {
        nome: data.nome,
        bio: data.bio || '',
        email: user.email,
        imagemUrl: profileImageUrl,
        createdAt: new Date().toISOString(),
      });
      
      toast({
        title: "Sucesso!",
        description: "Perfil criado com sucesso.",
      });
      
      navigate('/criar');
    } catch (error) {
      console.error("Erro ao criar perfil:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar seu perfil.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary-500 flex items-center justify-center text-white">
              <UserIcon className="h-8 w-8" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crie Seu Perfil
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Configure sua conta para começar
          </p>

          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <ImageUpload 
                  onImageSelected={handleImageSelected}
                  className="mb-6"
                />

                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biografia</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Uma breve descrição sobre você" 
                          className="resize-none" 
                          maxLength={150}
                          {...field} 
                        />
                      </FormControl>
                      <p className="mt-1 text-sm text-gray-500">
                        Breve descrição sobre você (máximo 150 caracteres)
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Salvando...' : 'Salvar e Continuar'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
