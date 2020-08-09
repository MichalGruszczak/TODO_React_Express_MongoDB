import React, { useState } from "react";
import "./Edit.css";

const Edit = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(props.title);
  const [description, setDescription] = useState(props.description);
  const [priority, setPriority] = useState(props.priority);
  const [deadline, setDeadline] = useState(props.deadline);
  const [titleError, setTitleError] = useState("");

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const editTask = (e) => {
    e.preventDefault();
    const editedTask = {
      title: title,
      description: description,
      priority: priority,
      deadline: deadline,
    };

    if (!title) {
      setTitleError("This field cannot be empty!");
    } else {
      fetch(`http://localhost:5000/api/items/edit/${props.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedTask),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));

      setTitle(title);
      setDescription(description);
      setPriority(priority);
      setDeadline(deadline);
      toggle();
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
          <h2 className="edit__modalTitle">Edit Task</h2>
          <form action="" className="edit__form">
            <div className="edit__container">
              <label htmlFor="title" className="edit__label">
                Title
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
                Description
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
                Priority
              </label>
              <input
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="edit__priority edit__input"
                type="range"
                id="priority"
                min="0"
                max="3"
              ></input>
            </div>
            <div className="edit__container">
              <label htmlFor="deadline" className="edit__label">
                Deadline
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
              onClick={editTask}
              className="edit__btn"
              type="submit"
              value="Edit Task"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Edit;