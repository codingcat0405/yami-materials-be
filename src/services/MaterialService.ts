import {Repository} from "typeorm";
import {Material} from "../entities";
import {AppDataSource} from "../data-source";
import {Elysia} from "elysia";

class MaterialService {
  private readonly MaterialRepository: Repository<Material>;

  constructor() {
    this.MaterialRepository = AppDataSource.getRepository(Material);
  }
}

export default new Elysia()
  .decorate('materialService', new MaterialService())
