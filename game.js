import chalk from 'chalk';
import readlineSync from 'readline-sync';


class Player {
  constructor() {
    this.hp = 100; //체력
    this.power = 10; //공격력
    this.voidrate = 100; //도망확률
    this.defense = 5; //방어수치
    this.critical = 0; //치명타확률
  }

  attack() {
    // 플레이어의 공격
    // monster.hp -= player.power
    return function () {
      monster.hp -= player.power
    }
  }
  
  run() {
    // 플레이어의 도망
    
  }
}

class Monster {
  constructor(stage) {
    this.hp = Math.floor(80+(stage**Math.random()*10*stage));
    this.power = Math.floor(3+(stage**Math.random()*10));
  }

  attack() {
    // 몬스터의 공격
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} |`) +
    chalk.blueBright(
        //플레이어 정보 출력
      `| player HP: ${player.hp}, Attack: ${player.power}`,
    ) +
    chalk.redBright(
        //몬스터 정보 출력
      `| Monster HP: ${monster.hp}, Attack: ${monster.power} |`,
    ),
  );
  console.log(player)
  console.log(chalk.magentaBright(`=====================\n`));
}

let reward = ["체력 증가", "공격력 증가", "방어력 증가", "도망 확률 증가", "크리티컬확률 증가"] //능력치 보상 종류

const battle = async (stage, player, monster) => {
  let logs = [];
  let i=1;

  if(stage===10) {
  console.log("마지막 적이 나타났습니다! [주의:마지막 적은 도망칠수없습니다.]")
  }
  else {
    console.log("몬스터가 나타났습니다!")
  }

  while(player.hp > 0) {
    // console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격 2. 방어 3. 도망`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    console.clear();

    
    // 플레이어의 선택에 따라 다음 행동 처리
    // logs.push(chalk.green(`[턴${i}]${choice}를 선택하셨습니다.`));
    
    if(logs.length > 5) {
      while(1) 
        {
      logs.shift()
      if(logs.length<6) {break;} 
        }
    } //선택 로그가 5개이상 출력되면 로그를 제거

    switch(choice) {
      case "1" : //공격 선택지
        // monster.hp -= player.power;
        player.attack()
        monster.hp -= Math.floor(Math.random() * player.power) + 10
        logs.push(chalk.red(`[${i}] [플레이어의 공격!] 몬스터에게 ${player.power}만큼의 피해를 입혔습니다.`));
        break;
      case "2" : //방어 선택지
        break;
      case "3" : //도망 선택지
        let rate = Math.random() * 100
        if(stage===10) {
          logs.push(`[${i}] [불가능] 마지막 적으로부터는 도망칠 수 없습니다!`)
          break;
        }
        else if (rate<player.voidrate) {
          monster.hp = 0;
          logs.push(`[${i}] [도망 성공!] 적으로부터 도망쳤습니다.`)
          break;
        }
        else if(rate>player.voidrate) {
          logs.push(`[${i}] [도망 실패] 적으로부터 도망치려했지만 실패했습니다.`)
          break;
        }
    }
    

    monster.attack();
    player.hp -= Math.floor(Math.random() * monster.power) + 5
    logs.push(chalk.red(`[${i}] [몬스터의 공격!]몬스터가 플레이어에게 ${monster.power}만큼의 피해를 입혔습니다!`))

    if(monster.hp <= 0) {
      console.log("몬스터가 쓰러졌습니다.");
      console.log("스테이지 클리어!");
      console.log("보상으로 체력50회복과 능력치가 주어집니다.")
      player.hp += 50;
      let rewardselect = Math.floor(Math.random() * 4)
      switch (rewardselect) { //능력치 보상 (구현안됨)
        case "체력 증가" :
          hp_up = Math.floor(Math.random() * 30) + 20
          console.log(`능력치 : ${reward[rewardselect]} - ${hp_up}증가`)
          player.hp += hp_up
          break;
        case "공격력 증가" :
          pw_up = Math.floor(Math.random() * 15) + 5
          console.log(`능력치 : ${reward[rewardselect]} - ${pw_up}증가`)
          player.power += pw_up
          break;
        case "방어력 증가" :
          dp_up = Math.floor(Math.random() * 20) + 10
          console.log(`능력치 : ${reward[rewardselect]} - ${dp_up}증가`)
          player.defense += dp_up
          break;
        case "도망 확률 증가" :
          run_up = Math.floor(Math.random() * 10) + 5
          console.log(`능력치 : ${reward[rewardselect]} - ${run_up}증가`)
          player.voidrate += run_up
          break;
        case "크리티컬확률 증가" :
          cri_up = Math.floor(Math.random() * 10) + 5
          console.log(`능력치 : ${reward[rewardselect]} - ${cri_up}증가`)
          player.critical += cri_up
          break;
      }
      break;}

      i++; //몇번째 턴의 선택인지 표기
  }
  
};

export async function startGame() {
  console.clear();
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