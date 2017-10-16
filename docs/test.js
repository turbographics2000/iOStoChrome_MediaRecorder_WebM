const apiKey = '96290d86-2e8a-490a-9e26-1be00036e7d6';
const peer = new Peer({ key: apiKey });
let mr = null;
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
    btnRecord.textContent = '録画中';
    recChunks = [];
    mr = new MediaRecorder(remotePreview.srcObject, {
      mimeType: 'video/webm; codecs=vp8'
    });
    mr.ondataavailable = function (evt) {
      console.log('ondataavailable');
      recChunks.push(evt.data);
    };
    mr.onstop = function (evt) {
      mr = null;
      const recURL = URL.createObjectURL(new Blob(recChunks, { type: 'video/webm' }));
      document.querySelectorAll('.download').forEach(elm => elm.remove());
      const download = document.createElement('a');
      recPreview.src = download.href = recURL;
      download.classList.add('download');
      download.textContent = '録画ダウンロード';
      document.body.appendChild(download);
    }
    mr.start();
  } else {
    mr.stop();
    btnRecord.textContent = '録画';
  }
}
