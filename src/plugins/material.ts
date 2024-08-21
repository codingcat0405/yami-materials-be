import {Elysia, t} from 'elysia'
import {materialService, userService} from "../services";
import isAuthenticated from "../middlewares/isAuthenticated";
import {Material} from "../entities";


const materialPlugin = new Elysia()
  .group("/materials", (group) =>
    group
      .use(materialService)
      .get('/', async ({materialService}) => {
        return [];
      }, {
        detail: {
          tags: ['materials'],
        },
      })
      .get('/:id', async ({materialService, params}) => {
        const {id} = params;
        return {
          id,
        };
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
        return body
      }, {
        detail: {
          tags: ['materials'],
          security: [
            {JwtAuth: []}
          ],
        },
        body: Material.toDTO()
      })
      .post('/:id', async ({materialService, body}) => {
        return body
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
        return params
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
