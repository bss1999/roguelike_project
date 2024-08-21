import chalk from 'chalk';
import readlineSync from 'readline-sync';


function playeratk (value) {
  monster.hp -= value
}

function monsteratk () {
  player.hp
}

class Player {
  constructor() {
    this.hp = 100;
    this.power = 10;
  }

  attack() {
    // 플레이어의 공격
    playeratk(this.power);
    
  }
  
  run() {
    // 플레이어의 도망
    
  }
}

class Monster {
  constructor() {
    this.hp = 100;
    this.power = 10;
  }

  attack() {
    // 몬스터의 공격
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(
        //플레이어 정보 출력
      `| player HP: ${player.hp}, Attack: ${player.power}`,
    ) +
    chalk.redBright(
        //몬스터 정보 출력
      `| Monster HP: ${monster.hp}, Attack: ${monster.power} |`,
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];
  let i=1;

  while(player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 도망친다.`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`[턴${i}]${choice}를 선택하셨습니다.`));
    i++; //몇번째 턴의 선택인지 표기
    if(logs.length > 6) {logs.shift()} //선택 로그가 6개이상 출력되면 맨 앞의 선택값을 제거해 원활한 플레이 유도

    switch(choice)
    {
        case 1 :
            console.log("플레이어의 공격!")
            playeratk()
            break;
        case 2 :
            run()
            break;
        default :
            console.log("이상현상")
    }
  }
  
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);

    // 스테이지 클리어 및 게임 종료 조건
    if(player.hp >= 0)
    {
      console.log("[게임오버!] 플레이어가 죽었습니다...")
      break;
    }

    stage++;
  }
}