import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand, GetObjectCommand, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand, AbortMultipartUploadCommand, _Object } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const endpoint = process.env.R2_ENDPOINT || '';
const region   = process.env.R2_REGION  || 'auto';
const bucket   = process.env.R2_BUCKET  || '';
const forcePathStyle = true; // R2/S3 compatibles

export const s3 = new S3Client({
  region,
  endpoint,
  forcePathStyle,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string
  }
});

export async function presignPut(key: string, contentType = 'application/octet-stream', expiresSec=300) {
  const cmd = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });
  const url = await getSignedUrl(s3, cmd, { expiresIn: expiresSec });
  return { uploadUrl: url, key, contentType, publicUrl: publicUrl(key) };
}

export async function listObjects(prefix = '', maxKeys = 100) {
  const cmd = new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, MaxKeys: maxKeys });
  const out = await s3.send(cmd);
  return (out.Contents || []) as _Object[];
}

export async function deleteObject(key: string) {
  const cmd = new DeleteObjectCommand({ Bucket: bucket, Key: key });
  await s3.send(cmd);
  return { ok: true };
}

export function publicUrl(key: string) {
  const base = process.env.R2_PUBLIC_BASE || '';
  return base ? `${base.replace(/\/$/,'')}/${key.replace(/^\//,'')}` : null;
}

export async function presignGet(key: string, expiresSec=300) {
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  const url = await getSignedUrl(s3, cmd, { expiresIn: expiresSec });
  return { url, key, expiresSec };
}

export async function getObjectBuffer(key: string) {
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  const out: any = await s3.send(cmd);
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject)=>{
    out.Body.on('data', (c: Buffer)=> chunks.push(c));
    out.Body.on('end', ()=> resolve());
    out.Body.on('error', reject);
  });
  return Buffer.concat(chunks);
}

/** Multipart helpers (server-side, para firmar URLs por parte si se necesitara) */
export async function mpCreate(key: string, contentType='application/octet-stream') {
  const cmd = new CreateMultipartUploadCommand({ Bucket: bucket, Key: key, ContentType: contentType });
  const out = await s3.send(cmd);
  return { uploadId: out.UploadId!, key };
}

export async function mpSignPart(key: string, uploadId: string, partNumber: number) {
  const cmd = new UploadPartCommand({ Bucket: bucket, Key: key, UploadId: uploadId, PartNumber: partNumber });
  const url = await getSignedUrl(s3, cmd, { expiresIn: 600 });
  return { url };
}

export async function mpComplete(key: string, uploadId: string, parts: Array<{ETag:string, PartNumber:number}>) {
  const cmd = new CompleteMultipartUploadCommand({ Bucket: bucket, Key: key, UploadId: uploadId, MultipartUpload: { Parts: parts } });
  const out = await s3.send(cmd);
  return { location: out.Location || null, etag: out.ETag || null };
}

export async function mpAbort(key: string, uploadId: string) {
  const cmd = new AbortMultipartUploadCommand({ Bucket: bucket, Key: key, UploadId: uploadId });
  await s3.send(cmd);
  return { ok: true };
}

