import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
  deleteObject
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyABp5j3JfZO75hJU1n8D3x6_xKudw17Dgk",
  authDomain: "react-72706.firebaseapp.com",
  databaseURL:
    "https://react-72706-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "react-72706",
  storageBucket: "react-72706.appspot.com",
  messagingSenderId: "868596798886",
  appId: "1:868596798886:web:dfcb11709225e38210ab67",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage();

export const storageRef = ref(storage);
/**
 * @module firebase_storage
 */

/**
 * Загружает все прикрепленные файлы по ID задачи
 * @param {number} taskID - ID задачи 
 * @returns {Array<object> | object} - массив blob файлов или объект ошибки
 */
export async function getAllFiles(taskID) {
  try{
   
    const files = [];
  
    const taskRef = ref(storage,`files/${taskID}`)
    const fetchedRefsForTask = [];
    const finalFilesForTask = []
    await listAll(taskRef).then(
      (res) => fetchedRefsForTask.push(...res.items)
    );
  
    for (let i = 0; i < fetchedRefsForTask.length; i++) { 
      const resp = await getDownloadURL(fetchedRefsForTask[i])
      const file = await fetch(resp).then(data => data.blob())
      file.name = fetchedRefsForTask[i].name
      finalFilesForTask.push(file)
    }
  
    return finalFilesForTask;

  }catch(err){
    return err
  }



}
/**
 * Загружает файлы в firebase storage
 * @param {Array<object>} files - массив blob файлов
 * @param {number} taskId -  ID задачи 
 * @returns {undefined | object} - объект ошибки или ничего, если загрузка выполнилась успешно
 */
export async function uploadFiles(files, taskId) {
  let error;

  try {
    for (let i = 0; i < files.length; i++) {
      if(files[i].size === 0){
        continue
      }
      const newRef = ref(storage, `files/${taskId}/${files[i].name}`);
      const resp = await uploadBytes(newRef, files[i]);
    }
  } catch (err) {
    error = err;
  }

  return error;
}

/**
 * Удаляет прикрепленные к задаче файлы по ID
 * @param {number} taskID - ID задачи
 * @returns {undefined | object} - объект ошибки или ничего, если удаление выполнилось успешно
 */
export async function deleteAttached(taskID){

  let error;
  try{
    const taskRef = ref(storage,`files/${taskID}`)
    const allFiles = []
    await listAll(taskRef).then(
      (res) => allFiles.push(...res.items)
    );
    allFiles.forEach(item => deleteObject(item))

  }catch(err){
    error = err
  }
  return error;

}



