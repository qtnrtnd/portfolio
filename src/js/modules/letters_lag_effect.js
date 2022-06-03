import DOM from "./dom_var";

const setLettersLag = function () {

    const LETTERS_LAG_INTERVAL = 0.022;
    const MIN_WORD_LENGTH = 10;

    DOM.actionSentences.forEach(sentence => {

    const oldHTML = sentence.innerText;
    let newHTML = "";

    const lagMap = [];
    let lastBreak = 0;
    let spacesNumber = 0;

    const splittedFull = oldHTML.split('');

    splittedFull.forEach((char, i) => {

        const lastChar = i >= splittedFull.length - 1

        if (char === " " || lastChar) {

        spacesNumber++;

        if (lastChar) i++;

        if (i - lastBreak >= MIN_WORD_LENGTH || lastChar) {

            lagMap.push([]);
            const mid = Math.floor((i - lastBreak - spacesNumber) / 2);
            
            let letterId = 0;

            for (let j = lastBreak; j < i; j++) {

            if (splittedFull[j] !== " ") {

                const lag = Math.round((LETTERS_LAG_INTERVAL + Math.abs(letterId - mid) * LETTERS_LAG_INTERVAL) * 1000) / 1000;
                lagMap[lagMap.length - 1].push(lag);

                letterId++;

            } else {

                lagMap.push([]);

            }
            }

            lastBreak = i + 1;
            spacesNumber = 0;
        }
        
        }
    });

    const splittedWords = oldHTML.split(' ');

    splittedWords.forEach((word, i) => {
        
        const splittedLetters = word.split('');

        newHTML += "<i>";

        splittedLetters.forEach((letter, j) => {

        newHTML += `<i data-lag='${lagMap[i][j]}'>${letter}</i>`;
        })

        newHTML += "</i>";
        
        if (i < splittedWords.length - 1) newHTML += " ";

    });

    sentence.innerHTML = newHTML;
    });
}

export default setLettersLag;