import { Cartao, InsertCartao, Usuario, InsertUsuario, usuarios, cartoes } from "@shared/schema";
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq, ilike } from 'drizzle-orm';

// PostgreSQL connection setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const db = drizzle(pool);

export interface IStorage {
  // Usuários
  getUsuarioById(id: string): Promise<Usuario | undefined>;
  getUsuarioByEmail(email: string): Promise<Usuario | undefined>;
  createUsuario(usuario: InsertUsuario): Promise<Usuario>;
  updateUsuario(id: string, usuario: Partial<Usuario>): Promise<Usuario | undefined>;
  
  // Cartões
  getCartaoById(id: string): Promise<Cartao | undefined>;
  createCartao(cartao: InsertCartao): Promise<Cartao>;
  updateCartao(id: string, cartao: Partial<Cartao>): Promise<Cartao | undefined>;
  deleteCartao(id: string): Promise<void>;
  getAllCartoes(): Promise<Cartao[]>;
  searchCartoes(term: string): Promise<Cartao[]>;
}

// PostgreSQL storage implementation
export class PgStorage implements IStorage {
  // Usuários
  async getUsuarioById(id: string): Promise<Usuario | undefined> {
    try {
      const result = await db.select().from(usuarios).where(eq(usuarios.id, id));
      return result[0] as Usuario | undefined;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return undefined;
    }
  }

  async getUsuarioByEmail(email: string): Promise<Usuario | undefined> {
    try {
      const result = await db.select().from(usuarios).where(eq(usuarios.email, email));
      return result[0] as Usuario | undefined;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }
  }

  async createUsuario(insertUsuario: InsertUsuario): Promise<Usuario> {
    try {
      const now = new Date().toISOString();
      const usuario = {
        ...insertUsuario,
        createdAt: now
      };
      
      await db.insert(usuarios).values(usuario);
      return usuario as Usuario;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUsuario(id: string, usuarioData: Partial<Usuario>): Promise<Usuario | undefined> {
    try {
      const usuario = await this.getUsuarioById(id);
      if (!usuario) return undefined;
      
      await db.update(usuarios)
        .set(usuarioData)
        .where(eq(usuarios.id, id));
      
      return { ...usuario, ...usuarioData };
    } catch (error) {
      console.error("Error updating user:", error);
      return undefined;
    }
  }

  // Cartões
  async getCartaoById(id: string): Promise<Cartao | undefined> {
    try {
      const result = await db.select().from(cartoes).where(eq(cartoes.id, id));
      return result[0] as Cartao | undefined;
    } catch (error) {
      console.error("Error getting card by ID:", error);
      return undefined;
    }
  }

  async createCartao(insertCartao: InsertCartao): Promise<Cartao> {
    try {
      const now = new Date().toISOString();
      const cartao = {
        ...insertCartao,
        createdAt: now,
        updatedAt: now
      };
      
      await db.insert(cartoes).values(cartao);
      return cartao as Cartao;
    } catch (error) {
      console.error("Error creating card:", error);
      throw error;
    }
  }

  async updateCartao(id: string, cartaoData: Partial<Cartao>): Promise<Cartao | undefined> {
    try {
      const cartao = await this.getCartaoById(id);
      if (!cartao) return undefined;
      
      const updatedData = {
        ...cartaoData,
        updatedAt: new Date().toISOString()
      };
      
      await db.update(cartoes)
        .set(updatedData)
        .where(eq(cartoes.id, id));
      
      return { ...cartao, ...updatedData };
    } catch (error) {
      console.error("Error updating card:", error);
      return undefined;
    }
  }

  async deleteCartao(id: string): Promise<void> {
    try {
      await db.delete(cartoes).where(eq(cartoes.id, id));
    } catch (error) {
      console.error("Error deleting card:", error);
      throw error;
    }
  }

  async getAllCartoes(): Promise<Cartao[]> {
    try {
      const result = await db.select().from(cartoes);
      return result as Cartao[];
    } catch (error) {
      console.error("Error getting all cards:", error);
      return [];
    }
  }

  async searchCartoes(term: string): Promise<Cartao[]> {
    try {
      const normalizedTerm = `%${term.toLowerCase()}%`;
      const result = await db.select().from(cartoes)
        .where(ilike(cartoes.nome, normalizedTerm))
        .or(ilike(cartoes.email, normalizedTerm));
      
      return result as Cartao[];
    } catch (error) {
      console.error("Error searching cards:", error);
      return [];
    }
  }
}

// Memory storage implementation as fallback
export class MemStorage implements IStorage {
  private usuarios: Map<string, Usuario>;
  private cartoes: Map<string, Cartao>;

  constructor() {
    this.usuarios = new Map();
    this.cartoes = new Map();
  }

  // Usuários
  async getUsuarioById(id: string): Promise<Usuario | undefined> {
    return this.usuarios.get(id);
  }

  async getUsuarioByEmail(email: string): Promise<Usuario | undefined> {
    return Array.from(this.usuarios.values()).find(
      (usuario) => usuario.email === email,
    );
  }

  async createUsuario(insertUsuario: InsertUsuario): Promise<Usuario> {
    const id = insertUsuario.id;
    const now = new Date().toISOString();
    const usuario: Usuario = { ...insertUsuario, createdAt: now };
    this.usuarios.set(id, usuario);
    return usuario;
  }

  async updateUsuario(id: string, usuarioData: Partial<Usuario>): Promise<Usuario | undefined> {
    const usuario = this.usuarios.get(id);
    if (!usuario) return undefined;
    
    const updatedUsuario = { ...usuario, ...usuarioData };
    this.usuarios.set(id, updatedUsuario);
    return updatedUsuario;
  }

  // Cartões
  async getCartaoById(id: string): Promise<Cartao | undefined> {
    return this.cartoes.get(id);
  }

  async createCartao(insertCartao: InsertCartao): Promise<Cartao> {
    const id = insertCartao.id;
    const now = new Date().toISOString();
    const cartao: Cartao = { 
      ...insertCartao,
      createdAt: now,
      updatedAt: now
    };
    this.cartoes.set(id, cartao);
    return cartao;
  }

  async updateCartao(id: string, cartaoData: Partial<Cartao>): Promise<Cartao | undefined> {
    const cartao = this.cartoes.get(id);
    if (!cartao) return undefined;
    
    const now = new Date().toISOString();
    const updatedCartao = { ...cartao, ...cartaoData, updatedAt: now };
    this.cartoes.set(id, updatedCartao);
    return updatedCartao;
  }

  async deleteCartao(id: string): Promise<void> {
    this.cartoes.delete(id);
  }

  async getAllCartoes(): Promise<Cartao[]> {
    return Array.from(this.cartoes.values());
  }

  async searchCartoes(term: string): Promise<Cartao[]> {
    const normalizedTerm = term.toLowerCase();
    return Array.from(this.cartoes.values()).filter(
      (cartao) => 
        cartao.nome?.toLowerCase().includes(normalizedTerm) ||
        cartao.email?.toLowerCase().includes(normalizedTerm)
    );
  }
}

// Choose either PostgreSQL or memory storage
export const storage = new PgStorage();
