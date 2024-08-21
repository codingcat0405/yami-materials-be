import {Page} from "./types";
import {Client} from "minio";

export function toPageDTO<T>(findAndCount: [T[], number], page: number, limit: number): Page<T> {
  return {
    page,
    limit,
    total: findAndCount[1],
    contents: findAndCount[0]
  }
}

const client = new Client({
  endPoint: 's3.lilhuy-services.uk',
  accessKey: 'OH2kDqR1DMLeil2eTq6i',
  secretKey: 'ZxZuhHm1XszabWc4I8qfEkB6MR4ZsghKgLoVU9Gc',
  port: 80,
  useSSL: false,
  region: 'default'
});

export const getUploadPresigedUrl = async (fileName: string) => {
  return await client.presignedPutObject('yami-materials', fileName, 1000)
}
