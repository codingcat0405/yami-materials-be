import {Elysia, t} from 'elysia'
import {materialService, userService} from "../services";
import isAuthenticated from "../middlewares/isAuthenticated";
import {Material} from "../entities";


const materialPlugin = new Elysia()
  .group("/materials", (group) =>
    group
      .use(materialService)
      .get('/', async ({materialService, query}) => {
        return await materialService.getMaterials(query)
      }, {
        detail: {
          tags: ['materials'],
        },
        query: t.Object({
          page: t.Optional(t.String()),
          limit: t.Optional(t.String()),
          search: t.Optional(t.String()),
        })
      })
      .get('/:id', async ({materialService, params}) => {
        const {id} = params;
        return await materialService.getMaterialById(+id)
      }, {
        detail: {
          tags: ['materials'],
        },
        params: t.Object({
          id: t.String()
        })
      })
      .derive(isAuthenticated())
      .post('/', async ({materialService, body}) => {
        return await materialService.createMaterial(body)
      }, {
        detail: {
          tags: ['materials'],
          security: [
            {JwtAuth: []}
          ],
        },
        body: Material.toDTO()
      })
      .post('/:id', async ({materialService, body, params}) => {
        const {id} = params;
        return await materialService.updateMaterial(+id, body)
      }, {
        detail: {
          tags: ['materials'],
          security: [
            {JwtAuth: []}
          ],
        },
        body: Material.toDTO(false)
      })
      .delete('/:id', async ({materialService, params}) => {
        return await materialService.deleteMaterial(+params.id)
      }, {
        detail: {
          tags: ['materials'],
          security: [
            {JwtAuth: []}
          ],
        },
      })
  )

export default materialPlugin
