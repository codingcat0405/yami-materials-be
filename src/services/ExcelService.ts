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
    stampCodeCol?: string;
    stampCodeDefault?: string;

    codeCol?: string;
    codeDefault?: string;

    nameCol?: string;
    nameDefault?: string;

    entryDateCol?: string;
    entryDateDefault?: string;

    statusCol?: string;
    statusDefault?: string;

    creatorCodeCol?: string;
    creatorCodeDefault?: string;

    deviceCol?: string;
    deviceDefault?: string;

    unitCol?: string;
    unitDefault?: string;
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
        if (data.config.stampCodeCol) {
          material.stampCode = row.getCell(data.config.stampCodeCol).value?.toString() ?? '';
        } else {
          material.stampCode = data.config.stampCodeDefault ?? '';
        }
        if (data.config.codeCol) {
          material.code = row.getCell(data.config.codeCol).value?.toString() ?? '';
        } else {
          material.code = data.config.codeDefault ?? '';
        }
        if (data.config.nameCol) {
          material.name = row.getCell(data.config.nameCol).value?.toString() ?? '';
        } else {
          material.name = data.config.nameDefault ?? '';
        }
        if (data.config.entryDateCol) {
          material.entryDate = new Date(row.getCell(data.config.entryDateCol).value?.toString() ?? '');
        } else {
          material.entryDate = new Date(data.config.entryDateDefault ?? '');
        }
        //check if is invalid date
        if (isNaN(material.entryDate.getTime())) {
          material.entryDate = new Date();
        }
        if (data.config.statusCol) {
          material.status = row.getCell(data.config.statusCol).value?.toString() ?? '';
        } else {
          material.status = data.config.statusDefault ?? '';
        }
        if (data.config.creatorCodeCol) {
          material.creatorCode = row.getCell(data.config.creatorCodeCol).value?.toString() ?? '';
        } else {
          material.creatorCode = data.config.creatorCodeDefault ?? '';
        }
        if (data.config.deviceCol) {
          material.device = row.getCell(data.config.deviceCol).value?.toString() ?? '';
        } else {
          material.device = data.config.deviceDefault ?? '';
        }
        if (data.config.unitCol) {
          material.unit = row.getCell(data.config.unitCol).value?.toString() ?? '';
        } else {
          material.unit = data.config.unitDefault ?? '';
        }
        if (data.config.unitCol) {
          material.unit = row.getCell(data.config.unitCol).value?.toString() ?? '';
        } else {
          material.unit = data.config.unitDefault ?? '';
        }
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
