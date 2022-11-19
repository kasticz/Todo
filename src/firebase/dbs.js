import dayjs from "dayjs";
import { deleteAttached } from "./storage";

export async function createTaskFromForm(form,initialTitle){
    const title = form.get('title');
    const formats = ["DD-MM-YYYY hh:mm","DD-MM-YYYY","DD.MM.YYYY hh:mm","DD.MM.YYYY"]
    const formattedDate = dayjs(form.get('endDate').trim(),formats)
    form.set('endDate',formattedDate)

    let error;


    try{
        const resp = await fetch(`https://react-72706-default-rtdb.europe-west1.firebasedatabase.app/Todo/${title}.json`,{
            method:'PUT',
            body: JSON.stringify({
                title: form.get('title'),
                descr:form.get('descr'),
                endDate: form.get('endDate'),
                finished: form.get('finished') || false
            }),
            headers:{
                'Content-type':'application/json'
            }
           
        })
        if(resp.status !== 200){
            throw new Error(resp.statusText)
        }
        if(initialTitle &&  title !== initialTitle){
            deleteTask({title:initialTitle})
        }
    }catch(err){
        error =  err.message
    }



    if(error) return error


}


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

export async function deleteTask(item){

    try{
        const resp = await fetch(`https://react-72706-default-rtdb.europe-west1.firebasedatabase.app/Todo/${item.title}.json`,{
            method:"DELETE"
        })
        if(resp.status !== 200){
            throw new Error(resp.statusText)
        } 
        await  deleteAttached(item.title)


    }catch(err){
        return err
    }

    

   


}