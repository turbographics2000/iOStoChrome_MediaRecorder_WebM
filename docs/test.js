const apiKey = '96290d86-2e8a-490a-9e26-1be00036e7d6';

const peer = new Peer({key: apiKey});
peer.on('open', _ => {
  dispMyId.textContent = peer.id; 
});  
peer.on('call', stream => {
  remotePreview.srcObject = stream;
});

btnConnect.onclick = function() {
  if(!txtConnectId.value.trim()) return;
  navigator.mediaDevices.getUserMedia({video:true}).then(stream => {
    peer.call(txtConnectId.value.trim(), stream);
  }).catch(e => {
    console.log('gum error', e);
  });
};
btnRecord.onclick = function() {
  btnRecord.textContent = '録画中';
  btnRecord.disabled = true;
  let mr = new MediaRecorder(remotePreview.srcObject, {
    mimeType: 'video/webm; codecs=vp8'
  });
  mr.start(10);
  mr.ondataavailable = function(evt) {
    btnRecord.textContent = '録画';
    mr.stop();
    mr = null;
    document.querySelectorAll('.download').forEach(elm => elm.remove());
    const download = document.createElement('a');
    a.href = URL.createObjectURL(evt.data);
    a.textContent = '録画ダウンロード';
    document.body.appendChild(a);
    recPreview.srcObject = evt;
  };
}
