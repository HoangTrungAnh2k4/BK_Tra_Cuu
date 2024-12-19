import { useEffect, useState, useRef } from 'react';

function App() {
    const [listQuestions, setListQuestions] = useState([]);
    const [question, setQuestion] = useState({});
    const [shuffledAnswers, setShuffledAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const apiUrl = './data2.json';
    const shuffleArray = (array) => {
        const shuffled = [...array]; // Tạo bản sao của mảng để không thay đổi mảng gốc
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Hoán đổi phần tử
        }
        return shuffled;
    };

    const handleNextClick = () => {
        const listAnswers = document.querySelectorAll('li');
        listAnswers.forEach((answer) => {
            answer.classList.add('bg-white');
            answer.classList.remove('bg-red-500');
            answer.classList.remove('bg-green-500');
            answer.classList.add('hover:bg-slate-200');
        });

        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < listQuestions.length) {
            setQuestion(listQuestions[nextIndex]);
            setCurrentQuestionIndex(nextIndex);
        } else {
            alert('You have completed the quiz!');
        }
    };

    const handleAnswerClick = (answer) => {
        const answerChoices = document.querySelectorAll('li');
        let correctAnswer = null;

        answerChoices.forEach((choice) => {
            if (choice.innerText === question.correct) {
                correctAnswer = choice;
            }
        });

        if (answer === question.correct) {
            correctAnswer.classList.remove('bg-white');
            correctAnswer.classList.add('bg-green-500');
            correctAnswer.classList.remove('hover:bg-slate-200');
        } else {
            correctAnswer.classList.remove('bg-white');
            correctAnswer.classList.add('bg-green-500');
            correctAnswer.classList.remove('hover:bg-slate-200');
            answerChoices.forEach((choice) => {
                if (choice.innerText === answer) {
                    choice.classList.remove('bg-white');
                    choice.classList.add('bg-red-500');
                    choice.classList.remove('hover:bg-slate-200');
                }
            });
        }
    };

    useEffect(() => {
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => setListQuestions(shuffleArray(data)));
    }, []);

    // Đảm bảo rằng question chỉ được cập nhật khi listQuestions có dữ liệu
    useEffect(() => {
        if (listQuestions.length > 0) {
            setQuestion(listQuestions[0]);
        }
    }, [listQuestions]);

    // Đảm bảo rằng shuffledAnswers chỉ được cập nhật khi question có dữ liệu
    useEffect(() => {
        if (question?.answers) {
            const shuffled = shuffleArray(question.answers);
            setShuffledAnswers(shuffled);
        }
    }, [question]);

    return (
        <div className="App flex flex-col items-center pt-24 text-xl ">
            <div className="w-1/2 bg-primary min-h-32 rounded-lg p-6">{question?.question}</div>

            <div className="w-1/2 flex">
                {' '}
                <ul className="flex-1 bg-primary min-h-96 mt-6 p-6 rounded-lg">
                    {shuffledAnswers?.map((answer, index) => (
                        <li
                            key={index}
                            onClick={() => handleAnswerClick(answer)} // Gắn sự kiện click vào từng <li>
                            className="bg-white my-4 hover:bg-slate-200 hover:cursor-pointer rounded-lg px-4 py-3 break-words"
                        >
                            {answer} {/* Sử dụng `answer.answer` nếu `answer` là một đối tượng */}
                        </li>
                    ))}
                </ul>
                <button
                    onClick={handleNextClick}
                    className="w-fit -mr-28 ml-6 select-none h-fit px-6 rounded-lg py-2 bg-blue-500 text-white hover:scale-95 mt-6"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default App;
