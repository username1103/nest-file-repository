export const DEFAULT_ALIAS = Symbol('DEFAULT_ALIAS');

export const S3ACL = {
  AUTHENTICATED_READ: 'authenticated-read',
  AWS_EXEC_READ: 'aws-exec-read',
  BUCKET_OWNER_FULL_CONTROL: 'bucket-owner-full-control',
  BUCKET_OWNER_READ: 'bucket-owner-read',
  PRIVATE: 'private',
  PUBLIC_READ: 'public-read',
  PUBLIC_READ_WRITE: 'public-read-write',
} as const;

export type S3Acl = (typeof S3ACL)[keyof typeof S3ACL];

export const GCSACL = {
  AUTHENTICATED_READ: 'authenticatedRead',
  BUCKET_OWNER_FULL_CONTROL: 'bucketOwnerFullControl',
  BUCKET_OWNER_READ: 'bucketOwnerRead',
  PRIVATE: 'private',
  PROJECT_PRIVATE: 'projectPrivate',
  PUBLIC_READ: 'publicRead',
} as const;

export type GCSAcl = (typeof GCSACL)[keyof typeof GCSACL];
