(function() {
    const neighbourhoods = [
        'Quartier des Trolls',
        'Quartier du Donjon',
        'Quartier des Elfes',
        'Quartier des Magiciens',
        'Bas Quartiers',
        'Commerçants',
        'Les Paysans'
    ];
    const chosenOnes = {
        'La dame du donjon': ['Quartier des Trolls', 'Bas Quartiers', 'Les Paysans'],
        'Le pickpocket': ['Quartier des Trolls', 'Les Paysans'],
        'Le monstre vagabond' : ['Quartier du Donjon', 'Les Paysans'],
        'L\'aventurier': ['Quartier des Trolls'],
        'Le mage': ['Quartier des Trolls'],
        'Les soldats': [],
        'L\'elfe sylvain': []
    };
    const events = [
        'Levée des impôts',
        'Jour de marché',
        'Livraison des armes au donjon par la Forge',
        'Concert de hard gothique',
        'Procession religieuse',
        'Réception du légat de Fang au Donjon'
    ]

    let inhabitedNeighbourhoods;
    let eventfulDays;
    let currentDay;

    function resetInhabitedNeighbourhoods() {
        inhabitedNeighbourhoods = {};
        for (let i=0; i < neighbourhoods.length; i++) {
            inhabitedNeighbourhoods[neighbourhoods[i]] = [];
        }
    }

    function initializeChosenOnes() {
        resetInhabitedNeighbourhoods();
        let remainingNeighbourhoods = neighbourhoods.slice();
        for (chosenOne in chosenOnes) {
            const forbiddenNeighbourhoods = chosenOnes[chosenOne];

            while (true) {
                const randomPosition = getRandomInt(0, remainingNeighbourhoods.length -1);
                const potentialNeighbourhood = remainingNeighbourhoods[randomPosition];

                if (-1 === forbiddenNeighbourhoods.indexOf(potentialNeighbourhood)) {
                    inhabitedNeighbourhoods[potentialNeighbourhood].push(chosenOne);
                    remainingNeighbourhoods.splice(randomPosition, 1);
                    break;
                }
            }
        }
    }

    function moveChosenOnes() {
        const previously = inhabitedNeighbourhoods;
        resetInhabitedNeighbourhoods();

        for (neighbourhood in previously) {
            const chosenOnesInNeighbourhood = previously[neighbourhood];
            for (let i=0; i < chosenOnesInNeighbourhood.length; i++) {
                const chosenOne = chosenOnesInNeighbourhood[i];
                let newNeighbourHood = getNextNeighbourhood(neighbourhood);

                while (true) {
                    if (-1 === chosenOnes[chosenOne].indexOf(newNeighbourHood)) {
                        inhabitedNeighbourhoods[newNeighbourHood].push(chosenOne);
                        break;
                    }
                    newNeighbourHood  = getNextNeighbourhood(newNeighbourHood);
                }
            }
        }
    }

    function getNextNeighbourhood(currentNeighbourhood) {
        let position = neighbourhoods.indexOf(currentNeighbourhood) +1;
        if (position >= neighbourhoods.length) {
            position = 0;
        }
        return neighbourhoods[position];
    }

    function showNeighbourhoods() {
        const tbody = document.querySelector('#neighbourhoods tbody');
        cleanNode(tbody);

        for (neighbourhood in inhabitedNeighbourhoods) {
            const line = document.createElement("tr");
            const firstColumn = document.createElement("td");
            const secondColumn = document.createElement("td");

            firstColumn.textContent = neighbourhood;
            secondColumn.textContent = inhabitedNeighbourhoods[neighbourhood].length ? inhabitedNeighbourhoods[neighbourhood].join(', ') : "/";
            line.appendChild(firstColumn);
            line.appendChild(secondColumn);
            tbody.appendChild(line);
        }
    }

    function initializeDays() {
        currentDay = 1;
        eventfulDays = [];
        eventfulDays.push('/');
        let remainingEvents = events.slice();
        while (remainingEvents.length > 0) {
            eventfulDays.push(remainingEvents.splice(getRandomInt(0, remainingEvents.length -1), 1));
        }
        eventfulDays.push('/');
    }

    function showDays() {
        const tbody = document.querySelector('#days tbody');
        cleanNode(tbody);

        for (let day = 1; day <= eventfulDays.length; day++) {
            const line = document.createElement("tr");
            if (currentDay === day) {
                line.classList.add('current');
            }

            const firstColumn = document.createElement("td");
            const secondColumn = document.createElement("td");

            firstColumn.textContent = day;
            secondColumn.textContent = eventfulDays[day-1];
            line.appendChild(firstColumn);
            line.appendChild(secondColumn);
            tbody.appendChild(line);
        }
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min +1)) + min;
    }

    function cleanNode(node) {
        while (node.hasChildNodes()) {
            node.removeChild(node.lastChild);
        }
    }

    function newGame() {
        initializeDays();
        initializeChosenOnes();
        showNeighbourhoods();
        showDays();
        document.getElementById('next').removeAttribute('disabled');
    }

    function nextDay() {
        moveChosenOnes();
        showNeighbourhoods();
        currentDay++;
        showDays();

        if (currentDay >= eventfulDays.length) {
            document.getElementById('next').setAttribute('disabled', 'disabled');
        }
    }

    document.addEventListener("DOMContentLoaded", function(event) {
        newGame();
        document.getElementById('next').addEventListener("click", function(event) {
            event.preventDefault();
            nextDay();
        });
        document.getElementById('reset').addEventListener("click", function(event) {
            event.preventDefault();
            newGame();
        });
    });
})();

