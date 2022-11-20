import dayjs from "dayjs";
import { deleteTask } from "../firebase/dbs";
import customParseFormat from 'dayjs/plugin/customParseFormat'
import styles from "../stylesComputed/task.module.css";
/**
 * @module  Task_component
 */
/**
 * функция-компонент создает интерфейс задачи с возможностью её просмотра, редактирования, удаления
 * @param {object} - в пропсах должен быть объект задачи item
 */

export function Task(props) {
  dayjs.extend(customParseFormat)
  const dateDiff = dayjs(props.item.endDate,'DD-MM-YYYY HH:mm').unix() - dayjs().unix()
  async function deleteT(){
    const err = await deleteTask(props.item)
    if(err?.message){
      props.setError(err.message)
    }else{
      props.changeMode(['initial',null])
    }
  }
  return (
    <li className={styles.task}>
      {dateDiff < 0 && <span className={styles.expiration}>Дата завершения задачи истекла!</span>}
      <p>{props.item.title}</p>
      <div className={styles.buttons}>
        <button onClick={()=>{props.changeMode(['view',props.item.id])}} className={styles.read}>Просмотр</button>
        <button onClick={()=>{props.changeMode(['edit',props.item.id])}} className={styles.edit}>Редактировать</button>
        <button onClick={deleteT} className={styles.delete}>Удалить</button>
      </div>
    </li>
  );
}

export default Task