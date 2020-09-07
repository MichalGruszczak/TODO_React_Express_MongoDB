import React, { useState, useContext } from "react";
import "./Edit.css";
import { TasksContext } from "../context/tasksContext";
import { UserContext } from "../context/userContext";
import { LoadingContext } from "../context/loadingContext";
import { useTranslation } from "react-i18next";

const Edit = (props) => {
  const { userName, userID, token } = useContext(UserContext);
  const [userNameValue, setUserNameValue] = userName;
  const [userIDValue, setUserIDValue] = userID;
  const [tokenValue, setTokenValue] = token;
  const [t, i18n] = useTranslation();

  const [isLoading, setIsLoading] = useContext(LoadingContext);

  const [tasks, setTasks] = useContext(TasksContext);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(props.title);
  const [description, setDescription] = useState(props.description);
  const [priority, setPriority] = useState(props.priority);
  const [deadline, setDeadline] = useState(props.deadline);
  const [titleError, setTitleError] = useState("");

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

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const editTask = () => {
    const editedTask = {
      title: title,
      description: description,
      priority: priority,
      deadline: deadline,
    };

    if (!title) {
      setTitleError(t("Edit.EmptyError"));
    } else {
      fetch(`http://localhost:5000/api/items/${userIDValue}/edit/${props.title}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": `${tokenValue}`,
        },
        body: JSON.stringify(editedTask),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));

      setTitle(title);
      setIsLoading(true);
      setDescription(description);
      setPriority(priority);
      setDeadline(deadline);
      setTimeout(() => {
        toggle();
        getData();
      }, 100);
    }
  };

  const editDemoTask = () => {
    if (!title) {
      setTitleError(t("Edit.EmptyError"));
    } else {
      const dTasks = [...tasks];
      const index = dTasks.findIndex((task) => task._id == props.id);

      dTasks[index].title = title;
      dTasks[index].description = description;
      dTasks[index].priority = priority;
      dTasks[index].deadline = deadline;
      setTasks(dTasks);

      setTitle(title);
      setDescription(description);
      setPriority(priority);
      setDeadline(deadline);

      toggle();
    }
  };

  const handleEditTask = (e) => {
    e.preventDefault();
    {
      userIDValue ? editTask() : editDemoTask();
    }
  };

  return (
    <>
      <button onClick={toggle} className="edit">
        Edit
      </button>
      <div className={isOpen ? "edit__active" : "edit__background"}>
        <div className="edit__modal">
          <div className="edit__close">
            <span onClick={toggle}>X</span>
          </div>
          <h2 className="edit__modalTitle">{t("Edit.ModalTitle")}</h2>
          <form action="" className="edit__form">
            <div className="edit__container">
              <label htmlFor="title" className="edit__label">
                {t("Edit.ModalTaskTitle")}
              </label>
              <input
                value={title}
                onFocus={() => setTitleError("")}
                onChange={(e) => setTitle(e.target.value)}
                id="title"
                type="text"
                className="edit__title edit__input"
              />
            </div>
            {titleError ? titleError : ""}
            <div className="edit__container">
              <label htmlFor="description" className="edit__label">
                {t("Edit.ModalDescription")}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="description"
                className="edit__description edit__input"
                name="description"
                cols="20"
                rows="5"
              ></textarea>
            </div>
            <div className="edit__container">
              <label htmlFor="priority" className="edit__label">
                {t("Edit.ModalPriority")}
              </label>
              <input
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="edit__priority edit__input"
                type="range"
                id="priority"
                min="1"
                max="3"
              ></input>
            </div>
            <div className="edit__container">
              <label htmlFor="deadline" className="edit__label">
                {t("Edit.ModalDeadline")}
              </label>
              <input
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                id="deadline"
                className="edit__deadline edit__input"
                type="date"
                value="now"
              />
            </div>

            <input
              onClick={handleEditTask}
              className="edit__btn"
              type="submit"
              value={t("Edit.ModalButton")}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Edit;
