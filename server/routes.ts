import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get('/api/usuarios/:id', async (req, res) => {
    try {
      const usuario = await storage.getUsuarioById(req.params.id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
  });

  app.post('/api/usuarios', async (req, res) => {
    try {
      const usuario = await storage.createUsuario(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar usuário' });
    }
  });

  app.get('/api/cartoes/:id', async (req, res) => {
    try {
      const cartao = await storage.getCartaoById(req.params.id);
      if (!cartao) {
        return res.status(404).json({ message: 'Cartão não encontrado' });
      }
      res.json(cartao);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar cartão' });
    }
  });

  app.post('/api/cartoes', async (req, res) => {
    try {
      const cartao = await storage.createCartao(req.body);
      res.status(201).json(cartao);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar cartão' });
    }
  });

  app.put('/api/cartoes/:id', async (req, res) => {
    try {
      const cartao = await storage.updateCartao(req.params.id, req.body);
      if (!cartao) {
        return res.status(404).json({ message: 'Cartão não encontrado' });
      }
      res.json(cartao);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar cartão' });
    }
  });

  app.delete('/api/cartoes/:id', async (req, res) => {
    try {
      await storage.deleteCartao(req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir cartão' });
    }
  });

  app.get('/api/admin/cartoes', async (req, res) => {
    try {
      const cartoes = await storage.getAllCartoes();
      res.json(cartoes);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar cartões' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
