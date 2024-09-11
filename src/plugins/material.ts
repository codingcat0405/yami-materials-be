import {Elysia, t} from 'elysia'
import {excelService, materialService, userService} from "../services";
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
      .use(excelService)
      .post('/sync-excel', async ({excelService, body}) => {
        return await excelService.syncExcelData(body)
      }, {
        detail: {
          tags: ['materials'],
          security: [
            {JwtAuth: []}
          ],
        },
        body: t.Object({
          fileName: t.String(),
          config: t.Object({
            dataStartRow: t.Number(),
            stampCodeCol: t.String(),
            codeCol: t.String(),
            nameCol: t.String(),
            entryDateCol: t.String(),
            statusCol: t.String(),
            creatorCodeCol: t.String(),
            deviceCol: t.String(),
            unitCol: t.String(),
          })
        })
      })
  )

export default materialPlugin
