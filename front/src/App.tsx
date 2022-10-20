import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddSkill from "./components/add-skill/add-skill";
import AddWilder from "./components/add-wilder/add-wilder";
import Footer from "./components/footer/footer";
import IWilderFromDb from "./interfaces/wilder/IWilderFromDb";
import ProfileGrid from "./components/profile-grid/profile-grid";
import { useQuery } from "@apollo/client";
import { GET_ALL_WILDERS } from "./graphql/queries/getAllWilders";

function App() {
  const [wilderToEdit, setWilderToEdit] = useState<IWilderFromDb | null>(null);
  const { loading, error, data } = useQuery(GET_ALL_WILDERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Router>
      <div>
        <header>
          <div className="container">
            <div>
              <Link to="/">
                <h1>Wilders Book</h1>
              </Link>
            </div>
            <nav>
              <Link to="/add-wilder">
                <span>Add Wilder</span>
              </Link>
              <Link to="/add-skill">
                <span>Add Skill</span>
              </Link>
            </nav>
          </div>
        </header>
        <main className="container">
          <Routes>
            <Route
              path="/add-wilder"
              element={
                <AddWilder
                  setWilderToEdit={setWilderToEdit}
                  wilderToEdit={wilderToEdit}
                />
              }
            />
            <Route
              path="/update-wilder"
              element={
                <AddWilder
                  setWilderToEdit={setWilderToEdit}
                  wilderToEdit={wilderToEdit}
                />
              }
            />
            <Route path="/add-skill" element={<AddSkill />} />
            <Route
              path="/"
              element={
                <ProfileGrid
                  wilders={data.getAllWilders}
                  setWilderToEdit={setWilderToEdit}
                />
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
