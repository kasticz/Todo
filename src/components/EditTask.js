import CreateTask from "./CreateTask";

export default function EditTask(props) {
  return (
    <CreateTask
      setCurrMode={props.setCurrMode}
      setError={props.setError}
      mode="edit"
      item={props.item}
    />
  );
}
