# Secure CloudFront Origin Bucket (for CDK v2)

An AWS CDK construct library to create secure S3 buckets for CloudFront origin. 

## Install

### TypeScript

```shell
npm install @yicr/secure-cloudfront-origin-bucket
```
or
```shell
yarn add @yicr/secure-cloudfront-origin-bucket
```

## Example(TypeScript)

```shell
npm install @yicr/secure-cloudfront-origin-bucket
```

```typescript
import { SecureCloudFrontOriginBucket } from '@yicr/secure-cloudfront-origin-bucket';

const oai = new cloudfront.OriginAccessIdentity(stack, 'OriginAccessIdentity');

new SecureCloudFrontOriginBucket(stack, 'SecureCloudFrontOriginBucket', {
  bucketName: 'example-origin-bucket',
  cloudFrontOriginAccessIdentityS3CanonicalUserId: oai.cloudFrontOriginAccessIdentityS3CanonicalUserId,
});

```