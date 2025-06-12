import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { createCard } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusIcon, LinkedInIcon, InstagramIcon, FacebookIcon, TwitterIcon } from '@/components/ui/icons';
import CardPreview from '@/components/CardPreview';
import { useToast } from '@/hooks/use-toast';

const socialMediaSchema = z.object({
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
});

const formSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }),
  titulo: z.string().min(1, { message: 'Título profissional é obrigatório' }),
  bio: z.string().max(150, { message: 'A bio deve ter no máximo 150 caracteres' }).optional(),
  telefone: z.string().optional(),
  email: z.string().email({ message: 'Email inválido' }).min(1, { message: 'Email é obrigatório' }),
  website: z.string().url({ message: 'Website deve ser uma URL válida' }).optional(),
  design: z.string().default('blue'),
  social: socialMediaSchema,
});

type FormValues = z.infer<typeof formSchema>;

export default function CriarCartao() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      titulo: '',
      bio: '',
      telefone: '',
      email: user?.email || '',
      website: '',
      design: 'blue',
      social: {
        linkedin: '',
        instagram: '',
        facebook: '',
        twitter: '',
      },
    },
  });

  const watchedValues = form.watch();
  
  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const cardData = {
        nome: data.nome,
        titulo: data.titulo,
        bio: data.bio || '',
        telefone: data.telefone || '',
        email: data.email,
        website: data.website || '',
        linkedin: data.social.linkedin || '',
        instagram: data.social.instagram || '',
        facebook: data.social.facebook || '',
        twitter: data.social.twitter || '',
        design: data.design,
      };
      
      await createCard(user.uid, cardData);
      toast({
        title: "Sucesso!",
        description: "Seu cartão digital foi criado.",
      });
      
      navigate(`/cartao/${user.uid}`);
    } catch (error) {
      console.error("Erro ao criar cartão:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar seu cartão.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // For the preview
  const previewCard = {
    nome: watchedValues.nome,
    titulo: watchedValues.titulo,
    bio: watchedValues.bio,
    telefone: watchedValues.telefone,
    email: watchedValues.email,
    website: watchedValues.website,
    linkedin: watchedValues.social?.linkedin,
    instagram: watchedValues.social?.instagram,
    facebook: watchedValues.social?.facebook,
    twitter: watchedValues.social?.twitter,
    design: watchedValues.design,
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Card Form */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título Profissional</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Gestor de Marketing" {...field} />
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
                      placeholder="Uma breve descrição profissional" 
                      className="resize-none" 
                      maxLength={150}
                      {...field} 
                    />
                  </FormControl>
                  <div className="text-xs text-gray-500 mt-1">
                    {(field.value?.length || 0)}/150 caracteres
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: +258 86 629 6358" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://seusite.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Redes Sociais</label>
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="social.linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <div className="w-10 flex justify-center">
                          <LinkedInIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <FormControl>
                          <Input 
                            placeholder="LinkedIn URL" 
                            className="ml-2 flex-1" 
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="social.instagram"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <div className="w-10 flex justify-center">
                          <InstagramIcon className="w-5 h-5 text-pink-600" />
                        </div>
                        <FormControl>
                          <Input 
                            placeholder="Instagram Username" 
                            className="ml-2 flex-1" 
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="social.facebook"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <div className="w-10 flex justify-center">
                          <FacebookIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <FormControl>
                          <Input 
                            placeholder="Facebook URL" 
                            className="ml-2 flex-1" 
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="social.twitter"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <div className="w-10 flex justify-center">
                          <TwitterIcon className="w-5 h-5" />
                        </div>
                        <FormControl>
                          <Input 
                            placeholder="Twitter/X Username" 
                            className="ml-2 flex-1" 
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Design do Cartão</label>
              <div className="mt-2 grid grid-cols-3 gap-3">
                <div 
                  className={`relative border-2 ${watchedValues.design === 'blue' ? 'border-primary-500' : 'border-gray-200 hover:border-primary-400'} rounded-md p-1 cursor-pointer transition-all`}
                  onClick={() => form.setValue('design', 'blue')}
                >
                  <div className="h-24 bg-gradient-to-r from-blue-400 to-indigo-500 rounded"></div>
                  {watchedValues.design === 'blue' && (
                    <div className="absolute top-0 right-0 -mt-2 -mr-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                    </div>
                  )}
                </div>
                
                <div 
                  className={`relative border-2 ${watchedValues.design === 'green' ? 'border-primary-500' : 'border-gray-200 hover:border-primary-400'} rounded-md p-1 cursor-pointer transition-all`}
                  onClick={() => form.setValue('design', 'green')}
                >
                  <div className="h-24 bg-gradient-to-r from-green-400 to-cyan-500 rounded"></div>
                  {watchedValues.design === 'green' && (
                    <div className="absolute top-0 right-0 -mt-2 -mr-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                    </div>
                  )}
                </div>
                
                <div 
                  className={`relative border-2 ${watchedValues.design === 'purple' ? 'border-primary-500' : 'border-gray-200 hover:border-primary-400'} rounded-md p-1 cursor-pointer transition-all`}
                  onClick={() => form.setValue('design', 'purple')}
                >
                  <div className="h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded"></div>
                  {watchedValues.design === 'purple' && (
                    <div className="absolute top-0 right-0 -mt-2 -mr-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Criando...' : 'Criar Cartão'}
            </Button>
          </form>
        </Form>
      </div>

      {/* Card Preview */}
      <CardPreview card={{
        nome: watchedValues.nome || '',
        titulo: watchedValues.titulo || '',
        bio: watchedValues.bio,
        telefone: watchedValues.telefone,
        email: watchedValues.email || '',
        website: watchedValues.website,
        linkedin: watchedValues.social?.linkedin,
        instagram: watchedValues.social?.instagram,
        facebook: watchedValues.social?.facebook,
        twitter: watchedValues.social?.twitter,
        design: watchedValues.design || 'default'
      }} />
    </div>
  );
}