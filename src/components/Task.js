import { deleteTask } from "../firebase/dbs";
import styles from "../stylesComputed/task.module.css";
/**
 * @module  Task_component
 */
/**
 * функция-компонент создает интерфейс задачи с возможностью её просмотра, редактирования, удаления
 * @param {object} - в пропсах должен быть объект задачи item
 */

export function Task(props) {
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