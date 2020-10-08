// HELENA KOLBERG - JAVASCRIPT CHALLENGE


// QUESTION 1: What is the starting date and time (in UTC) of the earliest interval where any of the workers are free?

// ANSWER: 2020-01-01T00:15:00+00:00


// QUESTION 2: What is the ending date and time (in UTC) of the latest interval where any of the workers are free?

// ANSWER: 2020-01-01T19:15:00+00:00


// QUESTION 3: What are the intervals of date and times (in UTC) where there are at least 2 workers free?

// ANSWER: I'VE COMPARED THE INTERVAL TIMES BETWEEN EACH WORKER WHICH GIVES A VERY LONG ANSWER. CALLING THE findOverlappingIntervals()
// LOGS TO THE CONSOLE THE INDEX NUMBERS OF THE TWO WORKERS BEING COMPARED, FOLLOWED BY AN ARRAY OF ARRAYS WHERE INDEX 0 REPRESENTS
// THE START OF THE OVERLAPPING INTERVAL AND INDEX 1 REPRESENTS THE END OF THE OVERLAPPING INTERVAL. THIS STILL NEEDS A BIT OF CLEANING
// UP TO REMOVE THE DUPLICATE TIMES.


const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('input.txt')
    });
const moment = require('moment-timezone');


const workers = []

const createWorkersArray = (line) => {
    let worker = {}
    const id = line.substring(0, line.indexOf('@'));
    const times = line.substring(line.indexOf('@') + 1).replace('[', '').replace(']', '');

    // CREATES AN ARRAY OF TIMES ELEMENTS FOR EACH WORKER
    const timesArray = times.split(",");

    // CREATES A SEPARATE ARRAY FOR EACH INTERVAL INSIDE THE TIMESARRAY WITH THE START TIME AT INDEX 0 AND END TIME AT INDEX 1
    const mappedTimes = timesArray.map(time => time.split('/'));

    // CONVERTS ALL TIMES TO UTC
    const convertedTimes = mappedTimes.map((timeSlot) => {
        const conversion = timeSlot.map((time) => {
            const originalTime = moment(time);
            return originalTime.utc().format();
        });
        return conversion;
    });

    worker['id'] = id;
    worker['times'] = convertedTimes;
    workers.push(worker);
}

lineReader.on('line', function (line) {
    createWorkersArray(line);
});

const findEarliestIntervalStart = () => {

    // CREATES AN ARRAY OF ARRAYS FOR EACH WORKER'S INTERVAL START TIMES
    const startTimes = workers.map((worker) => {
        const startTimesForOneWorker = worker.times.map(time => time[0]);
        return startTimesForOneWorker;
    });

    // MERGES THE ABOVE INTO A SINGLE ARRAY
    const mergedStartTimes = startTimes.flat(1);

    // TURNS THE ARRAY ELEMENTS INTO MOMENT OBJECTS
    const moments = mergedStartTimes.map(time => moment(time));

    // FINDS THE EARLIEST DATE
    const earliestDate = moment.min(moments);

    // CONVERTS MOMENT OBJECT TO ISO 8601 STRING
    const formattedDate = earliestDate.format();

    return formattedDate;
}

const findLatestIntervalEnd = () => {

    // CREATES AN ARRAY OF ARRAYS FOR EACH WORKER'S INTERVAL END TIMES
    const endTimes = workers.map((worker) => {
        const endTimesForOneWorker = worker.times.map(time => time[1]);
        return endTimesForOneWorker;
    });

    // MERGES THE ABOVE INTO A SINGLE ARRAY
    const mergedEndTimes = endTimes.flat(1);

    // TURNS THE ARRAY ELEMENTS INTO MOMENT OBJECTS
    const moments = mergedEndTimes.map(time => moment(time));

    // FINDS THE LATEST DATE
    const latestDate = moment.max(moments);

    // CONVERTS MOMENT OBJECT TO ISO 8601 STRING
    const formattedDate = latestDate.format();

    return formattedDate;
}

const compareTimesBetweenWorkers = (workerOne, workerTwo) => {
    const overlaps = []

    for(let i = 0; i < workerOne.length; i++) {
        let workerOneIntervalStart = workerOne[i][0];
        let workerOneIntervalEnd = workerOne[i][1];

        for(let j = 0; j < workerTwo.length; j++) {
            let workerTwoIntervalStart = workerTwo[j][0];
            let workerTwoIntervalEnd = workerTwo[j][1];

            if (moment(workerOneIntervalStart).isBefore(moment(workerTwoIntervalEnd)) && moment(workerTwoIntervalStart).isBefore(moment(workerOneIntervalEnd))) {
                let overlap = []

                let earliestEnd = moment(workerOneIntervalEnd).isBefore(moment(workerTwoIntervalEnd)) ? workerOneIntervalEnd : workerTwoIntervalEnd;
                let latestStart = moment(workerOneIntervalStart).isAfter(moment(workerTwoIntervalStart)) ? workerOneIntervalStart : workerTwoIntervalStart;

                overlap.push(latestStart);
                overlap.push(earliestEnd);
                overlaps.push(overlap);
            }
        }
    }
    return overlaps;
}

const findOverlappingIntervals = () => {

    const workersTimes = workers.map(worker => worker.times);

    for (let i = 0; i < workersTimes.length; i++) {
        for(let j = i + 1; j < workersTimes.length; j++) {
            console.log(i, j);
            console.log(compareTimesBetweenWorkers(workersTimes[i], workersTimes[j]));
        }
    }

}


lineReader.on('close', function () {
    console.log("The starting date and time of the earliest interval:", findEarliestIntervalStart());
    console.log("The ending date and time of the latest interval:", findLatestIntervalEnd());
    console.log("Overlapping intervals:", findOverlappingIntervals());
});


