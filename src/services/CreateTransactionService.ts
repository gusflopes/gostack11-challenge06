import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface CreateTransactionRequest {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute(data: CreateTransactionRequest): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);
    const { category, title, type, value } = data;
    if (!category || !title || !type || !value) {
      throw new AppError('Missing required fields', 400);
    }

    // Verificar se tem saldo
    const balance = await transactionsRepository.getBalance()
    if (type === 'outcome' && balance.total < value) {
      throw new AppError('Not enough credit for this actions', 400)
    }

    // Verificar se categoria existe
    const categoryExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    let newCategory = {} as Category;
    // Criar nova categoria
    if (!categoryExists) {
      newCategory = categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(newCategory);
    }

    // Criar nova transaction
    const transaction = transactionsRepository.create({
      categories: categoryExists || newCategory,
      title,
      type,
      value,
    });
    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
