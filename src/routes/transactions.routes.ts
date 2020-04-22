import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(TransactionsRepository);
  const transactions = repository.find();
  return response.status(200).json(transactions);
  // TODO
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  const createTransactionService = new CreateTransactionService();
  const transaction = await createTransactionService.execute(request.body);
  // console.log(request.body);
  return response.status(200).json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
