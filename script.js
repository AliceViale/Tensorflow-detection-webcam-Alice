/* Création de variables pour les boutons allumer/éteindre */
var allumerwebcam = document.getElementById('webcamButtonplay');
var eteindre = document.getElementById('webcamButtonoff');
/*Référencements à partir du DOM */
const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');
const enableWebcamButton = document.getElementById('webcamButtonplay');
const disableWebcamButton = document.getElementById('webcamButtonoff');
/* Fonction pour vérifier présence d'User Media*/
function getUserMediaSupported() {
  return !!(navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia);
}
if (getUserMediaSupported()) {
  enableWebcamButton.addEventListener('click', enableCam);
} else {
  console.warn('getUserMedia() is not supported by your browser');
}
/*Permission live webcam view et début classification*/
function enableCam(event) {
  if (!model) {
    return;
  }
  event.target.classList.add('removed');
  const constraints = {
    video: true
  }; /*Activation stream webcam*/
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    video.srcObject = stream;
    video.addEventListener('loadeddata', predictWebcam);
  });
}
var model = true;
demosSection.classList.remove('invisible');
/*Création d'un bouton éteindre auquel par un push on éteint aussi la détection*/
eteindre.onclick = function () {

  var stream = video.srcObject;

  var tracks = stream.getTracks();

  tracks.forEach(function (track) {

    track.stop();

    eteindre.push(children);

  });

  video.srcObject = null;

};
/*Chargement cocoSsd objet de l'html*/
var model = undefined;
cocoSsd.load().then(function (loadedModel) {
  model = loadedModel;
  demosSection.classList.remove('invisible');
});
/*Variable tableau pour la prédiction*/
var children = [];

function predictWebcam() {
  model.detect(video).then(function (predictions) {
    for (let i = 0; i < children.length; i++) {
      liveView.removeChild(children[i]);
    }
    children.splice(0);
    for (let n = 0; n < predictions.length; n++) {
      if (predictions[n].score > 0.66) {
        const p = document.createElement('p');
        p.innerText = predictions[n].class + ' - with '
          + Math.round(parseFloat(predictions[n].score) * 100)
          + '% confidence.';
        p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
          + (predictions[n].bbox[1] - 10) + 'px; width: '
          + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';

        const highlighter = document.createElement('div');
        highlighter.setAttribute('class', 'highlighter');
        highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
          + predictions[n].bbox[1] + 'px; width: '
          + predictions[n].bbox[2] + 'px; height: '
          + predictions[n].bbox[3] + 'px;';

        liveView.appendChild(highlighter);
        liveView.appendChild(p);
        children.push(highlighter);
        children.push(p);
      }
    }
    /*Fonction appelée pour continuer à prédire quand le navigateur est prêt*/
    window.requestAnimationFrame(predictWebcam);
  });
}


