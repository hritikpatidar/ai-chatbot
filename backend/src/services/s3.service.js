import {
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import s3 from "../config/s3.js";
import env from "../config/env.js";

export const uploadToS3 = async ({
  buffer,
  mimetype,
  key,
}) => {
  const command = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  });

  await s3.send(command);

  return key;
};

export const deleteFromS3 = async (key) => {
  if (!key) {
    return;
  }

  const command = new DeleteObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: key,
  });

  await s3.send(command);
};