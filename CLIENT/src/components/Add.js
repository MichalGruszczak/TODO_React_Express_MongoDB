import React, { useState, useContext } from "react";
import "./Add.css";
import { TasksContext } from "../context/tasksContext";
import { UserContext } from "../context/userContext";
import { LoadingContext } from "../context/loadingContext";
import { useTranslation } from "react-i18next";

const Add = () => {
  const { userName, userID, token } = useContext(UserContext);
  const [userNameValue, setUserNameValue] = userName;
  const [userIDValue, setUserIDValue] = userID;
  const [tokenValue, setTokenValue] = token;
  const [t, i18n] = useTranslation();

  const [isLoading, setIsLoading] = useContext(LoadingContext);

  const [tasks, setTasks] = useContext(TasksContext);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(1);
  const [deadline, setDeadline] = useState("");
  const [titleError, setTitleError] = useState("");
  const [deadlineError, setDeadlineError] = useState("");

  const getData = () => {
    fetch(`http://localhost:5000/api/items/${userIDValue}`, {
      method: "GET",
      headers: {
        "x-auth-token": `${tokenValue}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.log(err));
  };

  // Open and close modal
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  // Add new task with validation
  const addTask = () => {
    const newTask = {
      title: title,
      description: description,
      priority: priority,
      deadline: deadline,
    };

    if (!title) {
      setTitleError("This field cannot be empty!");
    }
    if (!deadline) return setDeadlineError("Select a deadline date!");

    if (!titleError && !deadlineError) {
      fetch(`http://localhost:5000/api/items/${userIDValue}/add`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": `${tokenValue}`,
        },
        body: JSON.stringify(newTask),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
      setIsLoading(true);
      setTitle("");
      setDescription("");
      setPriority(1);
      setDeadline("");
      setTimeout(() => {
        toggle();
        getData();
      }, 100);
    }
  };

  const addDemoTask = () => {
    const currentDate = new Date();
    let date1 = new Date(currentDate);
    const beginDate = date1.toISOString().slice(0, 10);

    const newDemoTask = {
      _id: Math.floor(Math.random() * 999999),
      done: false,
      finishDate: null,
      title: title,
      description: description,
      priority: priority,
      deadline: deadline,
      beginDate: beginDate,
    };

    if (!title) {
      setTitleError(t("Add.EmptyError"));
    }
    if (!deadline) return setDeadlineError(t("Add.DeadlineError"));

    if (!titleError && !deadlineError) {
      const dTasks = [...tasks];
      dTasks.push(newDemoTask);
      setTasks(dTasks);
      setTitle("");
      setDescription("");
      setPriority(1);
      setDeadline("");
      toggle();
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    {
      userIDValue ? addTask() : addDemoTask();
    }
  };

  return (
    <>
      <button onClick={toggle} className="add">
        {t("Add.Add")}
      </button>
      <div className={isOpen ? "add__active" : "add__background"}>
        <div className="add__modal">
          <div onClick={toggle} className="add__close">
            <span>X</span>
          </div>
          <h2 className="add__modalTitle">{t("Add.ModalTitle")}</h2>
          <form action="" className="add__form">
            <div className="add__container">
              <label htmlFor="title" className="add__label">
                {t("Add.ModalTaskTitle")}
              </label>
              <input
                value={title}
                onFocus={() => setTitleError("")}
                onChange={(e) => setTitle(e.target.value)}
                id="title"
                type="text"
                className="add__title add__input"
              />
            </div>
            {titleError ? titleError : ""}
            <div className="add__container">
              <label htmlFor="description" className="add__label">
                {t("Add.ModalDescription")}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="description"
                className="add__description add__input"
                name="description"
                cols="20"
                rows="5"
              ></textarea>
            </div>
            <div className="add__container">
              <label htmlFor="priority" className="add__label">
                {t("Add.ModalPriority")}
              </label>
              <input
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="add__priority add__input"
                type="range"
                id="priority"
                min="1"
                max="3"
              ></input>
            </div>
            <div className="add__container">
              <label htmlFor="deadline" className="add__label">
                {t("Add.ModalDeadline")}
              </label>
              <input
                value={deadline}
                onFocus={() => setDeadlineError("")}
                onChange={(e) => setDeadline(e.target.value)}
                id="deadline"
                className="add__deadline add__input"
                type="date"
                value="now"
              />
            </div>
            {deadlineError ? deadlineError : ""}

            <input
              onClick={handleAddTask}
              className="add__btn"
              type="submit"
              value={t("Add.ModalButton")}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Add;
