var url = "https://smn.conagua.gob.mx/webservices/?method=1";

function getDataAJAX() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
        if (this.status == 200) {
            console.log(this.response);
            // var data = pako.inflate(new Uint8Array(this.response), {to:'string'});
            // // console.log(data);

            // let jsonData = JSON.parse(data);

            // console.log(jsonData);
        } else {
            console.log('ERROR');
        }
    }
    xhr.send();
}

getDataAJAX();