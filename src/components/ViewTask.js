import { useEffect, useState, useMemo } from "react";
import { getAllFiles } from "../firebase/storage";
import getDate from "../logic/getDate";

import styles from "../stylesComputed/viewTask.module.css";
/**
 * @module ViewTask_components
 */

/**
 * функция-компонент позволяет просмотреть данные задачи и загрузить прикрепленные файлы
 * @param {object} - в пропсах должен быть объект задачи item, состояние приложения currMode и функция изменения глобального состояния ошибки setError
 */
export function ViewTask(props) {
  const [attachedFiles, setAttachedFiles] = useState([]);

  // const date = dayjs(getDate('21-11-2022 15:42')).unix() - dayjs().unix()



  useEffect(() => {
    async function getAttached() {
      const fetchedAttached = await getAllFiles(props.item.id);
      if (fetchedAttached.message) {
        props.setError(fetchedAttached.message);
        return;
      }
      setAttachedFiles(fetchedAttached.length > 0 ? fetchedAttached : null);
    }
    setAttachedFiles([]);
    getAttached();
  }, [props.currMode]);

  const attachedComp = useMemo(() => {
    if (!attachedFiles) return "no files";
    return attachedFiles.map((item) => {
      return (
        <li key={item.name} className={styles.file}>
          <a download={item.name} href={URL.createObjectURL(item)}>
            {item.name}
          </a>
          <span>{Number(item.size / 1024 / 1024).toFixed(1)} Мб</span>
        </li>
      );
    });
  }, [attachedFiles]);



  return (
    <div>
      <h2 className={styles.viewPageTitle}>Просмотр задачи</h2>
      <div className={styles.isFinished}>
        Задача {props.item.finished ? 'выполнена' : "не выполнена"}
      </div>
      <div className={styles.itemField}>
        <h3>Заголовок</h3>
        <p>{props.item.title}</p>
      </div>
      <div className={styles.itemField}>
        <h3>Описание</h3>
        <p>{props.item.descr}</p>
      </div>
      <div className={styles.itemField}>
        <h3>Дата завершения</h3>
        <p>{getDate(props.item.endDate)}</p>
      </div>
      <ul className={styles.attachedList}>
        <h3>Прикрепленные файлы</h3>
        {attachedFiles?.length && attachedFiles.length > 0 ? (
          attachedComp
        ) : attachedComp === "no files" ? (
          <p className={styles.downloadMsg}>У этой задачи нет прикрепленных файлов</p>
        ) : (
          <p className={styles.downloadMsg}>Идет Загрузка прикрепленных файлов...</p>
        )}
      </ul> 
    </div>
  );
}

export default ViewTask