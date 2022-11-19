import dayjs from "dayjs"

export default function getDate(date,withoudWeekDay){
    if(withoudWeekDay){
        return dayjs(date).format('DD-MM-YYYY HH:mm')
    }
    const days={
        Monday:'Понедельник',
        Tuesday:'Вторник',
        Wednesday:'Среда',
        Thursday:'Четверг',
        Friday:'Пятница',
        Saturday:'Суббота',
        Sunday:'Воскресенье'
    }

    const dateFormatted = dayjs(date).format('dddd, DD-MM-YYYY HH:mm')
    const day = dateFormatted.slice(0,dateFormatted.indexOf(','))
    return dateFormatted.replace(day,days[day])
}