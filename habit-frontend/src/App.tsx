import { useEffect, useState } from "react";
import { login, getHabits, createHabit } from "./api";
import Layout from "./components/Layout";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [habits, setHabits] = useState<any[]>([]);
  const [newHabit, setNewHabit] = useState("");

  const loadHabits = async () => {
    const res = await getHabits();
    setHabits(res.data);
  };

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



  const addHabit = async () => {
    if (!newHabit.trim()) return;

    await createHabit(newHabit, "from frontend");
    setNewHabit("");
    loadHabits();
  };

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    setLoggedIn(true);
    loadHabits();
  }
}, []);


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
            onKeyDown={(e) => {
              if (e.key === "Enter") addHabit();
            }}
          />
          <button onClick={addHabit} disabled={!newHabit.trim()}>
            Add
          </button>
        </div>

        <ul>
          {habits.map((h) => (
            <li key={h.id}>{h.name}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}

export default App;
