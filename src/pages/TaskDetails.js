import React, { useState, useEffect } from "react";
import NoteForm from "../components/NoteForm";
import ReactQuill from "react-quill";
import "../styles/quill.bubble.css";

function calculateTimeLeft(completionDate) {
  const currentDate = new Date();
  const targetDate = new Date(completionDate);
  const timeDiff = targetDate.getTime() - currentDate.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return "Task overdue";
  } else if (daysLeft === 0) {
    return "Due today";
  } else {
    return `Due in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`;
  }
}

const TaskDetails = () => {
  const [taskNotes, setTaskNotes] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [taskDetails, setTaskDetails] = useState(null); // Added state for task details
  const [editedTaskDetails, setEditedTaskDetails] = useState(null); // Added state for edited task details
  const taskId = window.location.href.split("/").pop();
  const [taskStarted, setTaskStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });
  const [taskCompletedTime, setTaskCompletedTime] = useState(null);
  const [taskPausedTime, setTaskPausedTime] = useState(null);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);
  const [editLogs, setEditLogs] = useState([]);
  const [showEditLogs, setShowEditLogs] = useState(false);
  const [dailyTimeFrames, setDailyTimeFrames] = useState([]);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = () => {
    const currentURL = window.location.href;
    navigator.clipboard
      .writeText(currentURL)
      .then(() => {
        setLinkCopied(true);
      })
      .catch((error) => {
        console.error("Failed to copy link:", error);
      });
  };

  const handleStartTask = () => {
    const currentTime = new Date();
    const timeFrame = {
      startDate: currentTime,
      endDate: null,
    };
    if (!taskStarted) {
      setTaskStarted(true);
      setDailyTimeFrames([...dailyTimeFrames, timeFrame]);
      setStartTime(new Date());
      setTimerInterval(setInterval(updateElapsedTime, 1000));
    }
  };

  const handlePauseTask = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
      const currentTime = new Date();
      const updatedTimeFrames = dailyTimeFrames.map((timeFrame, index) => {
        if (index === dailyTimeFrames.length - 1 && !timeFrame.endDate) {
          // Update the end date of the current time frame
          return {
            ...timeFrame,
            endDate: currentTime,
          };
        }
        return timeFrame;
      });
      setDailyTimeFrames(updatedTimeFrames);
      setTaskPausedTime(currentTime);
    } else {
      const currentTime = new Date();
      const newTimeFrame = {
        startDate: currentTime,
        endDate: null,
      };
      setDailyTimeFrames([...dailyTimeFrames, newTimeFrame]);
      const interval = setInterval(updateElapsedTime, 1000);
      setTimerInterval(interval);
      setTaskPausedTime(null);
    }
  };

  const handleResumeTask = () => {
    if (taskStarted && !timerInterval) {
      const currentTime = new Date();
      const elapsedTime = Math.ceil(
        (currentTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24)
      );
      setElapsedTime(elapsedTime);
      setStartTime(currentTime);
      setTimerInterval(setInterval(updateElapsedTime, 1000));
    }
  };

  const handleStopTask = () => {
    setTaskCompleted(true);
    setTaskCompletedTime(new Date());
    clearInterval(timerInterval);

    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = storedTasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, status: "verification" };
      }
      return task;
    });
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const updateElapsedTime = () => {
    if (startTime) {
      const currentDate = new Date();
      const timeDiff = currentDate.getTime() - startTime.getTime();
      const totalSeconds = Math.floor(timeDiff / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor(((totalSeconds % (3600 * 24)) % 3600) / 60);

      setElapsedTime({ days, hours, minutes });
    }
  };

  useEffect(() => {
    const storedTaskNotes =
      JSON.parse(localStorage.getItem(`notes_${taskId}`)) || [];
    setTaskNotes(storedTaskNotes);

    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const matchingTask = storedTasks.find((task) => task.id === taskId);
    setTaskDetails(matchingTask);
    setEditedTaskDetails(matchingTask);
  }, [taskId]);

  const addNote = (newNote) => {
    const updatedNote = { ...newNote, comments: [] };
    setTaskNotes([...taskNotes, updatedNote]);
  };

  const handleComment = (noteId) => {
    setShowCommentInput(true);
    setActiveNoteId(noteId);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim() !== "") {
      setTaskNotes((prevNotes) => {
        const updatedNotes = prevNotes.map((note) => {
          if (note.id === activeNoteId) {
            const updatedComments = [
              ...note.comments,
              { id: Date.now(), text: commentText },
            ];
            return { ...note, comments: updatedComments };
          }
          return note;
        });
        return updatedNotes;
      });
    }
    setCommentText("");
    setShowCommentInput(false);
    setActiveNoteId(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedTaskDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    // Update the task details in the local storage
    localStorage.setItem("taskDetails", JSON.stringify(editedTaskDetails));

    // Create a new edit log object
    const editLog = {
      previousDetails: taskDetails,
      timestamp: new Date(),
    };

    // Update the edit logs state
    setEditLogs((prevLogs) => [...prevLogs, editLog]);
    setTaskDetails(editedTaskDetails); // Update the task details with the edited details

    // Update the task in local storage
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = storedTasks.map((task) => {
      if (task.id === taskId) {
        return editedTaskDetails;
      }
      return task;
    });
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  useEffect(() => {
    localStorage.setItem(`notes_${taskId}`, JSON.stringify(taskNotes));
  }, [taskId, taskNotes]);

  return (
    <div>
      <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1 style={{ marginRight: "20px" }}>Task Details</h1>
          <span
            style={{
              marginBottom: "-25px",
              cursor: "pointer",
              color: "#097969",
              fontSize: "9px",
            }}
            onClick={handleCopyLink}
          >
            Copy Task Link
          </span>
        </div>
        <div className="flex-container">
          <div className="flex-child">
            {taskDetails && (
              <div>
                <h3>Title:</h3>
                <input
                  type="text"
                  name="title"
                  value={editedTaskDetails.title}
                  onChange={handleInputChange}
                />
                <h3>Completion Date:</h3>
                <input
                  type="date"
                  name="completionDate"
                  value={editedTaskDetails.completionDate}
                  onChange={handleInputChange}
                />
                <h3>Assigned To:</h3>
                <select
                  name="assignedTo"
                  value={editedTaskDetails.assignedTo}
                  onChange={handleInputChange}
                >
                  <option value="User1">User1</option>
                  <option value="User2">User2</option>
                  <option value="User3">User3</option>
                </select>
                <h3>Priority:</h3>
                <select
                  name="priority"
                  value={editedTaskDetails.priority}
                  onChange={handleInputChange}
                >
                  <option value="red">Red (highest)</option>
                  <option value="yellow">Yellow</option>
                  <option value="blue">Blue (lowest)</option>
                </select>
                <button
                  style={{ marginBottom: "10px", marginTop: "10px" }}
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            )}
            <span
              style={{ cursor: "pointer", color: "#097969", fontSize: "12px" }}
              onClick={() => setShowEditLogs((prev) => !prev)}
            >
              {showEditLogs ? "Hide Previous Updates" : "Show Previous Updates"}
            </span>
            {showEditLogs && (
              <div style={{ color: "black", fontSize: "12px" }}>
                {editLogs.map((log, index) => (
                  <div key={index}>
                    <p>Previous Title: {log.previousDetails.title}</p>
                    <p>
                      Previous Completion Date:{" "}
                      {log.previousDetails.completionDate}
                    </p>
                    <p>
                      Previous Assigned To: {log.previousDetails.assignedTo}
                    </p>
                    <p>Previous Priority: {log.previousDetails.priority}</p>
                    <p>Time of Change: {log.timestamp.toLocaleString()}</p>
                    <p style={{ color: "#097969", fontSize: "12px" }}>
                      --------------------------------------------------------
                    </p>
                  </div>
                ))}
              </div>
            )}
            {taskDetails && !taskCompletedTime && (
              <div>
                <p>
                  Time Left :{" "}
                  <strong>
                    {calculateTimeLeft(taskDetails.completionDate)}
                  </strong>
                </p>
              </div>
            )}
            {taskDetails && (
              <div>
                {taskStarted ? (
                  <div style={{ fontSize: "14px" }}>
                    {taskPausedTime ? (
                      <p>
                        Task paused by:{" "}
                        <strong>{editedTaskDetails.assignedTo} </strong>{" "}
                        <span style={{ color: "#097969", fontSize: "12px" }}>
                          ({startTime.toLocaleString()})
                        </span>
                      </p>
                    ) : (
                      <p>
                        Task started by:{" "}
                        <strong>{editedTaskDetails.assignedTo} </strong>{" "}
                        <span style={{ color: "#097969", fontSize: "12px" }}>
                          ({startTime.toLocaleString()})
                        </span>
                      </p>
                    )}
                    <p>
                      Time elapsed:{" "}
                      <span style={{ color: "#097969", fontSize: "14px" }}>
                        {elapsedTime.days} day(s), {elapsedTime.hours} hour(s),{" "}
                        {elapsedTime.minutes} minute(s)
                      </span>
                    </p>
                    <div>
                      <h4>Time Frames:</h4>
                      {dailyTimeFrames.map((timeFrame, index) => (
                        <div key={index}>
                          <p style={{ fontSize: "12px" }}>
                            Date:{" "}
                            <span
                              style={{ color: "#097969", fontSize: "12px" }}
                            >
                              {timeFrame.startDate.toLocaleDateString()}{" "}
                            </span>
                            Time Frame:{" "}
                            <span
                              style={{ color: "#097969", fontSize: "12px" }}
                            >
                              {timeFrame.startDate.toLocaleTimeString()} -{" "}
                              {timeFrame.endDate
                                ? timeFrame.endDate.toLocaleTimeString()
                                : "Present"}
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                    <p>{taskCompletedTime && <h2>Task Completed</h2>}</p>
                    {taskCompletedTime ? (
                      <div>
                        <p>
                          Task Completed at{" "}
                          <span style={{ color: "#097969", fontSize: "15px" }}>
                            {taskCompletedTime.toLocaleString()}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <div>
                        <button onClick={handlePauseTask}>
                          {timerInterval ? "Pause" : "Resume"}
                        </button>
                        <p>
                          <button onClick={handleStopTask}>
                            Mark as Complete
                          </button>
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {taskCompletedTime ? (
                      <div>
                        <p>
                          Task Completed at {taskCompletedTime.toLocaleString()}
                        </p>
                        <p>
                          Time spent: {elapsedTime.days} day(s),{" "}
                          {elapsedTime.hours} hour(s), {elapsedTime.minutes}{" "}
                          minute(s)
                        </p>
                      </div>
                    ) : (
                      <button onClick={handleStartTask}>Start Task</button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex-child">
            <NoteForm addNote={addNote} />
            <h2>Notes:</h2>
            <ul>
              {taskNotes.map((note) => (
                <div className="notes-section" key={note.id}>
                  <li style={{ marginBottom: "0" }}>
                    <ReactQuill
                      value={note.text}
                      readOnly={true}
                      theme="bubble"
                      style={{ marginBottom: "0" }}
                    />
                    <p style={{ color: "#097969", fontSize: "10px" }}>
                      ({new Date(note.id).toLocaleString()})
                    </p>
                  </li>
                  <ul>
                    {note.comments &&
                      note.comments.map((comment) => (
                        <div>
                          <li key={comment.id} style={{ color: "black" }}>
                            <ReactQuill
                              value={comment.text}
                              readOnly={true}
                              theme="bubble"
                              style={{ marginBottom: "0" }}
                            />
                            <span
                              style={{ color: "#097969", fontSize: "10px" }}
                            >
                              ({new Date(comment.id).toLocaleString()})
                            </span>
                          </li>
                        </div>
                      ))}
                  </ul>
                  {showCommentInput && activeNoteId === note.id && (
                    <div>
                      <ReactQuill
                        value={commentText}
                        onChange={setCommentText}
                        theme="bubble"
                        placeholder="Enter a comment"
                      />
                      <button onClick={handleCommentSubmit}>Submit</button>
                    </div>
                  )}
                  {!showCommentInput && (
                    <p>
                      <button onClick={() => handleComment(note.id)}>
                        Add Response
                      </button>
                    </p>
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
