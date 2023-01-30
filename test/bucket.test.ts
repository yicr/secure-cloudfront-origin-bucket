import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { SecureCloudFrontOriginBucket } from '../src';

describe('SecureCloudFrontOriginBucket Testing', () => {

  const app = new App();
  const stack = new Stack(app, 'TestingStack');

  const bucket = new SecureCloudFrontOriginBucket(stack, 'TestingBucket', {
    bucketName: 'origin-bucket',
    cloudFrontOriginAccessIdentityS3CanonicalUserId: 'CloudFront Origin Access Identity XXXXXXXXXXXXXX',
  });

  const template = Template.fromStack(stack);

  it('Is Bucket', () => {
    expect(bucket).toBeInstanceOf(s3.Bucket);
  });

  it('Should have encrypted', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      BucketEncryption: Match.objectEquals({
        ServerSideEncryptionConfiguration: [
          {
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: 'AES256',
            },
          },
        ],
      }),
    });
  });

  it('Allow from CloudFront Origin Access Identity', () => {
    template.hasResourceProperties('AWS::S3::BucketPolicy', {
      Bucket: {
        Ref: Match.stringLikeRegexp('TestingBucket'),
      },
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 's3:GetObject',
            Effect: 'Allow',
            Principal: {
              CanonicalUser: 'CloudFront Origin Access Identity XXXXXXXXXXXXXX',
            },
          }),
        ]),
      },
    });
  });

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot('bucket');
  });
});