import React, { useEffect, useRef, useState } from 'react';
import SnippetSelector from './SnippetSelector';
import './App.css'


function App() {

  // const buttonTextItems = [
  //   `bears, beets, battlestar galactica`,
  //   `what's forrest gump's pasword? 1Forest1`,
  //   `where do programmers like to hang out? The Foo Bar`
  // ]

  const initialGameState = {
    victory: false,
    startTime: null,
    endTime: null
  }

  const [snippet, setSnippet] = useState(null);
  const [highScore, setHighScore] = useState(null);
  const [userText, setUserText] = useState('');
  const [gameState, setGameState] = useState(initialGameState);
  const [hasError, setErrors] = useState(false);
  const [films, setFilms] = useState([]);
  const [whatToType, setWhatToType] = useState(null);
  const textRef = useRef(null);


  const chooseSnippet = selectedSnippet => {
    setSnippet(selectedSnippet);
    setGameState({...gameState, startTime: new Date().getTime()})
    textRef.current.focus();
    setUserText('');
  }

  const fetchData = async () => {
    const repsonse = await fetch("https://ghibliapi.herokuapp.com/films");
    repsonse
      .json()
      .then(response => {
        const filmRes = randomNumberGenerator(response) 
        setFilms(filmRes)})
      .catch(err => setErrors(err));
  };

  const randomNumberGenerator = (response) => {
    const result = [];
    for(let i=0; result.length < 3; i++){
      const randomNumber = Math.round(Math.random() * (response.length - 1))
      if(!result.includes(response[randomNumber])){
        result.push(response[randomNumber]);
      }
    }
    return result;
  }

  const checkIfNewHighScore = (endTime) => {
    if(endTime<highScore || highScore === null){
      setHighScore(endTime);
    }
  }

  const updateUserText = event => {
    setUserText(event.target.value);
    if(event.target.value === snippet){
      setGameState({...gameState, victory: true, endTime: new Date().getTime() - gameState.startTime})
    }
  }
  
  const resetGame = () => {
    setGameState(initialGameState);
    setSnippet('');
    setUserText('');
    setWhatToType(null);
  }


  useEffect(()=>{
    if(gameState.victory){
      document.title = 'Victory!';
      checkIfNewHighScore(gameState.endTime)
    }
  });

  useEffect(()=> {
    fetchData();
  }, [])


  return (
    <>
      <h2 style={{color: 'red', fontStyle:'italic'}}>TypeRace</h2>
      <h1 style={{color:'goldenrod'}}>{snippet}</h1>
      <div>
        {/* highScore:  */}
        {highScore?<div>High Score: <span style={{fontStyle:'italic'}}>{highScore}ms</span></div>:null}
      </div>
      <div style={{color:'green'}}>{gameState.victory ? `Done! Woot! Time: ${gameState.endTime}ms`:''}</div>
      <input value={userText} onChange={updateUserText} ref={textRef}/>
      <hr/>
      {/* {buttonTextItems.map((textItem, index)=><button onClick={()=>chooseSnippet(index)} key={index}>{textItem}</button>)} */}
      <SnippetSelector chooseSnippet={chooseSnippet} films={films} setWhatToType={setWhatToType} whatToType={whatToType}/>
      <>{hasError ? 'An error has occured': null}</>
      <hr/>
      <button onClick={resetGame}>Reset Game</button>
      <hr/>
    </>
    );
}

export default App;
