// @flow
export const dbConnectionConfigToDBAPI = () => {
  let config;
  switch (process.env.NODE_ENV) {
    case 'development':
      config = {
        host: process.env.DBAPI_HOST_LOCAL,
        user: process.env.DBAPI_USER_LOCAL,
        password: process.env.DBAPI_PASSWORD_LOCAL,
        database: process.env.DBAPI_DATABASE_LOCAL,
      };
      break;
    case 'staging':
      config = {
        host: process.env.DBAPI_HOST_STAGING,
        user: process.env.DBAPI_USER_STAGING,
        password: process.env.DBAPI_PASSWORD_STAGING,
        database: process.env.DBAPI_DATABASE_STAGING,
      };
      break;
    case 'production':
      config = {
        host: process.env.DBAPI_HOST_PRODUCTION,
        user: process.env.DBAPI_USER_PRODUCTION,
        password: process.env.DBAPI_PASSWORD_PRODUCTION,
        database: process.env.DBAPI_DATABASE_PRODUCTION,
      };
      break;
    default:
  }
  return config;
};

export const dbConnectionConfigToOutletDB = () => {
  let config;
  switch (process.env.NODE_ENV) {
    case 'development':
      config = {
        host: process.env.OUTLETDB_HOST_LOCAL,
        user: process.env.OUTLETDB_USER_LOCAL,
        password: process.env.OUTLETDB_PASSWORD_LOCAL,
        database: process.env.OUTLETDB_DATABASE_LOCAL,
      };
      break;
    case 'staging':
      config = {
        host: process.env.OUTLETDB_HOST_STAGING,
        user: process.env.OUTLETDB_USER_STAGING,
        password: process.env.OUTLETDB_PASSWORD_STAGING,
        database: process.env.OUTLETDB_DATABASE_STAGING,
      };
      break;
    case 'production':
      config = {
        host: process.env.OUTLETDB_HOST_PRODUCTION,
        user: process.env.OUTLETDB_USER_PRODUCTION,
        password: process.env.OUTLETDB_PASSWORD_PRODUCTION,
        database: process.env.OUTLETDB_DATABASE_PRODUCTION,
      };
      break;
    default:
  }
  return config;
};

export const dbConnectionConfigToMainDBReplica = () => {
  let config;
  switch (process.env.NODE_ENV) {
    case 'development':
      config = {
        host: process.env.MAINDB_REPLICA_HOST_LOCAL,
        user: process.env.MAINDB_REPLICA_USER_LOCAL,
        password: process.env.MAINDB_REPLICA_PASSWORD_LOCAL,
        database: process.env.MAINDB_REPLICA_DATABASE_LOCAL,
      };
      break;
    case 'staging':
      config = {
        host: process.env.MAINDB_REPLICA_HOST_STAGING,
        user: process.env.MAINDB_REPLICA_USER_STAGING,
        password: process.env.MAINDB_REPLICA_PASSWORD_STAGING,
        database: process.env.MAINDB_REPLICA_DATABASE_STAGING,
      };
      break;
    case 'production':
      config = {
        host: process.env.MAINDB_REPLICA_HOST_PRODUCTION,
        user: process.env.MAINDB_REPLICA_USER_PRODUCTION,
        password: process.env.MAINDB_REPLICA_PASSWORD_PRODUCTION,
        database: process.env.MAINDB_REPLICA_DATABASE_PRODUCTION,
      };
      break;
    default:
  }
  return config;
};
