export const DEFAULT_ALIAS = Symbol('DEFAULT_ALIAS');

export const ACL = {
  AUTHENTICATED_READ: 'authenticated-read',
  AWS_EXEC_READ: 'aws-exec-read',
  BUCKET_OWNER_FULL_CONTROL: 'bucket-owner-full-control',
  BUCKET_OWNER_READ: 'bucket-owner-read',
  PRIVATE: 'private',
  PUBLIC_READ: 'public-read',
  PUBLIC_READ_WRITE: 'public-read-write',
} as const;

export type Acl = (typeof ACL)[keyof typeof ACL];
