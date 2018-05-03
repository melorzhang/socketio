/**
 * Created by hp on 2018/5/3.
 */
$(function() {
	var socket = io();
	var getUserInfo=()=>{
		return sessionStorage.getItem('userInfo')&&JSON.parse(sessionStorage.getItem('userInfo'));
	};
	var userInfo=getUserInfo();
	var userType='customer';
	var targetId;
	var getSource=()=>{
		return 0;
	};
	var source=getSource();
	$('#login button').on('click',function(e) {
		e.preventDefault();
		socket.emit('getToken', {
			userName: $('#userName').val(),
			psw: $('#psw').val(),
			userType,
			source,
		});
		$('#userName').val('');
		$('#psw').val('');
		return false;
	});
	//common socket event start
	if (userInfo&&userInfo.userName && userInfo.token && userInfo.userId) {
		$('#login').hide();
		socket.emit('getToken', {
			userName: userInfo.userName,
			token: userInfo.token,
			userType,
			source,
		})
	}

	$('#msg').submit(function() {
		userInfo=sessionStorage.getItem('userInfo')&&JSON.parse(sessionStorage.getItem('userInfo'));
		if (userInfo.userName && userInfo.token && userInfo.userId) {
			const data={
				msg: $('#m').val(),
				token: userInfo.token,
				userType,
				targetId,
				createTime: Number(new Date()),
				userId: userInfo.userId,
				userName: userInfo.userName,
				source,
			};
			console.log('#msg',data);
			socket.emit('chat message',data );
			$('#m').val('');
		} else {
			console.log(userInfo.userName , userInfo.token, userInfo.userId);
			$('#login').show();
		}
		return false;
	});
	socket.on('sysMsg', (msg) => {
		$('#messages').append($('<li>').text(`System:${msg}`));
	});
	socket.on('chat message', function(data) {
		console.log('chat message',data);
		$('#messages').append($('<li>').text(`${data.userType==='customer'?'客户':"客服"} ${data.userName}:${data.msg}`));
	});
	socket.on('getToken', (data) => {
		console.log('getToken',data);
		sessionStorage.setItem('userInfo',JSON.stringify({
			token:data.token,
			userName:data.userName,
			userId:data.id,
		}));
		$('#login').hide()
	});
	socket.on('err', (data) => {
		sessionStorage.removeItem('userInfo');
		console.error(data.errMsg, data.errCode);
	})
	//common socket event end
});