import { useEffect, useState } from "react";
import {
  login,
  getHabits,
  register,
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
import { popConfetti } from "./utils/confetti";
import { fireConfetti, shouldCelebrateStreak } from "./utils/celebration";

type Habit = {
  id: number;
  name: string;
  streakCount: number;
  lastCompletedDate?: string;
};

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const [prevStreaks, setPrevStreaks] = useState<Record<number, number>>({});
  const [animateStreak, setAnimateStreak] = useState<number | null>(null);
  const STREAK_MILESTONES = [7, 30, 60, 90, 180, 365, 720, 1000];
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);
  const [milestone, setMilestone] = useState<number | null>(null);
  const [isRegister, setIsRegister] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  /* ------------------ helpers ------------------ */

  // Helper to decode JWT expiry
  const getTokenExpiry = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000; // convert to ms
    } catch {
      return null;
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const isCompletedToday = (date?: string) => {
    if (!date) return false;
    return date === today;
  };
  const totalHabits = habits.length;

const completedTodayCount = habits.filter(
  (h) => isCompletedToday(h.lastCompletedDate)
).length;

const weeklyProgress =
  totalHabits === 0 ? 0 : Math.round((completedTodayCount / totalHabits) * 100);


const loadHabits = async () => {
  const res = await getHabits();

  res.data.forEach((h: any) => {
    const prev = prevStreaks[h.id];
    if (prev !== undefined && h.streakCount > prev) {
      setAnimateStreak(h.id);

      setTimeout(() => {
        setAnimateStreak(null);
      }, 600); // match animation duration
    }
  });

  const newMap: Record<number, number> = {};
  res.data.forEach((h: any) => {
    newMap[h.id] = h.streakCount;
  });

  setPrevStreaks(newMap);
  setHabits(res.data);
};
const showMilestonePopup = (days: number) => {
  setMilestone(days);
  setTimeout(() => setMilestone(null), 4000);
};



  /* ------------------ auth ------------------ */

const handleAuth = async () => {
  try {
    setError("");

    if (isRegister) {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // REGISTER ONLY
      await register(username, password);

      // UX decision: auto-switch to login
      setIsRegister(false);
      setError("Account created. Please log in.");
      return; //  IMPORTANT: STOP HERE
    }

    // LOGIN ONLY
    const res = await login(username, password);
    localStorage.setItem("token", res.data.token);
    setLoggedIn(true);
    loadHabits();

  } catch (err: any) {
    setError(
      err?.response?.data?.error ||
      "Invalid credentials"
    );
  }
};


  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setHabits([]);
    setUsername("");
    setPassword("");
    setNewHabit("");
  };

  /* ------------------ habits ------------------ */

  const addHabit = async () => {
    if (!newHabit.trim()) return;
    await createHabit(newHabit, "from frontend");
    setNewHabit("");
    loadHabits();
  };

const markComplete = async (habitId: number) => {
  const res = await completeHabit(habitId);

  const updatedHabit = res.data;
  loadHabits();

  if (shouldCelebrateStreak(updatedHabit.streakCount)) {
    fireConfetti();
    showMilestonePopup(updatedHabit.streakCount);
  }
};



  const deleteHabit = async (habitId: number) => {
    await deleteHabitApi(habitId);
    loadHabits();
  };

  /* ------------------ lifecycle ------------------ */

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      loadHabits();

      const expiry = getTokenExpiry();

      if (expiry) {
        const timeout = expiry - Date.now();

        if (timeout > 0) {
          const timer = setTimeout(() => {
            alert("Session expired. Please log in again.");
            handleLogout();
          }, timeout);

          return () => clearTimeout(timer);
        } else {
          handleLogout();
        }
      }
    }
  }, []);

  /* ------------------ UI ------------------ */

  if (!loggedIn) {
    return (
      <Layout>
        {milestone && (
  <div className="milestone-popup">
    🎉 Congratulations! <br />
    You've logged your streak for <b>{milestone}</b> consecutive days! <br />
    Great job 😎😉
  </div>
)}
<form
  onSubmit={(e) => {
    e.preventDefault();
    handleAuth();
  }}
>
  <div className="card">
    <h2>{isRegister ? "Create account" : "Login"}</h2>

    <input
      autoFocus
      placeholder="Email"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    {isRegister && (
      <input
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
    )}

    {error && <p className="error">{error}</p>}

    <button type="submit" disabled={!username || !password}>
      {isRegister ? "Register" : "Login"}
    </button>

    <p
      className="link"
      onClick={() => {
        setIsRegister(!isRegister);
        setError("");
      }}
    >
      {isRegister
        ? "Already have an account? Login"
        : "New here? Create an account"}
    </p>
  </div>
</form>

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

        <div className="progress-container">
          <div className="progress-label">
            Weekly Progress: {completedTodayCount}/{totalHabits}
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${weeklyProgress}%` }}
            />
          </div>
        </div>

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
                <span
                  className="habit-name"
                  title={h.name}  
                >
                  {h.name}
                </span>
                  <span className={`habit-streak ${ animateStreak === h.id ? "streak-animate" : ""
                    }`}  > 🔥 {h.streakCount}
                      <div className="streak-bar">
    <div
      className="streak-fill"
      style={{
        width: `${Math.min((h.streakCount / 30) * 100, 100)}%`,
      }}
    />
    </div>
                  </span>
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
      {celebrationMessage && (
  <div className="celebration-overlay">
    <div className="celebration-card">
      <p>{celebrationMessage}</p>
      <button onClick={() => setCelebrationMessage(null)}>Close</button>
    </div>
  </div>
)}

    </Layout>
  );
}

export default App;
