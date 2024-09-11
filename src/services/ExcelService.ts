import {Elysia} from "elysia";
import {Repository} from "typeorm";
import {Material} from "../entities";
import {AppDataSource} from "../data-source";
import axios from "axios";
import * as Excel from 'exceljs';

type syncExcelDTO = {
  fileName: string;
  config: {
    dataStartRow: number;
    stampCodeCol: string;
    codeCol: string;
    nameCol: string;
    entryDateCol: string;
    statusCol: string;
    creatorCodeCol: string;
    deviceCol: string;
    unitCol: string;
  }
}

class ExcelService {
  private readonly materialRepository: Repository<Material>;


  constructor() {
    this.materialRepository = AppDataSource.getRepository(Material);
  }

  async syncExcelData(data: syncExcelDTO) {
    const workBookUrl = `https://s3.lilhuy-services.uk/yami-materials/${data.fileName}`;
    const workbookStreamResp = await axios.get(workBookUrl, {
      responseType: 'stream',
    })
    const workbookStream = workbookStreamResp.data;
    const workbookReader = new Excel.stream.xlsx.WorkbookReader(workbookStream, {
      sharedStrings: 'cache',
      hyperlinks: 'cache',
      worksheets: 'emit',
      styles: 'cache',
    });
    let rowCounter = 0;
    let worksheetCounter = 0;
    const listMaterials: Material[] = [];
    for await (const worksheetReader of workbookReader) {
      worksheetCounter++;
      if (worksheetCounter > 1) {
        //only read first worksheet
        break;
      }
      for await (const row of worksheetReader) {
        //skip header
        if (row.number < data.config.dataStartRow) {
          continue;
        }
        rowCounter++;
        const material = new Material();
        material.stampCode = row.getCell(data.config.stampCodeCol)?.value?.toString() ?? '';
        material.code = row.getCell(data.config.codeCol).value?.toString() ?? '';
        material.name = row.getCell(data.config.nameCol).value?.toString() ?? '';
        material.entryDate = new Date(row.getCell(data.config.entryDateCol).value?.toString() ?? '');
        //check if is invalid date
        if (isNaN(material.entryDate.getTime())) {
          material.entryDate = new Date();
        }
        material.status = row.getCell(data.config.statusCol).value?.toString() ?? '';
        material.creatorCode = row.getCell(data.config.creatorCodeCol).value?.toString() ?? '';
        material.device = row.getCell(data.config.deviceCol).value?.toString() ?? '';
        material.unit = row.getCell(data.config.unitCol).value?.toString() ?? '';
        listMaterials.push(material);
      }
    }

    //save to database
    const saved = await this.materialRepository.save(listMaterials);
    return {
      file: data.fileName,
      saved: saved.length,
      total: rowCounter,
    }
  }
}

export default new Elysia()
  .decorate('excelService', new ExcelService())
