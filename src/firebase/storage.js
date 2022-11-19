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

const imagesRef = ref(storage, "images");

//   const oil = ref(storage,'');

export async function getAllFiles(taskTitle) {
  try{
   
    const files = [];
  
    const taskRef = ref(storage,`files/${taskTitle}`)
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

export async function uploadFiles(files, title) {
  let error;

  try {
    for (let i = 0; i < files.length; i++) {
      if(files[i].size === 0){
        continue
      }
      const newRef = ref(storage, `files/${title}/${files[i].name}`);
      const resp = await uploadBytes(newRef, files[i]);
    }
  } catch (err) {
    error = err.message;
  }

  return error;
}


export async function deleteAttached(title){

  let error;
  try{
    const taskRef = ref(storage,`files/${title}`)
    const allFiles = []
    await listAll(taskRef).then(
      (res) => allFiles.push(...res.items)
    );
    allFiles.forEach(item => deleteObject(item))

  }catch(err){
    error = err.message
  }
  return error;


  
}



