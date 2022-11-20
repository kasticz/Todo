import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { deleteAttached } from "./storage";

/**
 * @module firebase_database
 */

/**
 * загружает объект задачи в базу данных firebase или редактирует уже существующую задачу
 * @param {FormData} form - объект формы задачи с полями title,descr,endDate,finished
 * @param {number} id - id задачи 
 * @returns {undefined | object} - объект ошибки или undefined, если ошибки нет
 */
export async function createTaskFromForm(form,id){
    dayjs.extend(customParseFormat)
    const formats = ["DD-MM-YYYY HH:mm","DD-MM-YYYY","DD.MM.YYYY HH:mm","DD.MM.YYYY"]
    const formattedDate = dayjs(form.get('endDate').trim(),formats).format("DD-MM-YYYY HH:mm")
    form.set('endDate',formattedDate)


  
    const body = JSON.stringify({
        id: id,
        title: form.get('title'),
        descr:form.get('descr'),
        endDate: form.get('endDate'),
        finished: form.get('finished') || false
    })


    let error;


    try{
        const resp = await fetch(`https://react-72706-default-rtdb.europe-west1.firebasedatabase.app/Todo/${id}.json`,{
            method:'PUT',
            body: body ,
            headers:{
                'Content-type':'application/json'
            }
           
        })
        if(resp.status !== 200){
            throw new Error(resp.statusText)
        }
    }catch(err){
        error =  err
    }



    if(error) return error


}


/**
 * Загружает все задачи из базы данных firebase
 * @returns {object} - объект со всеми задачами или объект ошибки
 */

export async function fetchTasks(){
    let error;
    let data;
    
    try{
        const resp = await fetch(`https://react-72706-default-rtdb.europe-west1.firebasedatabase.app/Todo.json`)
        if(resp.status !== 200){
            throw new Error(resp.statusText)
        }

         data = await resp.json()

    }catch(err){
        error =  err
    }

    return data || error;
}
/**
 * Удаляет задачу из базы данных firebase
 * @param {object} item - объект задачи
 * @returns {undefined | object} - объект ошибки или undefined, если ошибки нет
 */
export async function deleteTask(item){

    try{
        const resp = await fetch(`https://react-72706-default-rtdb.europe-west1.firebasedatabase.app/Todo/${item.id}.json`,{
            method:"DELETE"
        })
        if(resp.status !== 200){
            throw new Error(resp.statusText)
        } 
        await  deleteAttached(item.id)


    }catch(err){
        return err
    }
  
}