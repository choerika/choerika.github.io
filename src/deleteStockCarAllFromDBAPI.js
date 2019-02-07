import mysql from 'mysql';
import Promise from 'bluebird';
import {deleteStockCarAllFromDB, finishDeleting, dbConnectionConfigToDBAPI} from './services/';

let dbConnectionToDBAPI = mysql.createConnection(dbConnectionConfigToDBAPI());

export const deleteStockCarImage = (exhibitionId) => {
  return new Promise((resolve, reject) => {
    const deleteStockCarImageQuery = `DELETE FROM stock_car_image WHERE exhibition_id = '${exhibitionId}';`;
    dbConnectionToDBAPI.query(deleteStockCarImageQuery, (error, results) => {
      if (error) {
        reject(`DB_API stock_car_image -> ${error.message}`);
        return;
      }
      console.log(results);
      resolve(results);
    });
  })
  .then((results) => {
    return results;
  })
  .catch((e) => {
    console.log('Promiseのcatch');
    console.log(e);
    dbConnectionToDBAPI.destroy();
    dbConnectionToDBAPI = mysql.createConnection(dbConnectionConfigToDBAPI());
    throw e;
  })
  ;
};

export const deleteStockCarEquip = (exhibitionId) => {
  return new Promise((resolve, reject) => {
    const deleteStockCarEquipQuery = `DELETE FROM stock_car_equip WHERE exhibition_id = '${exhibitionId}';`;
    dbConnectionToDBAPI.query(deleteStockCarEquipQuery, (error, results) => {
      if (error) {
        reject(`DB_API stock_car_equip -> ${error.message}`);
        return;
      }
      console.log(results);
      resolve(results);
    });
  })
  .then((results) => {
    return results;
  })
  .catch((e) => {
    console.log('Promiseのcatch');
    console.log(e);
    dbConnectionToDBAPI.destroy();
    dbConnectionToDBAPI = mysql.createConnection(dbConnectionConfigToDBAPI());
    throw e;
  })
  ;
};

export const deleteStockCarCrack = (exhibitionId) => {
  return new Promise((resolve, reject) => {
    const deleteStockCarCrackQuery = `DELETE FROM stock_car_crack WHERE exhibition_id = '${exhibitionId}';`;
    dbConnectionToDBAPI.query(deleteStockCarCrackQuery, (error, results) => {
      if (error) {
        reject(`DB_API stock_car_crack -> ${error.message}`);
        return;
      }
      console.log(results);
      resolve(results);
    });
  })
  .then((results) => {
    return results;
  })
  .catch((e) => {
    console.log('Promiseのcatch');
    console.log(e);
    dbConnectionToDBAPI.destroy();
    dbConnectionToDBAPI = mysql.createConnection(dbConnectionConfigToDBAPI());
    throw e;
  })
  ;
};

export const deleteStockCar = (exhibitionId) => {
  return new Promise((resolve, reject) => {
    const deleteStockCarQuery = `DELETE FROM stock_car WHERE exhibition_id = '${exhibitionId}';`;
    dbConnectionToDBAPI.query(deleteStockCarQuery, (error, results) => {
      if (error) {
        reject(`DB_API stock_car -> ${error.message}`);
        return;
      }
      console.log(results);
      resolve(results);
    });
  })
  .then((results) => {
    return results;
  })
  .catch((e) => {
    console.log('Promiseのcatch');
    console.log(e);
    dbConnectionToDBAPI.destroy();
    dbConnectionToDBAPI = mysql.createConnection(dbConnectionConfigToDBAPI());
    throw e;
  })
  ;
};

export const deleteStockCarAllFromDBAPI = (deleteList, s3Object) => {
  dbConnectionToDBAPI = mysql.createConnection(dbConnectionConfigToDBAPI());
  const deleteStockCarDependenciesList = [
    deleteStockCarImage,
    deleteStockCarEquip,
    deleteStockCarCrack,
  ];
  const promise = deleteStockCarAllFromDB(
    s3Object,
    deleteList,
    deleteStockCarDependenciesList,
    deleteStockCar,
  );
  return finishDeleting(
    promise,
    dbConnectionToDBAPI,
  );
};
