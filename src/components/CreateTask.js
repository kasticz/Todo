import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Input from "./Input";
import styles from "../stylesComputed/createForm.module.css";
import {
  AttachedValidation,
  DateValidation,
  DescrValidation,
  TitleValidation,
} from "../logic/validations";
import { createTaskFromForm } from "../firebase/dbs";
import { deleteAttached, getAllFiles, uploadFiles } from "../firebase/storage";
import getDate from "../logic/getDate";


/**
 * @module  CreateTask_component
 */

/**
 * функция-компонент создает форму создания или редактирования задачи
 * @param    {object} props в пропсы должны быть переданы : массив с уже существующими заголовками задач allTitles, функция изменения глобального состояния приложения(edit,view,initial) setCurrMode, функция изменения глобального состояния ошибки setError, флаг состояния редактирования edit и уже существующий объект задачи(при редактировании) item
 */
export function CreateTask(props) {
  const editFlag = props?.mode === "edit";
  const [descrError, setDescrError] = useState("initial");
  const [formStatus, setFormStatus] = useState({
    title: editFlag,
    descr: editFlag,
    endDate: editFlag,
    attached: "initial",
  });
  const [createTaskResult, setcreateTaskResult] = useState();
  const [allreadyAttached, setAllreadyAttached] = useState([]);
  const finishRef = useRef();
  const formRef = useRef();
  const textRef = useRef();
  const formValid = !Object.values(formStatus).includes(false);

  const presentedDate = editFlag ? getDate(props.item.endDate, true) : "";

  useEffect(() => {
    async function getAttached() {
      setAllreadyAttached(["loading"]);
      const fetchedAttached = await getAllFiles(props.item.id);
      if (fetchedAttached.message) {
        props.setError(fetchedAttached.message);
        return;
      }
      setAllreadyAttached(fetchedAttached.length > 0 ? fetchedAttached : []);
    }
    if (editFlag) {
      getAttached();
    }
  }, [props.item]);

  const allreadyAttachedComp = useMemo(() => {
    if (!editFlag) return [];
    return allreadyAttached.map((item) => {
      if (item === "loading") return <span key={item}>Загружаем файлы...</span>;
      return (
        <li key={item.name} className={styles.file}>
          <a download={item.name} href={URL.createObjectURL(item)}>
            {item.name}
          </a>
          <span>{Number(item.size / 1024 / 1024).toFixed(1)} Мб</span>
        </li>
      );
    });
  }, [allreadyAttached, editFlag]);

  async function createTask(e) {
    e.preventDefault();
    const form = new FormData(formRef.current);
    const attached = form.getAll("attached");
    form.delete("attached");
    setcreateTaskResult({ loading: true });
    const id = props?.item?.id || Math.round(Math.random() * 1000000);
    const errorForm = await createTaskFromForm(form, id);
    let errorFiles = !errorForm ? await uploadFiles(attached, id) : "";

    if (errorForm?.message) {
      setcreateTaskResult({ err: errorForm.message });
    } else if (errorFiles?.message) {
      setcreateTaskResult({ err: errorFiles.message });
    } else {
      setcreateTaskResult({ success: "Задача успешно создана" });
      setTimeout(() => {
        props.setCurrMode(["initial", null]);
      }, 1000);
    }
  }

  return (
    <Fragment>
      <h2 className={styles.createTitle}>
        {editFlag ? "Редактировать задачу" : "Создать новую задачу"}
      </h2>
      {createTaskResult?.err && (
        <p className={styles.createTaskError}>
          {`Что-то пошло не так - ошибка ${createTaskResult}`}
        </p>
      )}
      {createTaskResult?.loading && (
        <p className={styles.createTaskLoading}>Подождите, идет загрузка ...</p>
      )}
      {createTaskResult?.success && (
        <p className={styles.createTaskSuccess}>
          {" "}
          {editFlag
            ? "Задача успешно отредактирована"
            : createTaskResult.success}
        </p>
      )}
      <form className={styles.createForm} ref={formRef} onSubmit={createTask}>
        <Input
          validation={TitleValidation.bind(
            null,
            setFormStatus,
            props.allTitles,
            props?.item?.title
          )}
          label="Заголовок"
          input={{
            key: props?.item?.title || 1,
            type: "text",
            id: "title",
            name: "title",
            required: true,
            defaultValue: editFlag ? props.item.title : "",
          }}
        />
        <div
          onBlur={() => {
            DescrValidation(
              setFormStatus,
              textRef.current.value,
              setDescrError
            );
          }}
          className={styles.textArea}
        >
          <label htmlFor="descr">Описание</label>
          <span>
            {descrError && descrError !== "initial" ? descrError : ""}
          </span>
          <textarea
            key={props?.item?.descr || 2}
            required
            style={{
              outlineColor:
                descrError && descrError !== "initial"
                  ? "#db1010"
                  : descrError === "initial"
                  ? ""
                  : "#3bc174",
            }}
            ref={textRef}
            defaultValue={editFlag ? props.item.descr : ""}
            name="descr"
            id="descr"
            rows="15"
          ></textarea>
        </div>
        <Input
          validation={DateValidation.bind(null, setFormStatus)}
          label="Дата Завершения"
          input={{
            type: "text",
            id: "endDate",
            name: "endDate",
            required: true,
            key: props?.item?.endDate || 3,
            defaultValue: presentedDate,
          }}
        />
        {editFlag && (
          <Fragment>
            <div className={styles.alreadyAttachedFiles}>
              <p>Прикрепленные файлы</p>
              <ul className={styles.allreadyAttached}>
                {allreadyAttachedComp}
              </ul>
              {allreadyAttachedComp.length > 0 ? (
                <button
                  onClick={() => {
                    deleteAttached(props.item.id);
                    setAllreadyAttached([]);
                  }}
                >
                  Удалить уже прикрепленные файлы
                </button>
              ) : (
                <span>Прикрепленных файлов нет</span>
              )}
            </div>
            <div className={styles.finishTask}>
              <label htmlFor="finishTask">Задача выполнена?</label>
              <input
                key={props.item.finished || 4}
                name="finished"
                ref={finishRef}
                id="finishTask"
                type="checkbox"
                defaultChecked={props.item.finished}
              />
            </div>
          </Fragment>
        )}
        <Input
          validation={AttachedValidation.bind(null, setFormStatus)}
          label="Прикрепить файлы"
          input={{
            type: "file",
            id: "attached",
            multiple: true,
            name: "attached",
            key: props?.item?.title || 5,
          }}
        />
        <button
          disabled={!formValid}
          className={formValid ? "" : styles.disabledButton}
        >
          {editFlag ? "Редактировать задачу" : "Создать задачу"}
        </button>
      </form>
    </Fragment>
  );
}
export default CreateTask