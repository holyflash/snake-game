// код определения локального IP-адреса пользователя из статьи с https://blog.ivru.net/?id=157
const getUserIP = (onNewIP) => {
	const myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  
	const pc = new myPeerConnection({
	  iceServers: []
	});
  
	const noop = () => {};
	const localIPs = {};
	const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;
  
	const iterateIP = (ip) => {
	  if (!localIPs[ip]) onNewIP(ip);
	  localIPs[ip] = true;
	};
	let key;
  
	pc.createDataChannel('');
	pc.createOffer().then(sdp => {
	  sdp.sdp.split('\n').forEach(line => {
		if (line.indexOf('candidate') < 0) return;
		line.match(ipRegex).forEach(iterateIP);
	  });
  
	  pc.setLocalDescription(sdp, noop, noop);
	}).catch(reason => {
		  // Обработка ошибок
	});
  
	pc.onicecandidate = ice => {
	  if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
	  ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
	};
  };
  
  try {
	localIp;// Проверяем есть ли в HTML элемент с id localIp
	try {//Если в HTML есть элемент с id localIp
	  getUserIP(ip => {// Пробуем определить локальнйы IP
		if (ip.length > 0) {// Если длина полученного IP больше 1
		  localIp.innerHTML = `Ваш локальный IP: ${ip}`;
		} else {
		  localIp.innerHTML = 'Ваш локальный IP не был определен.';}
		}
	  );
	} catch (err) {
	  localIp.innerHTML = 'Ваш локальный IP не удалось определить в Вашем браузере.';
	}
  } catch (err) {
	// Если на странице нет элемента в Id localIp - ничего не делаем
  }