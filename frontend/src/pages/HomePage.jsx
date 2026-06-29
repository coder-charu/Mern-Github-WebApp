import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import Search from "../components/Search";
import SortRepos from "../components/SortRepos";
import ProfileInfo from "../components/ProfileInfo";
import Repos from "../components/Repos";
import Spinner from "../components/Spinner";

const HomePage = ({ authUser }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState("recent");

  const getUserProfileAndRepos = useCallback(
    async (username = "coder-charu") => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:4000/api/users/profile/${username}`,
          {
            credentials: "include",
          },
        );

        const { repos = [], userProfile } = await response.json();

        repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setRepos(repos);
        setUserProfile(userProfile);
        return { userProfile, repos };
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (authUser) {
      getUserProfileAndRepos();
    }
  }, [authUser, getUserProfileAndRepos]);

  const onSearch = async (e, username) => {
    e.preventDefault();

    setLoading(true);
    setRepos([]);
    setUserProfile(null);

    const { userProfile, repos } = await getUserProfileAndRepos(username);

    setUserProfile(userProfile);
    setRepos(repos);
    setLoading(false);
    setSortType("recent");
  };

  const onSort = (sortType) => {
    if (sortType === "recent") {
      repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortType === "stars") {
      repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    } else if (sortType === "forks") {
      repos.sort((a, b) => b.forks_count - a.forks_count);
    }

    setSortType(sortType);
    setRepos([...repos]);
  };

  if (!authUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-glass max-w-2xl rounded-xl p-8 text-center border border-gray-700">
          <h1 className="text-3xl font-bold mb-4">
            Discover GitHub Profiles Smarter
          </h1>

          <p className="text-gray-300 mb-6 leading-relaxed">
            This app helps you search GitHub users, explore their repositories,
            sort projects by stars, forks, and recent activity, and discover
            popular repositories by programming language.
          </p>

          <p className="text-gray-400 mb-6">
            Login or create an account to access the full dashboard and explore
            GitHub data easily.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md font-medium"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-gray-700 hover:bg-gray-800 px-5 py-2 rounded-md font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="m-4">
      <Search onSearch={onSearch} />

      {repos.length > 0 && <SortRepos onSort={onSort} sortType={sortType} />}

      <div className="flex gap-4 flex-col lg:flex-row justify-center items-start">
        {userProfile && !loading && <ProfileInfo userProfile={userProfile} />}
        {!loading && <Repos repos={repos} />}
        {loading && <Spinner />}
      </div>
    </div>
  );
};

export default HomePage;
