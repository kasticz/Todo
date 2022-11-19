import { useRef, useState } from "react";
import styles from "../stylesComputed/input.module.css";

export default function Input(props) {
    const [error,setError] = useState('initial');
    const inputRef = useRef()
    const isFile = props.input.type === 'file'


    


  return (
    <div onBlur={(e)=>{props.validation(inputRef.current.value,setError,e)}} className={styles.input}>
        
      <label htmlFor={props.input.id}>{props.label}</label>
      <span>{error && error !== 'initial' ? error : ''}</span>
      <input ref={inputRef}
        style={{ outline: isFile ? "none" : "",boxShadow: isFile ? "none" : "", borderRadius: isFile ? '0px' : '',outlineColor:error && error !== 'initial' ? '#db1010' : error === 'initial' ?'' : '#3bc174'  }}
        {...props.input}
      />
      
    </div>
  );
}
