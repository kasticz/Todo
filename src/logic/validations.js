import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
export function TitleValidation(setForm,input,setError,allInputs){
    if(!input.trim()){
        setError('Заголовок не должен быть пустым')
        setFormError(setForm,"title",false)
        return
    }

    setError(false)
    setFormError(setForm,"title",true)
    // return !allInputs.includes(input) && !input

}

export function DescrValidation(setForm,input,setError){
    if(!input.trim()){
        setError('Описание не должно быть пустым')
        setFormError(setForm,"descr",false)
        return
    }

    setFormError(setForm,"descr",true)
    setError(false)
}

export function DateValidation(setForm,input,setError){
    dayjs.extend(customParseFormat)
    const trimmed = input.trim()
    const formats = ["DD-MM-YYYY hh:mm","DD-MM-YYYY","DD.MM.YYYY hh:mm","DD.MM.YYYY"]
    const formatted = dayjs(trimmed,formats)
    let err;
    
    if(formatted.unix() < dayjs().unix()){
        err = 'Дата завершения не должна быть раньше настоящего времени'
    }
    if(!formatted.isValid()){
        err = 'Введите данные в формате DD.MM.YYYY hh:mm или DD.MM.YYYY' 
    }
    if(err){
        setError(err)
        setFormError(setForm,"endDate",false)
        return; 
    }
    setFormError(setForm,"endDate",true)
    setError(false)

}

export function AttachedValidation(setForm,input,setError,e){
    const maxMB = 10;
    const maxSize = 1048576 * maxMB
    const files = e.target.files;
    for(let i = 0; i < files.length;i++){
        if(files[i].size > maxSize){
            setError(`${files[i].name} слишком большой. Размер файла не должен превышать 10 МБ`)
            setFormError(setForm,'attached',false)
            return
        }

    }
    
    setFormError(setForm,"attached",true)
    setError(false)
}

function setFormError(set,inputName,inputStatus){
    set((prevState)=>{
        const updatedForm = {...prevState};
        updatedForm[inputName] = inputStatus;
        return updatedForm      
    })
}

