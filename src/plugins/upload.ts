import {Elysia, t} from "elysia";
import isAuthenticated from "../middlewares/isAuthenticated";
import {getUploadPresigedUrl} from "../utils";

const uploadPlugin = new Elysia()
  .group("/upload", (group) =>
    group
      .derive(isAuthenticated())
      .get('/presigned-url', async ({query}) => {
        const {file} = query;
        const url = await getUploadPresigedUrl(file)
        return {
          uploadUrl: url.replace('http://', 'https://'), //replace http to https to avoid mixed content error in
          publicUrl: `https://s3.lilhuy-services.uk/yami-materials/${file}`
        }
      }, {
        detail: {
          tags: ['upload'],
          security: [
            {JwtAuth: []}
          ],
        },
        query: t.Object({
          file: t.String()
        })
      })
  )

export default uploadPlugin
