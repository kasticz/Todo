import { useRef, useState } from "react";
import styles from "../stylesComputed/input.module.css";

/**
 * @module  Input_component
 */
/**
 * функция-компонент создает готовый инпут
 * @param {object} - в пропсах должен быть заголовок label, объект с аттрибутами input, функция валидации validation с забинженной функцией изменения формы
 */
export  function Input(props) {
  const [error, setError] = useState("initial");
  const inputRef = useRef();
  const isFile = props.input.type === "file";

  return (
    <div
      onBlur={(e) => {
        props.validation(inputRef.current.value, setError, e);
      }}
      className={styles.input}
    >
      <label htmlFor={props.input.id}>{props.label}</label>
      <span>{error && error !== "initial" ? error : ""}</span>
      <input
        ref={inputRef}
        style={{
          outline: isFile ? "none" : "",
          boxShadow: isFile ? "none" : "",
          borderRadius: isFile ? "0px" : "",
          outlineColor:
            error && error !== "initial"
              ? "#db1010"
              : error === "initial"
              ? ""
              : "#3bc174",
        }}
        {...props.input}
      />
    </div>
  );
}
export default Input