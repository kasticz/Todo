import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

/**
 * @module logic_validations
 */

/**
 * Валидация значения поля 'title' формы создания или редактирования задачи. Заголовок не должен быть пустыи и повторять уже существующие.
 * @param {function} setForm -  устанавливает state формы после валидации
 * @param {Array<string>} allTitles - массив уже существующих заголовков задач
 * @param {string|undefined} currTitle - изначальный заголовок для сравнения с отредактированным(только в режиме редактирования)
 * @param {string} input - значение поля 'title'
 * @param {function}setError - устанавливает state ошибки после валидации
 */
export function TitleValidation(setForm, allTitles, currTitle, input, setError) {
  const i = input.trim();
  let error = "";
  if (!i) {
    error = "Заголовок не должен быть пустым";
  }
  if (allTitles.includes(i) && i !== currTitle) {
    error = "Такой заголовок уже существует";
  }
  if (error) {
    setError(error);
    setFormError(setForm, "title", false);
    return;
  }

  setError(false);
  setFormError(setForm, "title", true);
}
/**
 * Валидация значения поля 'descr' формы создания или редактирования задачи. Описание не должно быть пустым.
 * @param {function} setForm -  устанавливает state формы после валидации
 * @param {string} input - значение поля 'descr'
 * @param {function} setError - устанавливает state ошибки после валидации
 */
export function DescrValidation(setForm, input, setError) {
  if (!input.trim()) {
    setError("Описание не должно быть пустым");
    setFormError(setForm, "descr", false);
    return;
  }

  setFormError(setForm, "descr", true);
  setError(false);
}
/**
 * Валидация значения поля 'endDate' формы создания или редактирования задачи. Дата должна быть создана в одном из следующих форматов : ["DD-MM-YYYY HH:mm","DD-MM-YYYY","DD.MM.YYYY hh:mm","DD.MM.YYYY"] и не быть раньше настоящего времени
 * @param {function} setError -  устанавливает state формы после валидации
 * @param {string} input - значение поля 'endDate'
 * @param {function} setError - устанавливает state ошибки после валидации
 */
export function DateValidation(setForm, input, setError) {
  dayjs.extend(customParseFormat);
  const trimmed = input.trim();
  const formats = [
    "DD-MM-YYYY HH:mm",
    "DD-MM-YYYY",
    "DD.MM.YYYY hh:mm",
    "DD.MM.YYYY",
  ];
  const formatted = dayjs(trimmed, formats);
  let err;

  if (formatted.unix() < dayjs().unix()) {
    err = "Дата завершения не должна быть раньше настоящего времени";
  }
  if (!formatted.isValid()) {
    err = "Введите данные в формате DD.MM.YYYY hh:mm или DD.MM.YYYY";
  }
  if (err) {
    setError(err);
    setFormError(setForm, "endDate", false);
    return;
  }
  setFormError(setForm, "endDate", true);
  setError(false);
}
/**
 * Валидация значения поля 'attached' формы создания или редактирования задачи. Прикрепленные файлы не должны быть больше 10 МБ.
 * @param {function} setForm -  устанавливает state формы после валидации
 * @param {string} input -  путь файлов
 * @param {function} setError - устанавливает state ошибки после валидации
 * @param {Event} e - объект события, для просмотра размера файлов
 */
export function AttachedValidation(setForm, input, setError, e) {
  const maxMB = 10;
  const maxSize = 1048576 * maxMB;
  const files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    if (files[i].size > maxSize) {
      setError(
        `${files[i].name} слишком большой. Размер файла не должен превышать 10 МБ`
      );
      setFormError(setForm, "attached", false);
      return;
    }
  }

  setFormError(setForm, "attached", true);
  setError(false);
}
/**
 * устанавливает результат валидации в state формы
 * @param {function} set - функция обновления state формы
 * @param {string} inputName - названия поля формы
 * @param {boolean} inputStatus - результат валидации поля формы
 */
function setFormError(set, inputName, inputStatus) {
  set((prevState) => {
    const updatedForm = { ...prevState };
    updatedForm[inputName] = inputStatus;
    return updatedForm;
  });
}
