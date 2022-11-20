import dayjs from "dayjs"
import customParseFormat from 'dayjs/plugin/customParseFormat'

/**
 * @module logic_date
 */

/**
 * Принимает дату, форматирует и возвращает её
 * @param {string} date - Дата 
 * @param {boolean} withoudWeekDay - Нужно ли возвращать дату без дня недели, используется для режима редактирования задачи 
 * @returns {string} - форматированная дата
 */
 function getDate(date,withoudWeekDay){
    dayjs.extend(customParseFormat)
    if(withoudWeekDay){
        return dayjs(date,'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm')
    }
   
    const dateFormatted = dayjs(date,'DD-MM-YYYY HH:mm').format('dddd, DD-MM-YYYY HH:mm')

    return dateFormatted
}

export default getDate