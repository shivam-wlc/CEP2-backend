/* eslint-disable */
export default {
  app: {
    title: process.env.TITLE,
  },
  db: process.env.MONGO,
  log: {
    colorize: true,
    json: false,
  },
  package: {
    version: '1.0.0',
  },
  server_api: process.env.SERVER_API,
  port: process.env.PORT || 8080,
  host: process.env.HOST || 'localhost',
  env: process.env.NODE_ENV,
  jwtAccessKey: process.env.JWT_ACCESS_TOKEN,

  /*
   * DOMAIN config should be set to the fully qualified application accessible
   * URL. For example: https://www.myapp.com (including port if required).
   */
  domain: {
    app: process.env.DOMAIN,
  },

  // Onet
  onet_base_url: process.env.ONET_BASE_URL,
  onet_token: process.env.ONET_TOKEN,

  //zyla labs

  zyla_base_url: process.env.ZYLA_BASE_URL,
  zyla_token: process.env.ZYLA_TOKEN,

  //Stripe
  stripe: {
    Publishable_Key: process.env.PUBLISHABLE_KEY,
    Secret_Key: process.env.SECRET_KEY,
  },

  // AWS S3 bucket keys
  aws_region: process.env.AWS_REGION,
  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
  aws_s3_bucket: process.env.AWS_S3_BUCKET,
  aws_s3_domain: process.env.AWS_S3_DOMAIN,
  aws_s3_directory_photos: process.env.AWS_DIRECTORY_PHOTOS,
  aws_s3_directory_videos: process.env.AWS_DIRECTORY_VIDEOS,
  aws_s3_directory_thumbnails: process.env.AWS_DIRECTORY_THUMBNAILS,

  redis: {
    url: process.env.REDISCLOUD_URL || 'redis://127.0.0.1:6379',
    // NOTE: Though the Redis logical database can be embedded into the URL
    // (e.g., `redis://127.0.0.1:6379/1`), keep the database number in a
    // separate configuration parameter for simplicity. Any database number
    // in the URL will be overridden when the Redis connection is opened.
    db: 0,
  },

  // # Node Mailer Credentials for sending emails

  node_mailer: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASSWORD,
    host: process.env.NODE_MAILER_HOST,
    port: process.env.NODE_MAILER_PORT,
  },
};
