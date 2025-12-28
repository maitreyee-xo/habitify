import { useEffect, useState } from "react";
import {
  login,
  getHabits,
  createHabit,
  completeHabit,
  deleteHabitApi,
} from "./api";
import Layout from "./components/Layout";
import "./index.css";
import "./styles/layout.css";
import "./styles/habits.css";
import "./styles/buttons.css";
import "./App.css";


type Habit = {
  id: number;
  name: string;
  streakCount: number;
  lastCompletedDate?: string;
};

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");

  /* ------------------ helpers ------------------ */

  const today = new Date().toISOString().split("T")[0];

  const isCompletedToday = (date?: string) => {
    if (!date) return false;
    return date === today;
  };

  const loadHabits = async () => {
    const res = await getHabits();
    setHabits(res.data);
  };

  /* ------------------ auth ------------------ */

  const handleLogin = async () => {
    const res = await login(username, password);
    localStorage.setItem("token", res.data.token);
    setLoggedIn(true);
    loadHabits();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setHabits([]);
    setUsername("");
    setPassword("");
  };

  /* ------------------ habits ------------------ */

  const addHabit = async () => {
    if (!newHabit.trim()) return;
    await createHabit(newHabit, "from frontend");
    setNewHabit("");
    loadHabits();
  };

  const markComplete = async (habitId: number) => {
    await completeHabit(habitId);
    loadHabits();
  };

  const deleteHabit = async (habitId: number) => {
    await deleteHabitApi(habitId);
    loadHabits();
  };

  /* ------------------ lifecycle ------------------ */

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
      loadHabits();
    }
  }, []);

  /* ------------------ UI ------------------ */

  if (!loggedIn) {
    return (
      <Layout>
        <div className="card">
          <h2>Login</h2>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>Login</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="card">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>

        <h2>My Habits</h2>

        <div className="row">
          <input
            placeholder="New habit"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addHabit()}
          />
          <button onClick={addHabit} disabled={!newHabit.trim()}>
            Add
          </button>
        </div>

        <ul className="habit-list">
          {habits.map((h) => {
            const completedToday = isCompletedToday(h.lastCompletedDate);

            return (
              <li key={h.id} className="habit-item">
                <div className="habit-left">
                  <span className="habit-name">{h.name}</span>
                  <span className="habit-streak">🔥 {h.streakCount}</span>
                </div>

                <div className="habit-actions">
                <button
                  className={`btn ${completedToday ? "btn-completed" : "btn-primary"}`}
                  onClick={() => markComplete(h.id)}
                  disabled={completedToday}
                >
                  {completedToday ? "Woohoo!💪🏻 " : "Done"}
                </button>


                  <button
                    className="delete-btn"
                    onClick={() => deleteHabit(h.id)}
                  >
                    ✕
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Layout>
  );
}

export default App;
