let socket = null;

$(initialize);

function initialize() {
  $('#dialog').dialog({
    modal: true,
    width: 650,
    buttons: {
      OK: function() {
        $(this).dialog('close');
        setTimeout(connect, 2000);
      }
    }
  });

  let handle = $('#slider-handle');

  $('#angle').slider({
    step: 5,
    create: () => {
      handle.text('0');
    },
    slide: (event, ui) => {
      console.log('Angle: ' + ui.value);
      handle.text(ui.value);
      socket.send('{ "sensor": "angle", "value": ' + ui.value + ' }');
    }
  });

  $('#button').click( (event) => {
    console.log('Button: pressed');
    socket.send('{ "sensor": "button", "value": "singlepress" }');
  });
}

function connect() {
  socket = new WebSocket('ws://' + location.hostname + ':' + location.port);

  socket.onopen = function () {
    console.log('WebSocket Opened: ', socket.readyState);
  }

  socket.onmessage = function (message) {
    let msg = JSON.parse(message.data);

    console.log('WebSocket Message: ' + JSON.stringify(msg));

    if (msg.command === 'red') {
      red(msg.value);
    }
    else if (msg.command === 'blue') {
      blue(msg.value);
    }
    else if (msg.command === 'buzzer') {
      buzzer(msg.value);
    }
    else if (msg.command === 'angle') {
      angle(msg.value);
    }
  }

  socket.onclose = function () {
    console.log('WebSocket Closed: ', socket.readyState);
    setTimeout(connect, 1000);
  }
}

function red(value) {
  console.log('Red: ' + value);
  $('#red').css('filter', 'grayscale(' + (value ? '0%' : '100%') + ')');
}

function blue(value) {
  console.log('Blue: ' + value);
  $('#blue').css('filter', 'grayscale(' + (value ? '0%' : '100%') + ')');
}

function angle(value) {
  console.log('Set Angle: ' + value);
  $('#angle').slider('option', 'value', value);
  $('#slider-handle').text(value);
}

function buzzer(value) {
  console.log('Buzzer: ' + value);

  if (value) {
    $('#buzzer')[0].play();
  }
  else {
    $('#buzzer')[0].pause();
  }
}
