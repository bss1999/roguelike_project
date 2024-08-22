import chalk from 'chalk';
import readlineSync from 'readline-sync';


function random_Number() {return Math.random()}


class Player {
  constructor() {
    this.hp = 100; //체력
    this.power = 15; //공격력
    this.voidrate = 50; //도망확률
    this.defense = 5; //방어수치
    this.counter = 20; //반격확률
    this.critical = 10; //치명타확률
  }

  attack() {
    // 플레이어의 공격
    return Math.floor(Math.random() * 11) + (this.power - 5)
    }
  
  run() {
    // 플레이어의 도망
    return Math.floor(Math.random() * 101)
  }
}

class Monster {
  constructor(stage) {
    this.hp = 60;
    this.power = 10;
  }

  attack() {
    // 몬스터의 공격
    return Math.floor(Math.random() * 11) + (this.power - 5)
  }
}

function displayStatus(stage, player, monster) { //스테이터스 표기
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(chalk.cyanBright(`| Stage: ${stage} |`))
  console.log(
    chalk.blueBright(
        //플레이어 정보 출력
      `| player 체력: ${player.hp}, 공격력: ${player.power}, 치명타 확률 : ${player.critical}%, 방어력 : ${player.defense}, 반격 : ${player.counter}%, 도망 확률 : ${player.voidrate}%`,
    ) 
  );
  console.log(chalk.redBright(
    //몬스터 정보 출력
  `| Monster 체력: ${monster.hp}/${mons_maxhp}, 공격력: ${monster.power} |`,
),)
  console.log(chalk.magentaBright(`=====================\n`));
}

const reward = ["체력", "공격력", "방어력", "도망", "크리티컬"] //능력치 보상 종류
let logs = [];
let mons_maxhp=0, mons_maxpower=0 //몬스터의 최대체력 저장 - 스테이지가 넘어감에따라 강하게 만들기위해


const battle = async (stage, player, monster) => {
  // let logs = [];
  let i=1; // 턴표시를 위한 반복자 / 새 전투가 시작되면 초기화
  let dmg = 0; // 데미지 표기를 위한 변수
  let _defense = 0 //턴이 넘어감에따라 방어력 초기화
  let hp_increase = 0, pw_increase = 0; //몬스터의 스테이지당 증감량

  if (stage === 1) {//몬스터의 스테이지마다의 스탯 조정
    mons_maxhp = 60
    mons_maxpower = 10
  } 
  else if (stage > 1 && stage !== 10) {
  hp_increase = Math.floor(random_Number() * 11) + 10
  monster.hp = mons_maxhp + hp_increase
  pw_increase = Math.floor(random_Number() * 4) + 1
  monster.power = mons_maxpower + pw_increase
  }
  else if (stage===10) { //보스 몬스터
    hp_increase = Math.floor(random_Number() * 11) + 20
    monster.hp = mons_maxhp + hp_increase
    pw_increase = Math.floor(random_Number() * 6) + 5
    monster.power = mons_maxpower + pw_increase
  }

  mons_maxhp += hp_increase //최대체력 저장
  mons_maxpower += pw_increase// 


  if(stage !== 10) { //몬스터 종류
    logs.push("몬스터가 나타났습니다!")
  }
  else {
    logs.push("보스가 나타났습니다! [주의:보스한테서는 도망칠수없습니다.]")
  }

  while(player.hp > 0) {
    _defense = 0;
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격 2. 방어 3. 도망`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    if(logs.length > 5) {
      while(1) 
        {
      logs.shift()
      if(logs.length<6) {break;} 
        }
    } //선택 로그가 5개이상 출력되면 로그를 제거


    switch(choice) { // 플레이어의 선택에 따라 다음 행동 처리
      case "1" : //공격 선택지
        const cri = Math.floor(Math.random() * 101)
        dmg = player.attack()
        if(cri > player.critical) { // 치명타 계산
          monster.hp -= dmg
          logs.push(chalk.green(`[${i}] [플레이어의 공격!] 몬스터에게 ${dmg}만큼의 피해를 입혔습니다.`));
        }
        else if (cri <= player.critical)
        {
          monster.hp -= dmg * 2
          logs.push(chalk.yellow(`[${i}] [플레이어의 치명타 공격!] 몬스터의 급소를 공격해 ${dmg*2}만큼의 피해를 입혔습니다.`));
        }
        break;
      case "2" : //방어 선택지
        _defense += player.defense
        logs.push(chalk.green(`[${i}] [방어] 플레이어가 방어자세를 취해 ${_defense}만큼의 데미지를 경감합니다!`))
        break;
      case "3" : //도망 선택지
        const run_rate = player.run()
        if(stage===10) {
          logs.push(`[${i}] [불가능] 마지막 적으로부터는 도망칠 수 없습니다!`)
          break;
        }
        else if (run_rate<=player.voidrate) {
          monster.hp = null;
          break;
        }
        else if(run_rate>player.voidrate) {
          logs.push(`[${i}] [도망 실패] 적으로부터 도망치려했지만 실패했습니다.`)
          break;
        }
    }

    if(monster.hp==null) {
      logs.push(`[${i}] [도망 성공!] 적으로부터 도망쳤습니다.`)
      logs.push(`도망에 성공하여 체력 30이 회복됩니다.`)
      player.hp += 30;
      break;
    }
    
    
    let monsteratk = monster.attack(); //몬스터의 턴
    dmg = monsteratk - _defense;
    
    if (dmg > 0) {
    player.hp -= dmg
    logs.push(chalk.red(`[${i}] [몬스터의 공격!]몬스터가 플레이어에게 ${dmg}만큼의 피해를 입혔습니다!`))
    }
    else if (dmg <= 0) {
      logs.push(chalk.red(`[${i}] [몬스터의 공격!] 몬스터가 공격했지만 피해를 입히지 못했습니다.`))
    }

    if(_defense !== 0) {
      const counter = Math.floor(random_Number() * 101)
      if(counter < player.counter) {
         dmg = monsteratk
         monster.hp -= dmg
        logs.push(chalk.blue(`[${i}] [반격!] 반격했습니다! 몬스터의 데미지인 ${dmg}만큼 피해를 가합니다.`))
      }
    }


    if(monster.hp <= 0) { // 스테이지 클리어 조건
      logs.push("[스테이지 클리어!]몬스터가 쓰러졌습니다. 보상으로 체력80회복과 능력치가 주어집니다.");
      player.hp += 80;
      const rewardselect = Math.floor(Math.random() * 5)
      switch (rewardselect) { //능력치 보상
        case 0 :
          const hp_up = Math.floor(random_Number() * 31) + 20
          logs.push(`능력치 : ${reward[rewardselect]} > ${hp_up} 증가`)
          player.hp += hp_up
          break;
        case 1 :
          const pw_up = Math.floor(random_Number() * 16) + 5
          logs.push(`능력치 : ${reward[rewardselect]} > ${pw_up} 증가`)
          player.power += pw_up
          break;
        case 2 :
          const dp_up = Math.floor(random_Number() * 7) + 4
          const count_up = Math.floor(random_Number() * 13) + 3
          logs.push(`능력치 : ${reward[rewardselect]} > ${dp_up} 증가, 반격확률 > ${count_up} 증가`)
          player.defense += dp_up
          player.counter += count_up
          break;
        case 3 :
          const run_up = Math.floor(random_Number() * 11) + 5
          logs.push(`능력치 : ${reward[rewardselect]} > ${run_up} 증가`)
          player.voidrate += run_up
          break;
        case 4 :
          const cri_up = Math.floor(random_Number() * 11) + 5
          logs.push(`능력치 : ${reward[rewardselect]} > ${cri_up} 증가`)
          player.critical += cri_up
          break;
      }

      break;}

      i++; //몇번째 턴의 선택인지 표기
  }
  
};

export async function startGame() {
  // console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);  //몬스터 생성
    await battle(stage, player, monster); // 전투 진입

    // 스테이지 클리어 및 게임 종료 조건
    if(player.hp <= 0)
    {
      console.log("[게임오버!] 플레이어가 죽었습니다...")
      process.exit()
    }

    stage++;
  }

  console.log("축하합니다. 게임을 클리어했습니다!")
}