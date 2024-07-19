import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Home = () => {

  const location = useLocation();
  const navigate = useNavigate();
   
  let initNumOfCard, initPlayer;
  if (location.state === null) {
    initNumOfCard = 32;
    initPlayer = [getPlayer(0), getPlayer(1)];
  } else {
    initNumOfCard = location.state.numOfCard;
    initPlayer = location.state.player;
  }
  const [numOfCard, setCardNum] = useState(initNumOfCard);
  const [player, setPlayer] = useState(initPlayer);

  useEffect(() => {
    player.forEach(p=>p.score=0);
  });

  return (
    <div className='main-bg'>
      <div className="game-set">
        <h3>カードは　なんまいで　あそびますか？</h3>
        <CardSelection numOfCard={numOfCard} setCardNum={setCardNum} />
      </div>
      <div className="game-set">
        <h3>なんにんで　あそびますか？</h3>
        <PlayerNumSelection 
                player={player}
                setPlayer={setPlayer}
              />
      </div>
      <div className="game-set">
        <h3>あそぶひとの　なまえを　きめよう！</h3>
        <PlayerProfile player={player} setPlayer={setPlayer} />
        <div style={{clear:'both'}}>
          <button className='start-btn' onClick={()=>{ 
            
            let copyPlayer = [...player];
            let turnList = []
            while (copyPlayer.length > 0) {
              let n = parseInt(Math.random() * copyPlayer.length);
              turnList.push(
                copyPlayer[n].no
              );
              copyPlayer.splice(n, 1);
            }
            navigate(
              '/play', { 
                state: {
                  numOfCard: numOfCard,
                  player: player,
                  originPlayer: player,
                  turnList: turnList
                } 
              }
            ) 
          }}><b>スタート</b></button>
        </div>  
      </div>
    </div>
  );
}

const PlayerNumSelection = ({player, setPlayer}) => {

  let min = 2;
  let max = 4;

  return (
    <div>
      <button onClick={()=>{
        if (parseInt(player.length) === min) return;
        document.querySelector('#numOfPlayerSelect').value = player.length-1;

        //set player box
        let copyPlayer = [...player];
        copyPlayer.pop();
        setPlayer(copyPlayer);
      }}>-</button>
      <select id='numOfPlayerSelect' defaultValue={player.length} onChange={(e)=>{
        let n = parseInt(e.target.value);
        let copyPlayer;
        if (n > player.length) {
          copyPlayer = [...player];
          let no = copyPlayer.length;
          while (n !== copyPlayer.length) {
            copyPlayer.push(getPlayer(no++));
          }
          setPlayer(copyPlayer);
        } else {
          copyPlayer = [...player];
          while (n !== copyPlayer.length) copyPlayer.pop();
          setPlayer(copyPlayer);
        }
      }}>
        {
          [2,3,4].map((i) => {
            return <option key={i} value={i}>{i}</option>
          })
        }
      </select>
      <button onClick={()=>{
        if (parseInt(player.length) === max) return;
        document.querySelector('#numOfPlayerSelect').value = player.length+1;

        //set player box
        let copyPlayer = [...player];
        let newPlayer = getPlayer(player.length);
        copyPlayer.push(newPlayer);
        setPlayer(copyPlayer);
      }}>+</button>
    </div>
  )
};

const CardSelection = ({numOfCard, setCardNum}) => {
  let list = [];
  let min = 20;
  let max = 56;
  for(let i=min; i<=max; i+=2) {
    list.push(i);
  }
  return (
    <>
      <button onClick={()=>{
        if (parseInt(numOfCard) === min) return;
        document.querySelector('#numOfCardSelect').value = numOfCard-2;
        setCardNum(numOfCard-2);
      }}>-</button>
      <select id='numOfCardSelect' defaultValue={numOfCard} onChange={(e)=>setCardNum(e.target.value)}>
        {
          list.map((i) => {
            return <option key={i} value={i}>{i}</option>
          })
        }
      </select>
      <button onClick={()=>{
        if (parseInt(numOfCard) === max) return;
        document.querySelector('#numOfCardSelect').value = numOfCard+2;
        setCardNum(numOfCard+2);
      }}>+</button>
    </>
  );
}

const pokemon = [7, 25, 133, 1];
const PlayerProfile = ({player, setPlayer}) => {
  
  
  
  return (
    <div className='home-profile-container'>
      {
        player.map((p, i) => {
          let imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon[p.no]}.svg`
          return (
              <div className='home-profile' key={i}>
                <div className='img-wrapper'>
                  <img src={imgUrl} alt={p.id} />
                </div>
                <input id={i} defaultValue={p.name} onChange={(e)=>{
                  let copyPlayer = [...player];
                  copyPlayer[i].name = e.target.value;
                  copyPlayer[i].id = pokemon[i];
                  copyPlayer[i].imgUrl = imgUrl;
                  setPlayer(copyPlayer);
                }}></input>
              </div>
          );
        })
      }
    </div>
  );
}

const getPlayer = (no) => {
  let imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon[no]}.svg`
  return {
    no: no,
    id: '',
    name: no+1,
    imgUrl: imgUrl,
    score: 0
  };
}

export default Home;