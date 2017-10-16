const apiKey = '96290d86-2e8a-490a-9e26-1be00036e7d6';
const peer = new Peer({ key: apiKey });
let recChunks = null;

peer.on('open', _ => {
  dispMyId.textContent = peer.id;
  peer.listAllPeers(peers => {
    peers.forEach(remoteId => {
      if (remoteId !== peer.id) {
        txtConnectId.value = remoteId;
      }
    });
  });
});
peer.on('call', call => {
  call.on('stream', stream => {
    remotePreview.srcObject = stream;
  });
  navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    call.answer(stream);
  }).catch(e => {
    console.log('answer error');
  });
});

btnConnect.onclick = function () {
  if (!txtConnectId.value.trim()) return;
  navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    const call = peer.call(txtConnectId.value.trim(), stream);
    call.on('stream', remoteStream => {
      remotePreview.srcObject = remoteStream;
    })
  }).catch(e => {
    console.log('gum error', e);
  });
};
btnRecord.onclick = function () {
  if (btnRecord.textContent === '録画') {
    btnRecord.textContent = '停止';
    recChunks = [];
    var mr = new MediaRecorder(remotePreview.srcObject);
    mr.ondataavailable = function (evt) {
      if (evt.data.size > 0) {
        recChunks.push(evt.data);
      }
    };
    mr.onstop = function (evt) {
      mr = null;
      const recURL = URL.createObjectURL(new Blob(recChunks));
      document.querySelectorAll('.download').forEach(elm => elm.remove());
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = recURL;
      a.download = 'test.webm';
      a.click();
      URL.revokeObjectURL(recURL);
      setTimeout(_ => {
        a.remove();
      }, 0);
    }
    setTimeout(_ => {
      mr.start();
    }, 0);
  } else {
    mr.stop();
    btnRecord.textContent = '録画';
  }
}
