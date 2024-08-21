import {Repository} from "typeorm";
import {Material} from "../entities";
import {AppDataSource} from "../data-source";
import {Elysia} from "elysia";

class MaterialService {

  private readonly materialRepository: Repository<Material>;

  constructor() {
    this.materialRepository = AppDataSource.getRepository(Material);
  }

  async getMaterials(query: any) {
    const {page = 0, limit = 30, search} = query;
    const options: any = {
      skip: +page * +limit,
      take: +limit,
    };
    if (search) {
      options['where'] = {
        name: search,
        code: search,
        stampCode: search,
      }
    }
    const res = await this.materialRepository.findAndCount(options);
    return {
      data: res[0],
      total: res[1],
      page,
      limit,
    }
  }

  async createMaterial(body: any) {
    const material = this.materialRepository.create(body);
    return await this.materialRepository.save(material);
  }

  async getMaterialById(id: number) {
    return await this.materialRepository.findOneOrFail({
      where: {
        id
      }
    });
  }

  async updateMaterial(id: number, body: any) {
    const material = await this.materialRepository.findOneOrFail({
      where: {
        id
      }
    })
    this.materialRepository.merge(material, body);
    return await this.materialRepository.save(material);
  }

  async deleteMaterial(id: number) {
    const material = await this.materialRepository.findOneOrFail({
      where: {
        id
      }
    })
    //soft delete
    return await this.materialRepository.softRemove(material);
  }
}

export default new Elysia()
  .decorate('materialService', new MaterialService())
