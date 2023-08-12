import React, { useState, useEffect } from "react";

export default function MathQuiz() {
  const [question, setQuestion] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [timer, setTimer] = useState(5);
  const [gameData, setGameData] = useState([]);
  const [quizOver, setQuizOver] = useState(false);

  const operators = ["+", "-", "*", "/"];

  const generateRandomNumber = () => Math.floor(Math.random() * 10);
  const generateRandomOperator = () =>
    operators[Math.floor(Math.random() * operators.length)];

  const generateQuestionOptionsAndAnswer = () => {
    try {
      const num1 = generateRandomNumber();
      const num2 = generateRandomNumber();
      const operator = generateRandomOperator();
      const question = `${num1} ${operator} ${num2}`;

      if (generatedQuestions.includes(question)) {
        generateQuestionOptionsAndAnswer(); 
      }
      setGeneratedQuestions([...generatedQuestions, question]);
      setQuestion(question);

      const correctAnswer = eval(question);
      const options = [correctAnswer];

      while (options.length < 4) {
        const randomNum1 = generateRandomNumber();
        const randomNum2 = generateRandomNumber();
        const randomOperator = generateRandomOperator();
        const randomQuestion = `${randomNum1} ${randomOperator} ${randomNum2}`;
        const randomAnswer = eval(randomQuestion);
        if (randomAnswer !== correctAnswer && options.indexOf(randomAnswer) === -1) {
          options.push(randomAnswer);
        }
      }
      setCorrectAnswer(correctAnswer);
      setOptions(options.sort(() => Math.random() - 0.5));
      setQuestionNumber(questionNumber + 1);

      setGameData([
        ...gameData,
        { question, options, selectedOption: "Not Answered", correctAnswer },
      ]);
    } catch (e) {
      console.log("error", e);
    }
  };

  const nextQuestion = () => {
    if (questionNumber < 10) {
      generateQuestionOptionsAndAnswer();
      setTimer(5);
    } else if (questionNumber === 10) {
      setQuizOver(true);
    }
  };
  
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      nextQuestion();
    }
  }, [timer]);

  useEffect(() => {
    nextQuestion();
  }, []);

  const handleOptionClick = (selectedOption) => {
    try{
    const newGameData = gameData?.map((Data, index) => {
      if (index === questionNumber - 1) {
        Data.selectedOption = selectedOption;
      }
      return Data;
    });
    setGameData(newGameData);
    if (selectedOption === correctAnswer) {
      setScore(score + 1);
    }
    nextQuestion();
  }
    catch (error) {
      console.log(error, "Error");
    }
    
  };

  

  
  return (
    <div className="quiz-container">
      <div>
        <p className="question">Question {questionNumber} / 10</p>
        <p className="timer">Time Remaining: {timer} seconds</p>
        <p className="question-text">{question}</p>
        <div className="options-container">
          {options.map((option, index) => (
            <button
              key={index}
              className="option-button"
              onClick={() => handleOptionClick(option)}
              disabled={quizOver}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      {quizOver && (
        <>
          <div className="result-container">
            <p className="score">Score: {score}</p>
          </div>
          <>
             {Array.isArray(gameData) &&
               gameData?.map((data, index) => (
                 <div key={index}>
                   <p>questionNumber {index + 1} / 10</p>
                   <p>Question {data.question}</p>
                   <p>options</p>
                   {data.options.map((option, optionIndex) => (
                     <p key={optionIndex}>
                       {"("}
                       {optionIndex + 1}
                       {")"} {option}{" "}
                     </p>
                   ))}
                   <p>selectedOption: {data.selectedOption}</p>
                   <p>correctAnswer: {data.correctAnswer}</p>
                 </div>
               ))}
           </>
        </>
      )}
    </div>
  );

}