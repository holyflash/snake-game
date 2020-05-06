let bodys = [];

let myip = getUserIP(ip => myip = ip)

//Лучший Результат
let hightScoreOnWall = 0;
let hightScoreOffWall = 0;

//Сложность Уровней
level = 1;

// Шкала скорости 
let speedShell = 1;

// Музыка
let music = {
	sandstorm: new Audio('./sandstorm.mp3'),
	gas: new Audio('./gas.mp3'), 
	op: new Audio("./90s.mp3"),

	hunter: new Audio("./hunter.mp3"),
	fey: new Audio("./fejhoa.mp3")
}

//Выбранная Музыка
let selectedMusic = "sandstorm";

// Очки (Score)
let score = 0;

// Голова
let snake = {
	x: 325,
	y: 325,
	speedX: 25,
	speedY: 0,
};

// ХАРДБАСС ЦВЕТОВ
let colorTick;


// Яблоко 
let apple = {
	x: 0,
	y: 0,
}

// Глобальная Переменная тик
let gameTick;

//Скорость Змеи
let selectedMode = "hard";
let tickTime = {
	easy: 700,
	norm: 500,
	hard: 200,
	imposible: 100,
	save: 50,
};
//Скорость ускорения на кнопку пробел
let speedPower = 500;

//БУЛЕВОЕ ЗНОЧЕНИЕ - ФЛАГИ(Украины?)
let moovemended = false;
let firtsTick = false;
let speedBoost = false;
let musicStop = false;
let stopSnake = false;
let allMuteMusic = false;
let allMuteEffect = false;
let pause = false;
let wall = false;
let onPauseEscape = false;
let escapeGame = false;


// Управление змейкой
function keyBoard() {
	$(document).on(`keydown`, function(event) {
		// console.log(event.key)
		if(event.code == "KeyW" && snake.speedY != 25 && !moovemended) {
			snake.speedX = 0;
			snake.speedY = -25;
			moovemended = true;
		}
		if(event.code == "KeyA" && snake.speedX != 25 && !moovemended) {
			snake.speedY = 0;
			snake.speedX = -25;
			moovemended = true;
		}
		if(event.code == "KeyS" && snake.speedY != -25 && !moovemended) {
			snake.speedX = 0;
			snake.speedY = 25;
			moovemended = true;
		}
		if(event.code == "KeyD" && snake.speedX != -25 && !moovemended) {
			snake.speedY = 0;
			snake.speedX = 25;
			moovemended = true;
		}

		//cheats
		if(event.key == "Z" && myip == "192.168.31.136"){
			music.fey.play()
			speedShell = 100;
		}
		
		if(event.code == "Escape" && onPauseEscape && !speedBoost){
			$(".pause").toggleClass("show");
			pause = !pause;
			if(pause){
				clearInterval(gameTick);
			}
			else{
				gameTick = setInterval(tickFunc,tickTime[selectedMode]);
			}
		}
	})
}

$(".contentPause button").on("click", function(){
	$(".menu").removeAttr("style");
	$(".pause").toggleClass("show");
	onPauseEscape = false;
})

//Свойства паузы
// $(document).on("keyup", function(event){
// 	if(event.code == "Escape" && !pause){
// 		$(".pause").toggleClass("show")
// 		pause = true;
// 	}
// 	else {
// 		$(".pause").toggleClass("show")
// 		pause = false;
// 	}
// })

//Мут звука. Свойство
$(".imgToggle div[data-id='soundMute']").on("click", function(){
	$(this).toggleClass("showSound");
	if(!allMuteMusic){
		music[selectedMusic].pause()
		$(this).next().html("Off Music(on/off)")
		// $(".stext").html("Off Music(on/off)")
	}
	else{
		if(speedBoost)
		music[selectedMusic].play();
		music[selectedMusic].volume = 0.1;
		music[selectedMusic].loop = true;
		$(this).next().html("On Music(on/off)")
		// $(".stext").html("On Music(on/off)")
	}
	allMuteMusic = !allMuteMusic;
})

//Мут эффектов. Свойство
$(".imgToggle .effectMute").on("click", function(){
	$(this).toggleClass("showEffect");
	if(!allMuteEffect){
		clearInterval(colorTick)
		$("body").css({"background-color": "#eeeeee"})
		$(this).next().html("Off Effect(on/off)")
		// $(".etext").html("Off Effect(on/off)")
	}
	else{
		if(speedBoost){
			colorTick = setInterval(function(){
				let color = "#"+((1<<24)*Math.random()|0).toString(16);
				$("body").css({"background-color": color})
			},300)
		}
		$(this).next().html("On Effect(on/off)")
		// $(".etext").html("On Effect(on/off)")
	}
	allMuteEffect = !allMuteEffect
})

// Настройка Пробела и Музыки
function settingMusic() {
	$(document).on("keypress", function(event) {
		if(event.code == "Space" && !speedBoost && !musicStop && !pause){
			console.log("boost on")
			$(".boost").text("BOOST ON")
			clearInterval(gameTick);
			tickTime[selectedMode] -= speedPower;
			gameTick = setInterval(tickFunc,tickTime[selectedMode]);
			speedBoost = true;
			$(".game").css({transform: "scale(1.1)"});
			if(!allMuteEffect){
				colorTick = setInterval(function(){
					let color = "#"+((1<<24)*Math.random()|0).toString(16);
					$("body").css({"background-color": color})
				},300)
			}
			if(!allMuteMusic){
				music[selectedMusic].play();
				// music[selectedMusic].playbackRate = 0.3;
				music[selectedMusic].volume = 0.1;
				music[selectedMusic].loop = true;
				// $("body").css({"background-color": color});
				
			}

		}
	})

	$(document).on("keyup", function(event) {
		if(event.code == "Space" && speedBoost){
			endSpeedBoost();
		}
	})

}

function endSpeedBoost(){
	console.log("boost off")
	$(".boost").text("BOOST OFF")
	clearInterval(gameTick);
	clearInterval(colorTick)
	tickTime[selectedMode] += speedPower;
	if(!stopSnake){
		gameTick = setInterval(tickFunc,tickTime[selectedMode]);
	}
	speedBoost = false;
	$(".game").css({transform: "scale(1)"});
	$("body").removeAttr("style");
	music[selectedMusic].pause()
	// music[selectedMusic].currentTime = 0;
}

// интервал Новая Игра Кнопка
$(".newGame").on("click", function() {
	speedShell = 1;
	music.hunter.play();
	$(".menu").hide();
	clearInterval(gameTick);
	onPauseEscape = true;
	pause = false;
	stopSnake = false;
	musicStop = false;
	firtsTick = false;
	escapeGame = true;
	score = 0;
	$(".score").html("Score:" + " " + 0);
	$(".snake").eq(0).removeAttr("style");
	settingMusic()
	randomApple()
	snake = {x: 325,y: 325,speedX: 25,speedY: 0};
	$(".snake").css({
		left: snake.x,
		top: snake.y,
	})
	for (let body of bodys) {
		body.x = snake.x;
		body.y = snake.y;
		body.div.css({
			left: body.x + "px",
			top: body.y + "px",
		})
	}
	gameTick = setInterval(tickFunc,tickTime[selectedMode])
	for(let i = bodys.length; i > 3 ; i--){
		$(".snake").eq(i).remove()
	}
	// $(".snake").each((i,e) => {if (i>3) e.remove()});
	bodys.splice(3, bodys.length-3);
})

//Настройка окна настроек
$(".menu .setting").on("click", function(){
	$(".menu").toggleClass("hiden");
	$(".settingMenu").toggleClass("show")
	escapeGame = false;
})

//Кнопка Эскейп
$(document).on("keyup", function(event){
	if(event.code == "Escape" && !$(".menu").is(":visible") && !escapeGame){
		$(".menu .setting").trigger("click");
		// $(".menu").toggleClass("hiden");
		// $(".settingMenu").toggleClass("show")
	}
})

//Кнопка Вернутся в Меню в Настройках
$(".back").on("click", function(){
	$(".menu .setting").trigger("click");
})


//Замена Музыки
$(".lol").on("change", function(){
	let music_lol = $(".lol:checked").val()
	selectedMusic = music_lol;
})


// $(".game .mute .imgToggle").mouseenter(function(){
// 	console.log(123)
// 	$(this).find("p").addClass("show");
// })


// $(".game .mute .imgToggle").mouseleave(function(){
// 	console.log(321)
// 	$(this).find("p").removeClass("show");
// })

//Выбор Сложности
function startMode(){
	$(".changeLevel").on("click", function(){
		$(".changeLevel").removeClass("buttonMode")
		level = $(this).data("memes")
		selectedMode = level;
		speedPower = tickTime[selectedMode] / 2;
		$(this).addClass("buttonMode")
	})
	$(".hard").trigger("click");
}


//Функционал тика
function tickFunc(){
	moovemended = false;
	for(let i = bodys.length-1; i >= 0; i--) {
		if(i == 0) {
			bodys[i].x = snake.x;
			bodys[i].y = snake.y;
		}
		else {
			bodys[i].x = bodys[i-1].x;
			bodys[i].y = bodys[i-1].y;
		}
		bodys[i].div.css({
			left: bodys[i].x + "px",
			top: bodys[i].y + "px",
		})
	}

	snake.x += snake.speedX;
	snake.y += snake.speedY;
	
	//Игра без стен
	if(wall){
		if(snake.x > 675){
			snake.x = 0;
		}
		if(snake.y > 675){
			snake.y = 0;
		}
		if(snake.x < 0){
			snake.x = 675;
		}
		if(snake.y < 0){
			snake.y = 675;
		}
	}

	// Врезание в стену
	if((snake.x > 675 || snake.y > 675 || snake.x < 0 || snake.y < 0) && !wall){
		console.log("Lose Game");
		//alert("Lose Game");
		clearInterval(gameTick)
		$(".newGame").text("Restart");
		musicStop = true;
		stopSnake = true;
		onPauseEscape = false;
		$(".game").css({transform: "scale(1)"});
		$(".newGame").removeAttr("style");
		$("body").removeAttr("style");
		$(".menu").fadeIn(1000);
		music[selectedMusic].pause();
		music[selectedMusic].currentTime = 0;
		clearInterval(colorTick)
		return
	}


	// Строчка Power
	if(speedShell < 100 && !speedBoost){
		$(".shell").css("width",++speedShell + "%");
	}
	if(speedBoost && speedShell > 0){
		$(".shell").css("width",--speedShell + "%");
	}
	if(speedShell == 0){
		endSpeedBoost();
	}

	$(".snake:eq(0)").css("left", snake.x + "px");
	$(".snake:eq(0)").css("top", snake.y + "px");

	// Хавалка себя Хвоста
	for(let body of bodys){
		if(body.x == snake.x && body.y == snake.y && firtsTick && !musicStop){
			clearInterval(gameTick)
			$(".snake").eq(0).css({"background-color": "red"});
			$(".menu").fadeIn(1000);
			$(".newGame").text("Рестарт");
			$(".newGame").removeAttr("style");
			musicStop = true;
			stopSnake = true;
			onPauseEscape = false;
			$(".game").css({transform: "scale(1)"});
			$("body").removeAttr("style");
			music[selectedMusic].pause()
			music[selectedMusic].currentTime = 0;
			clearInterval(colorTick)
			break
		}
	}

	// Поедание яблока
	if(snake.x == apple.x && snake.y == apple.y){
		createBody()
		randomApple()
		score += 1;
		$(".score").html("Score:" + " " + score);
	}

	//Хай Скоре !Ё!!
	if(!wall){
		$(".hightScore").html("Hight Score: " + hightScoreOnWall + " (wallOn)");
		if(score > hightScoreOnWall){
			hightScoreOnWall = score;
		}
	}

	if(wall){
		$(".hightScore").html("Hight Score: " + hightScoreOffWall + " (wallOff)");
		if(score > hightScoreOffWall){
			hightScoreOffWall = score;
		}
	}
	firtsTick = true
}

// Два режима игры
$(".selectWall").on("change", function(){
	let check = $(this).prop("checked");
	wall = !wall;
	if(wall){
		$(".selectW span").html("Create walls");
		$(".hightScore").html("Hight Score: " + hightScoreOffWall + " (wallOff)");
	}
	else{
		$(".selectW span").html("Remove walls");
		$(".hightScore").html("Hight Score: " + hightScoreOnWall + " (wallOn)");
	}
	$(".game").toggleClass("no_limit");
})

// Рандомайз Яблоко
function randomApple() {
	apple.x = Math.floor((Math.random() * 700) / 25) * 25;
	apple.y = Math.floor((Math.random() * 700) / 25) * 25;
	for(let body of bodys){
		if(apple.x == body.x && apple.y == body.y){
			return randomApple();
		}
	}
	if(apple.x == snake.x && apple.y == snake.y){
		return randomApple();
	}
	$(".apple").css({
		left: apple.x + "px",
		top: apple.y + "px",
	})
}

// Тело Спавн
function createBody(){
	let div = $("<div></div>");
	let b = {x: 0, y: 0, div: div};
	if(bodys.length == 0){
		b.x = snake.x;
		b.y = snake.y;
	}
	else {
		b.x = bodys[bodys.length-1].x;
		b.y = bodys[bodys.length-1].y;
	}
	div.addClass("snake");
	div.appendTo(".game");
	div.css({top: b.y + "px", left: b.x + "px"});
	bodys.push(b);
}

// Старт Страницыи
function start() {
	// Голова
	$(".snake").css({top: snake.y + "px", left: snake.x + "px"});
	for(let i = 0; i < 3; i++){
		createBody()
	}
	randomApple();
	keyBoard();
	startMode()
}

start()
