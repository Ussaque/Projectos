import { z } from "zod";
import { 
  pgTable, 
  text, 
  varchar, 
  timestamp,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

// Database schema for Drizzle ORM
export const usuarios = pgTable('usuarios', {
  id: varchar('id', { length: 128 }).primaryKey(),
  nome: text('nome').notNull(),
  email: text('email').notNull(),
  bio: text('bio'),
  imagemUrl: text('imagem_url'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const cartoes = pgTable('cartoes', {
  id: varchar('id', { length: 128 }).primaryKey(),
  userId: varchar('user_id', { length: 128 }).notNull().references(() => usuarios.id),
  nome: text('nome').notNull(),
  titulo: text('titulo').notNull(),
  bio: text('bio'),
  telefone: text('telefone'),
  email: text('email').notNull(),
  website: text('website'),
  linkedin: text('linkedin'),
  instagram: text('instagram'),
  facebook: text('facebook'),
  twitter: text('twitter'),
  imagemUrl: text('imagem_url'),
  design: text('design').default('blue'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Esquema para Usuários
export const usuarioSchema = z.object({
  id: z.string(),
  nome: z.string(),
  email: z.string().email(),
  bio: z.string().optional(),
  imagemUrl: z.string().optional(),
  createdAt: z.string(),
});

export const insertUsuarioSchema = createInsertSchema(usuarios, {
  id: z.string(),
  nome: z.string(),
  email: z.string().email(),
  bio: z.string().optional(),
  imagemUrl: z.string().optional(),
}).omit({ createdAt: true });

export type InsertUsuario = z.infer<typeof insertUsuarioSchema>;
export type Usuario = z.infer<typeof usuarioSchema>;

// Esquema para Cartões Digitais
export const cartaoSchema = z.object({
  id: z.string(),
  userId: z.string(),
  nome: z.string(),
  titulo: z.string(),
  bio: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  design: z.string().default("blue"),
  imagemUrl: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const insertCartaoSchema = createInsertSchema(cartoes, {
  id: z.string(),
  userId: z.string(),
  nome: z.string(),
  titulo: z.string(),
  bio: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  imagemUrl: z.string().optional(),
  design: z.string().default("blue"),
}).omit({ createdAt: true, updatedAt: true });

export type InsertCartao = z.infer<typeof insertCartaoSchema>;
export type Cartao = z.infer<typeof cartaoSchema>;