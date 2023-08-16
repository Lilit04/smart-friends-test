import { useState, useEffect } from 'react';
import Parse from 'parse/dist/parse.min.js';
import 'bootstrap/dist/css/bootstrap.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

//import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';

// const externalObject = {
//   objectId: parseObject.id,
//   createdAt: parseObject.createdAt,
//   updatedAt: parseObject.updatedAt,
//   correctAnswer: parseObject.get('correctAnswer'),
//   // Add other relevant properties from the Parse object as needed
// };

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [result, setResult] = useState([]);
  const [selectedIndicator, setSelectedIndicator] = useState(null);

  const PARSE_APPLICATION_ID = 'KsiVc1c1aAFXtHQzTt9dMVrSHHlT13DLPuVyESpG';
  const PARSE_HOST_URL = 'https://parseapi.back4app.com/';
  const PARSE_JAVASCRIPT_KEY = 'kgicXnMgIxLKHSLzNVhJglZ9BxuM31A4UUPrDgSz';
  Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
  Parse.serverURL = PARSE_HOST_URL;

  //const [showConfetti, setShowConfetti] = useState(isSuccess);
  let correctAnswer = 'Z'

  var answerResultGoodTitle = ''
  var answerResultWrongTitle = ''
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const langString = urlParams.get('lang');
  console.log('langString:', langString)
  if (langString === 'nl') {
    answerResultGoodTitle = 'Goed gedaan!'
    answerResultWrongTitle = 'Helaas...'
  } else {

    answerResultGoodTitle = 'Well done!';
    answerResultWrongTitle = 'Too bad...'
  }



  useEffect(() => {
    console.log("useEffect")
    // Get the full URL
    //const currentURL = window.location.href;
    // Get the query string (part of the URL after the '?')
    const queryString = window.location.search;
    // Parse the query string to extract parameters as key-value pairs
    const urlParams = new URLSearchParams(queryString);
    // Get specific values from the parameters






    const idString = urlParams.get('id');     // This will give you "123"

    // Convert the 'id' string to a number using parseInt() function
    // const idAsNumber = parseInt(idString, 10); // The second parameter 10 specifies the base (decimal in this case)
    const idAsNumber = 111;


    const query = new Parse.Query('ExtRiddle');
    query.equalTo("extIdNumber", idAsNumber);
    query.find().then((response) => {
      console.log(response[0].attributes)
      setResult(response[0]);
      window.correctAnswer = response[0].get('correctAnswer');
      console.log(correctAnswer)



    }).catch((err) => {
      console.log("err = ", err)
    })
  }, [correctAnswer]);


  // check the user selected value if it's same as answer
  // if correct, show success dialog else, failed dialog by setting isSuccess = true or false
  const handleDecisionClick = () => {
    setIsConfirmModalOpen(false);
    setSelectedIndicator(null)
    //decision === 'A' ? setIsSuccess(true) : setIsSuccess(false);

    //correctAnswer = response[0].get('correctAnswer');

    var extAnswer = '';
    if (selectedIndicator === window.correctAnswer) {
      setIsSuccess(true);
      extAnswer = 'extAnswerGood';

    } else {
      setIsSuccess(false);
      extAnswer = 'extAnswerWrong';

    }

    //getLanguageStringForAnswerResult()

    console.log(correctAnswer)

    // Get the full URL
    //const currentURL = window.location.href;
    // Get the query string (part of the URL after the '?')
    const queryString = window.location.search;
    // Parse the query string to extract parameters as key-value pairs
    const urlParams = new URLSearchParams(queryString);
    // Get specific values from the parameters
    const idString = urlParams.get('id');     // This will give you "123"
    console.log(idString);
    console.log(idString);
    // Convert the 'id' string to a number using parseInt() function
    const idAsNumber = 111; // The second parameter 10 specifies the base (decimal in this case)
    //  const idAsNumber = parseInt(idString, 10); // The second parameter 10 specifies the base (decimal in this case)

    const query = new Parse.Query('ExtRiddle');
    query.equalTo("extIdNumber", idAsNumber);
    query.find().then((response) => {

      console.log(response[0].attributes)
      //setResult(response[0]);
      response[0].increment(extAnswer);
      response[0].save();
      console.log(response[0].attributes)

    }).catch((err) => {
      console.log("err = ", err)
    })


    // open dialog
    setIsModalOpen(true);

    localStorage.alreadyAnswered = "true";

    //function getLanguageStringForAnswerResult() {
    // const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);

    // }


  }

  const handleAnswerClick = (indicator) => {
    if (!localStorage.alreadyAnswered) {
      setIsConfirmModalOpen(true);
      setSelectedIndicator(indicator);
    } else {
      alert("You have already answered to this question.")
    }
  }

  return (
    result ?
      <>
        <div className='w-full h-full flex flex-col p-3 gap-2 justify-evenly md:p-8'>
          <div className=''>
            <p className='text-center' style={{ fontSize: '1.5rem', fontFamily: 'Union' }}>{result.attributes?.questionText}</p>
          </div>
          <div className='flex flex-col justify-center items-center'>
            <img src={result.attributes?.questionImage?._url} alt="" style={{ maxHeight: '50vh' }} />
          </div>
          <div className=''>
            <ColoredDivider />
            <ColoredDivider />
          </div>
          <div className='flex justify-evenly gap-4'>
            <EachDecision url={result.attributes?.answerImage1?._url} indicator='A' handleClick={(indicator) => handleAnswerClick(indicator)} />
            <EachDecision url={result.attributes?.answerImage3?._url} indicator='C' handleClick={(indicator) => handleAnswerClick(indicator)} />
            <EachDecision url={result.attributes?.answerImage2?._url} indicator='B' handleClick={(indicator) => handleAnswerClick(indicator)} />
            <EachDecision url={result.attributes?.answerImage4?._url} indicator='D' handleClick={(indicator) => handleAnswerClick(indicator)} />
            <EachDecision url={result.attributes?.answerImage5?._url} indicator='E' handleClick={(indicator) => handleAnswerClick(indicator)} />
          </div>
        </div>

        <Modal show={isConfirmModalOpen} onHide={() => setIsConfirmModalOpen(false)} style={{ top: '30px', maxHeight: '90%' }}>

          <Modal.Body style={{ backgroundColor: '#fcfbf0' }}>
            Are you sure?
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#fcfbf0' }}>
            <Button variant="danger" onClick={() => setIsConfirmModalOpen(false)}>No</Button>
            <Button variant="success" onClick={handleDecisionClick}>Yes</Button>
          </Modal.Footer>
        </Modal>


        {/* Dialog Section */}
        <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} style={{ top: '30px', maxHeight: '90%' }}>


          <Modal.Header closeButton style={{ backgroundColor: isSuccess ? '#44bf55' : '#e9222e' }}>


            <Modal.Title style={{ display: 'flex', alignItems: 'center', height: '100%' }}>

              <p className='text-center' style={{ fontSize: '1.5rem', fontFamily: 'Union', color: '#fdfbef' }}>{isSuccess ? answerResultGoodTitle : answerResultWrongTitle}</p>

            </Modal.Title>

          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#fcfbf0' }}>
            <p style={{ fontSize: '1.5rem !important', fontFamily: 'Union', whiteSpace: 'pre-wrap', padding: '1rem' }}>
              {result.attributes?.answerExplanation}
            </p>

            {isSuccess &&
              Array.from({ length: 50 }).map((_, index) => (
                <div
                  key={index}
                  className="confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 8}s`,
                  }}
                ></div>
              ))}

          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#fcfbf0' }}>
            <div className='mt-3' style={{

              float: 'center'
            }}>
              {/*<AwesomeButton type="primary" onPress={() => setIsModalOpen(false)}>Oke</AwesomeButton> */}
            </div>
          </Modal.Footer>



        </Modal>
      </> : null
  );
}

const EachDecision = ({ url, indicator, handleClick }) => (
  <div className='flex flex-col justify-center items-center relative'
    style={{
      width: '20%',
      maxWidth: '10rem'
    }} onClick={() => handleClick(indicator)}>
    <div className='flex'
    >
      <img src={url} alt=""
        className=''
      />
    </div>
    <p className='text-xl md:text-3xl' style={{ fontFamily: 'Union' }} >{indicator}</p>
  </div>
)
const ColoredDivider = () => (
  <div className='h-2 w-full bg-[#f9e364] my-2' />
)

export default App;
