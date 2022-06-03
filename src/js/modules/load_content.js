import WebFont from "webfontloader";

import circle1 from "../../img/circle-1.png";
import circle2 from "../../img/circle-2.png";
import circle3 from "../../img/circle-3.png";

const images = {
    circle1: circle1,
    circle2: circle2,
    circle3: circle3
};

export default function loadContent() {

    const promises = [
        /*new Promise(resolve => {

            WebFont.load({
                custom: {
                    families: [],
                },
                google: {
                    families: []
                },
                active: resolve
            });
    
        })*/
    ]

    for (const key in images) {
        promises.push(new Promise(resolve => {
            const imgElement = document.createElement('img');
            imgElement.addEventListener('load', function () {
                images[key] = this;
                resolve();
            });
            imgElement.src = images[key];
        }))
    }

    return Promise.all(promises).then(()=>{return images});
};
