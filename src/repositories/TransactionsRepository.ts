import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO
    const incomeTransactions = await this.find({ where: { type: 'income' } });

    const outcomeTransactions = await this.find({ where: { type: 'outcome' } });

    const income = incomeTransactions.length === 0 ? 0 : incomeTransactions
      .map(trf => trf.value)
      .reduce((prev, next) => prev + next);

    const outcome = outcomeTransactions.length === 0 ? 0 : outcomeTransactions.map(trf => trf.value).reduce((prev, next) => prev + next)
    const total = income - outcome;
    return { income, outcome, total };
  }
}

export default TransactionsRepository;
