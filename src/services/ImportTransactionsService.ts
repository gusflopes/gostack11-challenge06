// import { getRepository } from 'typeorm'
import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
// import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService'
import Transaction from '../models/Transaction';

interface TransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  directory = uploadConfig.directory;

  private async loadCsv(filePath: string): Promise<string[][]> {
    // code
    const readCSVStream = fs.createReadStream(filePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });
    const parseCsv = readCSVStream.pipe(parseStream);

    const lines = [] as any[];

    parseCsv.on('data', line => {
      lines.push(line);
    });
    await new Promise(resolve => {
      parseCsv.on('end', resolve);
    });

    // console.log('lines', lines)
    return lines;
  }

  private generateTransaction(input: string[]): TransactionDTO {
    const transaction: TransactionDTO = {
      title: input[0],
      type: input[1] === 'income' ? 'income' : 'outcome',
      value: parseFloat(input[2]),
      category: input[3],
    };

    return transaction;
  }

  public async execute(file: Express.Multer.File): Promise<any> {
    // Promise<Transaction[]>
    // TODO
    const createTransactionService = new CreateTransactionService()
    // const transactionRepository = getRepository(Transaction)
    const csvFilePath = `${this.directory}/${file.filename}`;
    const data = await this.loadCsv(csvFilePath);
    // console.log('file', file);
    // console.log('data', data);
    const transactions = data.map(trs => {
      return this.generateTransaction(trs);
    });
    // console.log('transactions', transactions);

    const persistTransactions = async () => {
      return Promise.all(transactions.map(async (transaction) => {
        const persisted = await createTransactionService.execute(transaction, true)
        // console.log(transaction)
        // console.log(persisted)
        return persisted
      }))
    }

    return persistTransactions().then(data => { return data })
  }
}

export default ImportTransactionsService;
