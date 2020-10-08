// HELENA KOLBERG - JAVASCRIPT CHALLENGE


// QUESTION 1: What is the starting date and time (in UTC) of the earliest interval where any of the workers are free?

// ANSWER: 2020-01-01T00:15:00+00:00


// QUESTION 2: What is the ending date and time (in UTC) of the latest interval where any of the workers are free?

// ANSWER: 2020-01-01T19:15:00+00:00


// QUESTION 3: What are the intervals of date and times (in UTC) where there are at least 2 workers free?

// ANSWER: IT'S A VERY LONG ARRAY! CALL findOverlappingIntervals() FOR MY ANSWER. IT RETURNS AN ARRAY OF ARRAYS WHERE THE START TIME IS AT
// INDEX 0 AND THE END TIME AT INDEX 1. I LOOPED THROUGH THE INTERVALS OF THE FIRST WORKER AND CHECKED THEM AGAINST ALL THE INTERVALS FOR 
// THE OTHER 19 WORKERS. TO GET ALL OVERLAPPING INTERVALS, I WOULD CONTINUE LOOPING: CHECK THE SECOND WORKER'S INTERVALS AGAINST THE OTHER 
// 18'S, THEN THE THIRD WORKER'S INTERVALS AGAINST THE OTHER 17'S ETC. THIS IS A BIT BULKY SO I WOULD RESEARCH WAYS TO MAKE THIS SLICKER -
// MAYBE SOMETHING LIKE THE BIG-O NOTATION.


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

const findOverlappingIntervals = () => {
    // CREATES AN ARRAY OF WORKERS' INTERVAL ARRAYS
    const workersTimes = workers.map(worker => worker.times);
    let overlaps = [];

    // LOOPS THROUGH THE FIRST WORKER'S INTERVAL ARRAYS
    for (const timeInterval of workersTimes[0]) {
        let currentStartTime = timeInterval[0];
        let currentEndTime = timeInterval[1];

        // LOOPS THROUGH ALL WORKERS
        for (const worker of workersTimes) {
            if (workersTimes.indexOf(worker) > 0) {

                // LOOPS THROUGH THE INTERVAL ARRAYS OF A WORKER
                for (const timeInterval of worker) {
                    let nextStartTime = timeInterval[0];
                    let nextEndTime = timeInterval[1];

                    if (moment(currentEndTime).isAfter(moment(nextStartTime)) && moment(currentStartTime).isBefore(moment(nextEndTime))) {
                         let overlap = [];

                        if (moment(currentStartTime).isBefore(moment(nextStartTime))) {
                            overlap.push(nextStartTime);
                            overlap.push(currentEndTime);
                            overlaps.push(overlap);
                        } else {
                            overlap.push(currentStartTime);
                            overlap.push(nextEndTime);
                            overlaps.push(overlap);
                        }
                    }
                }
            }
        }
    }
    return overlaps;
}


lineReader.on('close', function () {
    console.log("The starting date and time of the earliest interval:", findEarliestIntervalStart());
    console.log("The ending date and time of the latest interval:", findLatestIntervalEnd());
    console.log("Overlapping intervals:", findOverlappingIntervals());
});


