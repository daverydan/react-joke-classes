import React, { Component } from "react";
import axios from "axios";
import JokeClass from "./JokeClass";
import "./JokeList.css";

class JokeListClass extends Component {
  state = {
    numJokesToGet: 10,
    jokes: [],
  };

  getJokes = async () => {
    let j = [...this.state.jokes];
    let seenJokes = new Set();
    try {
      while (j.length < this.state.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      return this.setState({ jokes: this.sortJokes(j) });
    } catch (e) {
      console.log(e);
    }
  };

  sortJokes = (jokes) =>
    jokes.length && [...jokes].sort((a, b) => b.votes - a.votes);

  /* empty joke list and then call getJokes */
  generateNewJokes = () => this.setState({ jokes: [] });

  /* change vote for this id by delta (+1 or -1) */
  vote = (id, delta) => {
    const updatedJokes = this.state.jokes.map((j) =>
      j.id === id ? { ...j, votes: j.votes + delta } : j
    );
    this.setState({ jokes: this.sortJokes(updatedJokes) });
  };

  componentDidMount = () => this.getJokes();

  componentDidUpdate = () => this.state.jokes.length === 0 && this.getJokes();

  render() {
    const { jokes } = this.state;
    if (jokes.length) {
      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>
          <ul>
            {jokes.map((j) => (
              <JokeClass
                text={j.joke}
                key={j.id}
                id={j.id}
                votes={j.votes}
                vote={this.vote}
              />
            ))}
          </ul>
        </div>
      );
    }
    return <h1>Loading...</h1>;
  }
}

export default JokeListClass;
