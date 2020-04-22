import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import parse from 'csv-parse';
import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';

interface TransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  directory = uploadConfig.directory;

  private async loadCsv(filePath: string): any[] {
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

    return lines;
  }

  private async generateTransaction(input: string[]): Promise<TransactionDTO> {
    const transaction: TransactionDTO = {
      title: input[0],
      type: input[1],
      value: parseFloat(input[2]),
      category: input[3],
    };

    return transaction;
  }

  public async execute(file: Express.Multer.File): Promise<any> {
    // Promise<Transaction[]>
    // TODO
    const csvFilePath = `${this.directory}/${file.filename}`;
    const data = await this.loadCsv(csvFilePath);
    console.log(file);
    console.log(data);
    const transactions = data.map(trs => {
      return this.generateTransaction(trs);
    });
    console.log(transactions);
  }
}

export default ImportTransactionsService;
