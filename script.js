
const info_box = document.querySelector(".info_box");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
let quizStartTime;


// show info box
info_box.classList.add("activeInfo"); //show information box of the quiz

// if continueQuiz button clicked
continue_btn.onclick = ()=>{
    quizStartTime = new Date(); //start the time 
    info_box.classList.remove("activeInfo"); //hide information box
    quiz_box.classList.add("activeQuiz"); //show quiz box
    showQuetions(0); //calling showQestions function 
    queCounter(1); //passing 1 parameter to queCounter
   
}


let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const restart_quiz = result_box.querySelector(".buttons .restart"); //if student wants to retake the quiz
const goBack = result_box.querySelector(".buttons .goBack");//if student wants to go back to the lesson page 

//  when  window is loaded
window.onload = function() {
    const questionFile = sessionStorage.getItem("selectedQuestions");
    if (questionFile) {
        loadQuestions(questionFile); //load questions according to the task 
    } else {
        // Default to questions1.js or handle error
        loadQuestions('questions1.js'); // or show an error message
    }
}

// Function to dynamically load the question according to the task 
function loadQuestions(file) { 
    const script = document.createElement('script');
    script.src = file;
    script.onload = function() {
        initializeQuiz(questions);
    };
    document.head.appendChild(script);
}
// if student wants to to retake the quiz == clicks the restartQuiz button 
restart_quiz.onclick = ()=>{
    quiz_box.classList.add("activeQuiz"); //show quiz box
    result_box.classList.remove("activeResult"); //hide result box
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;
    showQuetions(que_count); //calling showQestions function
    queCounter(que_numb); //passing que_numb value to queCounter
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    next_btn.classList.remove("show"); //hide the next button
}



const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// if Next Que button clicked
next_btn.onclick = ()=>{
    if(que_count < questions.length - 1){ //if question count is less than total question length
        que_count++; //increment the que_count value
        que_numb++; //increment the que_number value
        showQuetions(que_count); //calling showQestions function
        queCounter(que_numb); //passing que_numb value to queCounter
        clearInterval(counter); //clear counter
        clearInterval(counterLine); //clear counterLine
        next_btn.classList.remove("show"); //hide the next button
    }else{
        clearInterval(counter); //clear counter
        clearInterval(counterLine); //clear counterLine
        showResult(); //calling showResult function
    }
}

// getting questions and options of the quiz from file specified from array
function showQuetions(index){
    const que_text = document.querySelector(".que_text");

    let que_tag = '<span>'+ questions[index].numb + ". " + questions[index].question +'</span>';
    let option_tag = '<div class="option"><span>'+ questions[index].options[0] +'</span></div>' // 1st option of the answer to the question
    + '<div class="option"><span>'+ questions[index].options[1] +'</span></div>'// 2nd
    + '<div class="option"><span>'+ questions[index].options[2] +'</span></div>'// 3rd
    + '<div class="option"><span>'+ questions[index].options[3] +'</span></div>';//4th
    que_text.innerHTML = que_tag; //adding new span tag inside que_tag
    option_list.innerHTML = option_tag; //adding new div tag inside option_tag
    
    const option = option_list.querySelectorAll(".option");

    // set onclick attribute to all available options
    for(i=0; i < option.length; i++){
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}

//if user clicked on option
function optionSelected(answer){
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    let userAns = answer.textContent; //getting user selected option
    let correcAns = questions[que_count].answer; //getting correct answer from array
    const allOptions = option_list.children.length; //getting all option items
    
    if(userAns == correcAns){ //if user selected option is equal to array's correct answer
        userScore += 1; //upgrading score value with 1
        answer.classList.add("correct"); //adding green color to correct selected option
        console.log("Correct Answer");
        console.log("Your correct answers = " + userScore);
    }else{
        answer.classList.add("incorrect"); //adding red color to incorrect selected option
        console.log("Wrong Answer");

        for(i=0; i < allOptions; i++){
            if(option_list.children[i].textContent == correcAns){ //show correct answer if no choosed one
                option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
                console.log("Auto selected correct answer.");
            }
        }
    }
    for(i=0; i < allOptions; i++){
        option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
    }
    next_btn.classList.add("show"); //show the next button if user selected any option
}

function showResult(){ // show result to the student + how much time + some encouragements 
    info_box.classList.remove("activeInfo"); //hide info box
    quiz_box.classList.remove("activeQuiz"); //hide quiz box
    result_box.classList.add("activeResult"); //show result box
    const scoreText = result_box.querySelector(".score_text");
    const quizEndTime = new Date();
    const quizDuration = (quizEndTime - quizStartTime) / 1000; // in seconds 
    let resultText = '';

    if (userScore > 6){ // if user scored more than 6
        resultText = '<span>Congrats ! You have very well understood the lesson. You got '+ userScore +' out of '+ questions.length +'</p></span>';
    }
    else if(userScore > 5){ // if user scored more than 5
        resultText = '<span>Nicely done ! You got '+ userScore +' out of '+ questions.length +'</span>';
    }
    else if(userScore > 3){ // if user scored more than 3
        resultText = '<span>However, there are some misunderstandings. You should review the lesson to improve. You got '+ userScore +' out of '+ questions.length +'</p></span>';
    }
    else{ // if user scored less than 3
        resultText = '<span>Unfortunately, you have failed this quiz. You should review the lesson. You got '+ userScore +' out of '+ questions.length +'</span>';
    }

    resultText += "<p>Total duration of the quiz is : " + quizDuration + " seconds</p>";

    scoreText.innerHTML = resultText; }


function queCounter(index){
    //creating a new span tag and passing the question number and total question
    let totalQueCounTag = '<span><p>'+ index +'</p> of <p>'+ questions.length +'</p> Questions</span>';
    bottom_ques_counter.innerHTML = totalQueCounTag;  //adding new span tag inside bottom_ques_counter
}

goBack.onclick = () => {
    window.location.href = 'index.html';
  }