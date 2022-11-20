import Task from "./components/Task";
import "dayjs/locale/ru";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import CreateTask from "./components/CreateTask";
import "./index.css";
import "./stylesComputed/Main.css";
import { fetchTasks } from "./firebase/dbs";
import ViewTask from "./components/ViewTask";

function App() {
  const [currMode, setCurrMode] = useState(["initial", null]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState();
  dayjs.locale("ru");

  useEffect(() => {
    async function fetchFiles() {
      const fetched = [];
      const data = await fetchTasks();
      if (data?.message) {
        setError(data.message);
        return;
      }
      const keys = Object.keys(data || {});
      keys.forEach((item) => {
        fetched.push(data[item]);
      });
      setTasks(fetched);
    }
    if (currMode[0] === "initial") {
      fetchFiles();
    }
  }, [currMode]);

  const tasksComp = useMemo(() => {
    return tasks.length
      ? tasks.map((item) => {
          return (
            <Task
              setError={setError}
              changeMode={setCurrMode}
              key={item.id}
              item={item}
            />
          );
        })
      : "";
  }, [tasks]);

  return (
    <div className="App">
      <div className="container">
        <main>
          <h1
            onClick={() => {
              setCurrMode(["create", null]);
            }}
          >
            Todo приложение
          </h1>

          {error && (
            <p className="error">Что то пошло не так - ошибка {error}</p>
          )}
          <ul className="tasks">{tasksComp}</ul>
          {currMode[0] !== "create" && currMode[0] !== "initial" && (
            <button
              onClick={() => {
                setCurrMode(["create", null]);
              }}
              className="createNewTask"
            >
              Создать новую задачу
            </button>
          )}

          {(currMode[0] === "create" || currMode[0] === "initial") && (
            <CreateTask
              allTitles={tasks.map((item) => item.title)}
              setCurrMode={setCurrMode}
            />
          )}
          {currMode[0] === "view" && tasks.length > 0 && (
            <ViewTask
              setError={setError}
              currMode={currMode}
              item={tasks.find((item) => item.id === currMode[1])}
            />
          )}
          {currMode[0] === "edit" && tasks.length > 0 && (
            <CreateTask
              mode="edit"
              allTitles={tasks.map((item) => item.title)}
              setCurrMode={setCurrMode}
              setError={setError}
              item={tasks.find((item) => item.id === currMode[1])}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
