import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faBook, faVolumeHigh, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet-async';

const getIndexOfPlayer = (no, player) => {
  for(let i in player) {
    let x = parseInt(i);
    if (player[x].no === no) return x;
  }
  return null;
}

const getOfPlayer = (no, player) => {
  for(let i in player) {
    let x = parseInt(i);
    if (player[x].no === no) return player[x];
  }
  return null;
}

const shuffle = (cards) => {

  const shuffledCards = [];

  while (cards.length > 0) {
    let n = cards.length;
    let k = parseInt(Math.random() * n);
    shuffledCards.push(cards[k]);
    cards.splice(k, 1);
  }

  return shuffledCards;
}

const initCards = (numOfCard) => {
  const getCard = (no, id) => {
    return {
      no: no,
      id: id,
      imgUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`,
    }
  };

  let cards = [];
  let no, id;
  let idChk = new Map();

  for (let i=0; i<numOfCard; i++) {
    no = i+1;
    if (i % 2 === 0) {
      let stopFlag = false;
      while (stopFlag===false){
        id = parseInt(Math.random() * 650); //get random number less than 650
        if (undefined === idChk.get(id)) {
          idChk.set(id, id);
          stopFlag = true;
        }
      }
    }
    let card = getCard(no, id);
    cards.push(card);
  }

  for(let i=0; i<10000; i++) cards = shuffle(cards);
  return cards;
};

const Play = () => {

  const componentName = 'ポケモンしんけいすいじゃく - Play';
  const location = useLocation();
  const navigate = useNavigate();
  
  let numOfCard = location.state.numOfCard;
  let initPlayer = location.state.player;
  let originPlayer = location.state.originPlayer;
  const turnList = location.state.turnList;
  
  const [player, setPlayer] = useState(initPlayer);
  const [rank, setRank] = useState(['', '', '', '']);
  
  useEffect(() => {
    //set rank
    let prevScore;
    let r;
    let newRank = []
    for (let i=0; i<rank.length; i++){
      if (i===0) {
        prevScore = player[i].score;
        newRank.push('1st');
        r = 1;
      } else {
        if (i >= player.length) {
          newRank.push('');
        }else if (prevScore === player[i].score) {
          newRank.push(newRank[i-1]);
        } else {
          r++;
          switch (r) {
            case 2:
              newRank.push('2nd');
              break;
            case 3:
              newRank.push('3rd');
              break;
            case 4:
              newRank.push('4th');
              break;
            default:
          }
          prevScore = player[i].score;
        }
      }
    }
    setRank(newRank);
  }, [player, rank.length])

  const [cards] = useState(initCards(numOfCard));
  const [inactiveCardCnt, setInactiveCardCnt] = useState(0);
  useEffect(() => {
    if (parseInt(numOfCard) === inactiveCardCnt) {
      document.getElementById('board-msg').innerHTML = `<h3>ゲーム　は　おわりました。 また　あそぼうね！</h3>`;
    }
  }, [inactiveCardCnt, numOfCard])

  //set turn of play
  const [t, setT] = useState(0);
  const [turnUser, setTurnUser] = useState(getOfPlayer(turnList[t], player));

  let seletedCard = []; //selected card list

  const cardHandler = (id) => {
    
    let card = document.getElementById(id) //a selected card
  
    if (card.className.search('inactive-card') >= 0) return;

    if (seletedCard.length < 2) {

      card.className = 'selected-card';
      card.children[0].className = 'selected-heart';
      card.children[1].className = 'selected-card-img';

      let id = parseInt(card.id);
      if (seletedCard.length === 1 && seletedCard[0].no === id) return;
      for (let i=0; i<cards.length; i++) {
        if (cards[i].no === id) {
          seletedCard.push(cards[i]);
          break;
        }
      }
      
      if (seletedCard.length === 2) {
        if (seletedCard[0].id === seletedCard[1].id) {
          turnUser.score += 1;
          let copyPlayer = [...player];
          copyPlayer[getIndexOfPlayer(turnUser.no, player)] = turnUser;
          
          copyPlayer.sort((a, b) => {
            if (a.score === b.score) {
              return getIndexOfPlayer(b.no) - getIndexOfPlayer(a.no);
            } else {
              return b.score - a.score;
            }
          })
          setPlayer(copyPlayer);

          setTimeout(()=>{
            seletedCard.forEach((card) => {
              let elem = document.getElementById(card.no);
              elem.className = 'inactive-card';
              elem.children[1].className = 'inactive-card-img';
              
            })
            setInactiveCardCnt(inactiveCardCnt + 2);
            seletedCard = [];
          }, 2000);

        } else {

          setTimeout(()=>{
            seletedCard.forEach((card) => {
              let elem = document.getElementById(card.no);
              elem.className = 'card';
              elem.children[0].className = 'heart';
              elem.children[1].className = 'card-img';

              let i = (t+1) % player.length;
              setT(i);
              setTurnUser(getOfPlayer(turnList[i], player));

              seletedCard = [];

            });
          }, 4000);

        }
      }
    } else {
      return;
    }
  };

  return (
    
    <div className='main-container'>
        <Helmet>
          <title>{componentName}</title>
        </Helmet>
        <div className='icon' onClick={()=>navigate('/' , { 
            state: {
              numOfCard: numOfCard,
              player: originPlayer
            } 
          })}><FontAwesomeIcon icon={faAngleLeft} /></div>
          <div className='board-msg' id='board-msg'>
            <h3>
              <FontAwesomeIcon icon={faVolumeHigh} />　　　{turnUser.name}　の　じゅんばん　だよ！
            </h3>
          </div>
          {/*
          <div className='icon' onClick={()=>navigate('/' , { 
            state: {
              numOfCard: numOfCard,
              player: originPlayer
            } 
          })}><FontAwesomeIcon icon={faBook} /></div>
          */}
          <div className='icon'><FontAwesomeIcon icon={faBook} /></div>
      <div className='board-container'>
        {
          player.map((p, i) => {
            return (
              <div className='board-profile' style={{textAlign:'center'}} key={p.no}>
                
                <div className='img-wrapper'>
                  <img src={p.imgUrl} alt={p.id} />
                </div>
                <div style={{width: '80%', margin: '0 auto'}}>
                  <input className='rank' value={rank[i]} readOnly />
                  <input className='name' value={p.name} readOnly />
                </div>
                <div className='score'>{p.score}</div>
              </div>
            )
          })
        }
      </div>
      <div className='card-container'>
      {
        cards.map((card, i) => {
          return (
            <div key={i} id={card.no} className='card' onClick={()=>cardHandler(card.no)}>
              <div className='heart'><FontAwesomeIcon icon={faHeart} /></div>
              <img className='card-img' src={card.imgUrl} alt={card.id} />
            </div>
          )
        })
      }
      </div>
    </div>
  )
}

export default Play;