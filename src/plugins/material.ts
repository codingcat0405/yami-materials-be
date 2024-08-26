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
      .get('/stamp-code/:code', async ({materialService, params}) => {
        const {code} = params;
        return await materialService.findByStampCode(code);
      }, {
        detail: {
          tags: ['materials'],
        },
        params: t.Object({
          code: t.String()
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
      .post('/bulk-cud', async ({materialService, body}) => {
        return await materialService.bulkCUD(body)
      }, {
        detail: {
          tags: ['materials'],
          security: [
            {JwtAuth: []}
          ],
        },
        body: t.Object({
          listCreate: t.Array(Material.toDTO()),
          listUpdate: t.Array(Material.toDTO(false)),
          listDelete: t.Array(t.Number())
        })
      })
  )

export default materialPlugin
