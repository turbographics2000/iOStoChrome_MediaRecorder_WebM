const apiKey = '96290d86-2e8a-490a-9e26-1be00036e7d6';

const peer = new Peer({key: apiKey});
let mr = null;

peer.on('open', _ => {
  dispMyId.textContent = peer.id; 
});  
peer.on('call', call => {
  call.on('stream', stream => {
    remotePreview.srcObject = stream;
  });
  navigator.mediaDevices.getUserMedia({video:true}).then(stream => {
    call.answer(stream);
  }).catch(e => {
    console.log('answer error');
  });
});

btnConnect.onclick = function() {
  if(!txtConnectId.value.trim()) return;
  navigator.mediaDevices.getUserMedia({video:true}).then(stream => {
    const call = peer.call(txtConnectId.value.trim(), stream);
    call.on('stream', remoteStream => {
      remotePreview.srcObject = remoteStream;
    })
  }).catch(e => {
    console.log('gum error', e);
  });
};
btnRecord.onclick = function() {
  btnRecord.textContent = '録画中';
  btnRecord.disabled = true;
  mr = new MediaRecorder(remotePreview.srcObject, {
    mimeType: 'video/webm; codecs=vp8'
  });
  mr.start(10000);
  mr.ondataavailable = function(evt) {
    btnRecord.textContent = '録画';
    mr.stop();
    mr = null;
    document.querySelectorAll('.download').forEach(elm => elm.remove());
    const download = document.createElement('a');
    download.href = URL.createObjectURL(evt.data);
    download.classList.add('download');
    download.textContent = '録画ダウンロード';
    document.body.appendChild(download);
    recPreview.srcObject = evt;
  };
}
