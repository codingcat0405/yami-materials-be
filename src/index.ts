import {Elysia} from "elysia";
import {cors} from "@elysiajs/cors";
import {swagger} from '@elysiajs/swagger'
import {AppDataSource} from "./data-source";
import responseMiddleware from "./middlewares/responseMiddleware";
import errorMiddleware from "./middlewares/errorMiddleware";
import {jwt} from '@elysiajs/jwt'
import {authPlugin} from "./plugins";
import materialPlugin from "./plugins/material";
import uploadPlugin from "./plugins/upload";

const jwtConfig: any = {
  name: 'jwt',
  //when run test the env is not loaded
  secret: process.env.JWT_SECRET,
  exp: '1y',
}


const initWebServer = () => {
  const app = new Elysia()
    .use(cors())
    .use(swagger(
      {
        path: '/swagger-ui',
        provider: 'swagger-ui',
        documentation: {
          info: {
            title: 'Yami materials API',
            description: 'Yami materials API Documentation',
            version: '1.0.0',
          },
          components: {
            securitySchemes: {
              JwtAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Enter JWT Bearer token **_only_**'
              }
            }
          },
        },
        swaggerOptions: {
          persistAuthorization: true,
        }
      }
    ))
    .get("/", () => "Health check: Server's started!")
    .onAfterHandle(responseMiddleware)
    .onError(errorMiddleware)
    .use(jwt(jwtConfig))

    .group("/api", (group) =>
        group
          .use(authPlugin)
          .use(materialPlugin)
          .use(uploadPlugin)
      //add more plugins here
    )
    .listen(process.env.PORT || 3000);

  console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
  console.log(`🚀 Swagger UI is running at http://${app.server?.hostname}:${app.server?.port}/swagger-ui`)
}

const main = async (retries = 3) => {
  try {
    await AppDataSource.initialize()
    console.log('Database connected to url ' + process.env.DATABASE_URL);
    initWebServer()
  } catch (err: any) {
    if (retries === 0) {
      throw new Error(err)
    }
    console.log('Retrying database connection in 5 seconds...')
    setTimeout(async () => {
      await main(retries - 1)
    }, 5000)
  }
}

main().then()


