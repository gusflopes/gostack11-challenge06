import { Router } from 'express';
import { getRepository } from 'typeorm';
import Category from '../models/Category';

const Route = Router();

Route.get('/', async (request, response) => {
  const categoriesRepository = getRepository(Category);
  const categories = await categoriesRepository.find();
  return response.status(200).json(categories);
});

Route.post('/', async (request, response) => {
  const categoriesRepository = getRepository(Category);
  const { title } = request.body;
  /**
   * Criar um servico aqui:
   * [ ] Não permitir cadastro de categoria com title duplicado
   */
  const category = categoriesRepository.create({ title });
  await categoriesRepository.save(category);
  return response.status(201).json(category);
});

Route.delete('/:id', async (request, response) => {
  // TODO
});

Route.post('/import', async (request, response) => {
  // TODO
});

export default Route;
