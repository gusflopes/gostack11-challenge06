import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionRepository.find();
  const balance = await transactionRepository.getBalance();

  return response.status(200).json({ transactions: transactions, balance: balance })

});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  const createTransactionService = new CreateTransactionService();
  const transaction = await createTransactionService.execute(request.body);
  // console.log(request.body);
  return response.status(200).json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  console.log(id)
  const transactionRepository = getCustomRepository(TransactionsRepository);
  await transactionRepository.delete(id);
  return response.status(200).send();
  // TODO
});

transactionsRouter.post('/import', async (request, response) => {
  // code
});

export default transactionsRouter;
