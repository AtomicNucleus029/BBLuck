// ==UserScript==
// @name         BBLuck
// @namespace
// @version      0.65.1
// @description  Analyze your luck in Buzzerbeater match based on rating.
// @author       AtomicNucleus
// @include      https://*buzzerbeater.com/match/*/boxscore.aspx
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.jsdelivr.net/npm/@tensorflow/tfjs
// @require      https://cdnjs.cloudflare.com/ajax/libs/mathjs/10.0.0/math.min.js
// @grant        GM_log
// @grant        GM_addElement
// @downloadURL
// @updateURL
// ==/UserScript==


// Fetch the model JSON file
const stateDict = {"layer1.weight": [[-0.38745999336242676, -0.46555283665657043, 0.0013519568601623178, 0.03597858548164368, -0.4113752543926239, -0.4795684218406677, -0.1266101449728012, -0.3013429343700409, 0.0731874480843544, -0.10654290020465851, -0.3183690011501312, -0.19503392279148102, 0.37313413619995117], [-1.5727686882019043, 1.102221131324768, 0.760109007358551, 0.8648840188980103, -0.8062841296195984, 0.07775089144706726, 0.7065920233726501, 0.19878427684307098, 1.3980019092559814, -0.3360968232154846, 0.6018417477607727, 0.6743273138999939, 0.06550412625074387], [0.60916668176651, -0.16992968320846558, 0.7066956758499146, 0.2386203110218048, -0.6859151124954224, 0.23321042954921722, 0.8752802610397339, 0.2237301766872406, -1.591994047164917, -0.23449379205703735, 0.40910667181015015, 0.028484603390097618, 0.4717363119125366], [-0.6313382387161255, -0.7119630575180054, 2.3797061443328857, 0.3881742060184479, -0.3614548444747925, -0.06109921634197235, -1.9931975603103638, 0.45709335803985596, -0.6560589671134949, 0.3820226192474365, 0.07670968770980835, -0.47849154472351074, 0.08213196694850922], [-0.5316089987754822, 0.4240959882736206, -0.099900022149086, -0.2839962840080261, 0.35470789670944214, 0.14123785495758057, 0.1542644202709198, -0.049554888159036636, 0.1419844925403595, 0.10858218371868134, -0.0580674409866333, -0.050699301064014435, 0.15629200637340546], [0.03491268306970596, -0.00031313442741520703, 0.2187647521495819, -1.8870221376419067, -1.171525239944458, 0.24145352840423584, -0.9845598340034485, 2.208620309829712, 0.061019763350486755, -0.2488366663455963, 0.10448867827653885, 0.5949558615684509, -0.07176673412322998], [-1.2243503332138062, 1.6373941898345947, 0.12866394221782684, -0.11593553423881531, 0.06834114342927933, 0.2746178209781647, 0.19124868512153625, 0.05160220339894295, 0.006185396108776331, -1.6912258863449097, -1.1106337308883667, 0.3520629107952118, -0.053043607622385025], [0.04404696077108383, -0.6387535333633423, -0.10596375912427902, 0.02600596472620964, -0.6392226815223694, -0.09587184339761734, 0.9762672185897827, 1.0159205198287964, -0.18006861209869385, 0.846727728843689, 1.0857234001159668, 0.7526094913482666, 0.04065575450658798], [-0.4804661273956299, -0.3481820523738861, 0.12866108119487762, -0.28037190437316895, -0.5597225427627563, 0.06459546834230423, -0.46272844076156616, 0.14455673098564148, 0.2634850740432739, 0.3550500273704529, -0.09627074748277664, -0.2143394947052002, 0.014517470262944698], [1.776889681816101, 0.8406791090965271, 0.6463903188705444, -0.05614978075027466, 0.41411590576171875, 1.0247955322265625, -0.768774688243866, 0.418306827545166, 0.2770627737045288, 0.6365426182746887, -0.08550522476434708, 0.32818421721458435, -0.16083839535713196], [-0.6646016240119934, -0.31987276673316956, -0.2594852149486542, -0.4647018015384674, -0.3457278311252594, -0.6027626991271973, 0.31905126571655273, 0.12343308329582214, 0.48112475872039795, 0.26587072014808655, 0.3641524016857147, -0.07001568377017975, 0.1704103946685791], [0.719704806804657, 0.14054636657238007, 0.511962890625, -0.07371475547552109, 0.04633199796080589, 0.12989549338817596, -0.08278291672468185, 0.4074144959449768, -0.24326717853546143, -0.11782107502222061, -0.007114249747246504, 0.21199393272399902, -0.3873555660247803], [-0.5370602607727051, -0.5684204697608948, 0.06729982048273087, 0.004271883517503738, 0.17790235579013824, -0.0815030038356781, 0.45530131459236145, 0.07141286134719849, 0.8957731127738953, 0.8945559859275818, -0.17386053502559662, -0.06781353801488876, 0.2303573191165924], [0.454004168510437, 0.3480560779571533, 0.003440432483330369, -0.05146282911300659, 0.4915338456630707, 0.24006204307079315, 0.33529359102249146, 0.5828188061714172, -0.5895447731018066, -0.7343356609344482, 0.1882692128419876, 0.06852583587169647, 0.33437448740005493], [0.1645773947238922, -0.27783888578414917, -0.06805378198623657, -0.3122219443321228, 0.504871129989624, -0.08608416467905045, 0.5649649500846863, 0.38555970788002014, -0.3300505578517914, -0.05578332394361496, -0.3636457920074463, 0.428005576133728, -0.08232604712247849], [1.0037859678268433, 1.1094402074813843, -0.10326021909713745, 0.7127721905708313, 1.627248764038086, 1.1395834684371948, 0.6310093402862549, 0.31213292479515076, 0.7692000865936279, 1.269887924194336, -0.3900330662727356, -0.21915870904922485, 0.46734610199928284], [-0.27898338437080383, -0.2578229606151581, -0.011868739500641823, 0.48521825671195984, 0.3170011341571808, -0.4056832492351532, -0.27321240305900574, -0.15279319882392883, 0.599994957447052, -0.0011518816463649273, -0.521892249584198, 0.137993723154068, -0.07221157103776932], [-0.23680202662944794, 0.5434647798538208, -0.5196734070777893, -0.41366738080978394, -0.25126102566719055, 0.1857258379459381, -0.05520327016711235, -0.24447254836559296, 0.24316956102848053, 0.15741242468357086, 0.30567094683647156, 0.044461023062467575, 0.21275123953819275]], "layer1.bias": [-0.40119946002960205, -0.4524816870689392, -0.5238019824028015, 0.6579152941703796, 0.033980462700128555, -0.21602696180343628, -0.20811179280281067, 0.17084643244743347, 0.0034364701714366674, -1.1817443370819092, 0.13375429809093475, -1.0595135688781738, -0.6762983202934265, 0.2834806740283966, -0.0240690466016531, 0.3637680113315582, 0.05809270218014717, 0.23975351452827454], "layer2.weight": [[0.23420801758766174, 0.4561541974544525, 0.6176213622093201, -0.7095885276794434, -0.16989180445671082, 0.20487530529499054, -0.24160410463809967, 0.3635084927082062, -0.02691607177257538, -0.03718028590083122, 0.22671952843666077, 0.10073886811733246, 0.2816901206970215, 0.008426249027252197, -0.45515111088752747, -0.432530015707016, -0.457606703042984, 0.42057111859321594], [-0.2248385101556778, -0.760528564453125, 0.7171695828437805, 0.5503348708152771, -0.10508672147989273, -0.6271584630012512, 0.8730478882789612, -0.9660471081733704, -0.45112836360931396, 0.7584185600280762, -0.995708167552948, 0.3228241503238678, -0.7276932001113892, 0.46402114629745483, -0.0761478990316391, 1.362092137336731, -0.29678523540496826, -0.17271015048027039], [-0.03411279618740082, -0.35972481966018677, -0.08470091968774796, 0.044822774827480316, -0.31584402918815613, 0.05098589137196541, -1.553015947341919, 0.5795241594314575, 0.19553439319133759, -0.20219816267490387, -0.08704433590173721, -0.10354200750589371, 0.34220707416534424, -0.5203937292098999, 0.12001115828752518, -0.8315473794937134, 0.14137952029705048, -0.39458784461021423], [-0.31815898418426514, -0.3340974748134613, 0.1913718730211258, -0.3737551271915436, 0.18599843978881836, 0.8761276602745056, -0.4218187928199768, 0.4849170744419098, 0.08451370149850845, 0.09304188936948776, -0.08092021942138672, -0.23604001104831696, -0.11361692100763321, 0.1494034379720688, 0.350609689950943, -0.9278140664100647, -0.43627360463142395, -0.07208124548196793], [-0.6677712798118591, 0.17051972448825836, -0.08955579251050949, -1.6942893266677856, 0.337542861700058, 1.0322439670562744, 0.1537698209285736, 1.6279767751693726, -0.42114830017089844, -0.6552606821060181, -0.14767837524414062, -0.08856147527694702, 0.6853889226913452, 0.49806103110313416, 0.5304381847381592, -1.1456125974655151, 0.037210870534181595, 0.26397475600242615], [-0.021096430718898773, 0.7602636814117432, -0.9266465306282043, 0.007478066720068455, 0.14131073653697968, 0.19503998756408691, 0.35887694358825684, 0.025322841480374336, 0.6269238591194153, -0.5339071750640869, 0.11477585881948471, -0.652203381061554, 0.14050164818763733, -0.08604566007852554, -0.7752955555915833, 0.0577738992869854, 0.07369548827409744, 0.536270797252655], [0.21280041337013245, -0.44234389066696167, 0.16672834753990173, 0.2940131425857544, -0.23396925628185272, 0.10239686071872711, 0.11185647547245026, -0.06874565035104752, 0.1247086152434349, 0.006964489817619324, -0.2232014536857605, 0.4074091911315918, 0.33046457171440125, 0.09106580913066864, 0.31367817521095276, -0.04364883154630661, 0.30265358090400696, -0.5219905972480774], [-0.456342875957489, -1.6930772066116333, 1.0065579414367676, -0.09746860712766647, -0.27411651611328125, 0.30312711000442505, 0.262411504983902, -0.6235504150390625, -0.03430920094251633, 1.0770851373672485, -0.14056327939033508, 0.44695815443992615, -0.6130223274230957, 0.711706817150116, 0.26316413283348083, 0.9655956625938416, -0.8264676928520203, 0.07553340494632721]], "layer2.bias": [-0.2720412015914917, 0.15069808065891266, 0.12354128062725067, 0.5420092940330505, 0.7773608565330505, 0.31934162974357605, 0.11593591421842575, 0.2651077210903168], "layer3.weight": [[-1.2677841186523438, 0.6979336142539978, -1.007533073425293, -1.083421230316162, -1.3139797449111938, -1.0900449752807617, 0.6948622465133667, 0.934320330619812]], "layer3.bias": [0.02468138188123703]}
// Convert JSON back to tensors
const tensors = {};
for (const key in stateDict) {
    tensors[key] = tf.tensor(stateDict[key]);
}

// Example: Use the tensors in your model
const model = reconstructModel(tensors);

// Prepare input data

// Access the div with the specified ID
const containerDiv = document.getElementById('cphContent_pnlBoxScore');

// Get match points and team name

// Ensure the div exists
let firstNumber;
let secondNumber;
let awayTeam;
let homeTeam;

if (containerDiv) {
    // Access the first table within the div
    const firstTable = containerDiv.querySelector('table');

    // Ensure the table exists
    if (firstTable) {
        // Access the first tbody within the table
        const tbody = firstTable.querySelector('tbody');

        // Ensure the tbody exists
        if (tbody) {
            // Access the second tr within the tbody
            const secondTr = tbody.querySelectorAll('tr')[1];
            // Ensure the second tr exists
            if (secondTr) {
                const teamCell = secondTr.querySelector('td');

                if (teamCell) {
                    // Get the away team name from the anchor tag
                    awayTeam = teamCell.querySelector('a').textContent;

                    // Access the final td within the second tr
                    const firstNumberTd = secondTr.querySelector('td:last-child');
                    // Ensure the td exists and get its content
                    firstNumber = firstNumberTd ? firstNumberTd.textContent : null;
                    console.log('First number:', firstNumber);
                } else {
                    console.log('Team cell not found in the second tr.');
                }
            } else {
                console.log('Second tr not found.');
            }

            // Access the third tr within the tbody
            const thirdTr = tbody.querySelectorAll('tr')[2];
            // Ensure the third tr exists
            if (thirdTr) {
                const teamCell = thirdTr.querySelector('td');

                if (teamCell) {
                    // Get the away team name from the anchor tag
                    homeTeam = teamCell.querySelector('a').textContent;

                    // Access the final td within the third tr
                    const secondNumberTd = thirdTr.querySelector('td:last-child');
                    // Ensure the td exists and get its content
                    secondNumber = secondNumberTd ? secondNumberTd.textContent : null;
                    console.log('Second number:', secondNumber);
                } else {
                    console.log('Team cell not found in the third tr.');
                }
            } else {
                console.log('Third tr not found.');
            }
        } else {
            console.log('No tbody found in the first table.');
        }
    } else {
        console.log('No table found in the div.');
    }
} else {
    console.log('No div found with the ID #cphContent_pnlBoxScore.');
}

console.log(awayTeam)

const formattedReal = (firstNumber -secondNumber)
console.log(firstNumber);


// Initialize an array to store the results
const results = [];

// Ensure the div exists
if (containerDiv) {
    // Access all tables within the div
    const tables = containerDiv.querySelectorAll('table');

    // Ensure there are at least two tables
    if (tables.length >= 2) {
        // Access the second table
        const secondTable = tables[1];

        // Access the tbody within the second table
        const tbody = secondTable.querySelector('tbody');

        // Ensure the tbody exists
        if (tbody) {
            // Access the rows within the tbody
            const rows = tbody.querySelectorAll('tr');
            if (rows.length >= 15) {

                // Loop through the rows from the 10th to the 15th
                for (let i = 9; i < 15; i++) { // Index 9 to 14 for 10th to 15th rows
                    const row = rows[i];
                    const tds = row.querySelectorAll('td');

                    // Extract text from the first and third td elements
                    const firstTdText = tds[0].querySelector('a').innerText.trim();
                    const thirdTdText = tds[2].querySelector('a').innerText.trim();

                    // Function to convert the text
                    const convertText = (text) => {
                        const parts = text.match(/.*\((\d+)\)\s*\(([^)]+)\)/);
                        if (!parts) {
                            console.error('Text format is incorrect:', text);
                            return null;
                        }
                        const number = parseInt(parts[1], 10);
                        const chineseChar = parts[2];

                        let C;
                        if (chineseChar === '低') {
                            C = 0;
                        } else if (chineseChar === '中') {
                            C = 1;
                        } else if (chineseChar === '高') {
                            C = 2;
                        }

                        return (number * 3 + C) / 60;
                    };

                    // Convert the texts and add to the results array
                    const firstResult = convertText(firstTdText);
                    const thirdResult = convertText(thirdTdText);

                    if (firstResult !== null) results.push(firstResult);
                    if (thirdResult !== null) results.push(thirdResult);
                }

                // Log the results array
                console.log('Results:', results);
            } else {
                console.log('Less than 15 rows found in the tbody.');
            }
        } else {
            console.log('No tbody found in the second table.');
        }
    } else {
        console.log('Less than 2 tables found in the div.');
    }
} else {
    console.log('No div found with the ID #cphContent_pnlBoxScore.');
}

// Get effortDelta

// Get the span element by its id
const spanElement = document.getElementById('cphContent_lblEffort');
let effortDelta;

if (spanElement) {
    // Extract the text inside the span
    const textContent = spanElement.textContent;

    // Function to produce a number based on different cases
    function produceNumber(text) {
        // Case 1: Check if the text matches the pattern "在此场球赛中，全场的进攻重点好像都是来自 X。"
        const match = text.match(/在此场球赛中，全场的进攻重点好像都是来自 (.+?)。/);
        if (match) {
            const team = match[1];
            // Assuming homeTeam and awayTeam are defined elsewhere in your code
            if (team === homeTeam) {
                return 2; // Home team
            } else if (team === awayTeam) {
                return -2; // Away team
            } else {
                return 0; // Team not matched
            }
        }
        // Case 2: Check if the text contains "在球场上比"
        else if (text.includes('在球场上比')) {
            // Extract the teams from the text
            const teams = text.match(/在此场球赛中，(.+?) 在球场上比 (.+?) 更努力。/);
            if (teams) {
                // Check if the home team is in the front
                if (teams[1] == homeTeam ) {
                    return 1; // Home team
                } else {
                    return -1; // Away team
                }
            }
        }
        // Case 3: Other cases
        return 0;
    }

    // Get the number based on the text content
    effortDelta = produceNumber(textContent);

    // Output the result
    console.log(effortDelta);
} else {
    effortDelta = 0;
    console.log('Element with id "cphContent_lblEffort" not found.');
}



// Initialize the two new arrays
const oddFirstArray = [];
const evenFirstArray = [];

// Loop through the results array and distribute elements
for (let i = 0; i < results.length; i++) {
    if (i % 2 === 0) {
        evenFirstArray.push(results[i]);
    } else {
        oddFirstArray.push(results[i]);
    }
}

// Rearrange the arrays as per your requirement
const rearrangedOddFirstArray = [...evenFirstArray, ...oddFirstArray];
const rearrangedEvenFirstArray = [...oddFirstArray, ...evenFirstArray];

rearrangedOddFirstArray.push(effortDelta);
rearrangedEvenFirstArray.push(-effortDelta);

// Log the results
console.log('Odd First Array:', rearrangedOddFirstArray);
console.log('Even First Array:', rearrangedEvenFirstArray);

const input_1 = tf.tensor([rearrangedOddFirstArray]);
const input_2 = tf.tensor([rearrangedEvenFirstArray]);

// Run the model for prediction
const output_1 = model.predict(input_1);
const output_2 = model.predict(input_2);

 // Access the prediction values
const prediction_1 = output_1.dataSync(); // or use output.array() for a promise-based approach
const prediction_2 = output_2.dataSync(); // or use output.array() for a promise-based approach
const prediction = (prediction_1 - prediction_2) * 10;

// Format the prediction value to two decimal places
const formattedPrediction = prediction.toFixed(1);


// Process the prediction
console.log(formattedPrediction);

// Determine the text based on the formatted prediction value
const firstTdText = prediction > 0 ? `胜 ${formattedPrediction} 分` : `负 ${(-prediction).toFixed(1)} 分`;
const thirdTdText = prediction > 0 ? `负 ${formattedPrediction} 分` : `胜 ${(-prediction).toFixed(1)} 分`;
const firstTdText_real = formattedReal > 0 ? `胜 ${formattedReal} 分` : `负 ${(-formattedReal)} 分`;
const thirdTdText_real = formattedReal > 0 ? `负 ${formattedReal} 分` : `胜 ${(-formattedReal)} 分`;


// Function to compute gradients
const computeGradients = (model, inputs) => {
    return tf.tidy(() => {
        const f = x => model.predict(x);
        const gradFunc = tf.grad(f);
        const gradients = gradFunc(inputs);
        return gradients;
    });
};

const gradients_1 = computeGradients(model, input_1).dataSync();
const gradients_2 = computeGradients(model, input_2).dataSync();

// Create the first new array
const array1 = [];
for (let i = 0; i < 6; i++) {
    array1.push((gradients_1[i] - gradients_2[gradients_2.length - 6 + i]) / 2);
}

// Create the second new array
const array2 = [];
for (let i = 0; i < 6; i++) {
    array2.push((gradients_2[i] - gradients_1[gradients_1.length - 6 + i]) / 2);
}

// Create the final gradient for effort
const array3 = [];
array3.push((gradients_2[12] + gradients_1[12])/2 * -20);


// Log the results
console.log('Array 1:', array1);
console.log('Array 2:', array2);
console.log('Array 3:', array3);

// Calculate the probability for the third row
const mean = prediction;
const variance = 169;
const stdDev = Math.sqrt(variance);
const zScore = -mean / stdDev;
const cumulativeProbability = 0.5 * (1 + math.erf(zScore / Math.sqrt(2)));
const probabilityXGreaterThanZero = (1 - cumulativeProbability) * 100;
const probabilityXLessThanZero = cumulativeProbability * 100;

// Format the probabilities to two decimal places
const formattedProbabilityXGreaterThanZero = probabilityXGreaterThanZero.toFixed(1);
const formattedProbabilityXLessThanZero = probabilityXLessThanZero.toFixed(1);

console.log('Probability x > 0:', formattedProbabilityXGreaterThanZero + '%');
console.log('Probability x < 0:', formattedProbabilityXLessThanZero + '%');

// Inject to HTML

// Ensure the div exists
if (containerDiv) {
    // Access all tables within the div
    const tables = containerDiv.querySelectorAll('table');

    // Ensure there are at least two tables
    if (tables.length >= 2) {
        // Access the second table
        const secondTable = tables[1];

        // Access the tbody within the second table
        const tbody = secondTable.querySelector('tbody');

        // Ensure the tbody exists
        if (tbody) {
            // Access the rows within the tbody
            const rows = tbody.querySelectorAll('tr');

            // Loop through rows 10 to 15 (index 9 to 14)
            for (let i = 9; i <= 14; i++) {
                // Ensure the row exists
                if (rows[i]) {
                    // Access the middle td (assuming it's the second td)
                    const middleTd = rows[i].querySelectorAll('td')[1];

                    // Ensure the middle td exists
                    if (middleTd) {
                        // Add numbers from array1 and array2 with two decimal places
                        const array1Value = array1[i - 9].toFixed(1); // Adjust index for array1
                        const array2Value = array2[i - 9].toFixed(1); // Adjust index for array2
                        const array1Class = getClass(array1[i - 9]);
                        const array2Class = getClass(array2[i - 9]);

                        // Update the innerHTML with the new values and classes
                        middleTd.innerHTML = `<span class="${array1Class}">${array1Value}</span> ${middleTd.innerHTML} <span class="${array2Class}">${array2Value}</span>`;
                    } else {
                        console.log(`Middle td not found in row ${i + 1}.`);
                    }
                } else {
                    console.log(`Row ${i + 1} not found.`);
                }
            }


            if (rows.length >= 16) {
                // Access the 16th row (index 15)
                const sixteenthRow = rows[15];

                // Create a new row with the specified content
                const newRow1 = document.createElement('tr');
                newRow1.innerHTML = `
                    <td colspan="2" style="text-align: right;">
                        <b>${firstTdText_real}</b>
                    </td>
                    <td style="text-align: center; font-weight: bold; padding-left: 20px; padding-right: 20px;">
                        <b>- 赛果 -</b>
                    </td>
                    <td colspan="2">
                        <b>${thirdTdText_real}</b>
                    </td>
                `;

                // Insert the new row after the 16th row
                sixteenthRow.parentNode.insertBefore(newRow1, sixteenthRow.nextSibling);

                const seventeenthRow = newRow1;

                // Create a new row with the specified content
                const newRow2 = document.createElement('tr');
                newRow2.innerHTML = `
                    <td colspan="2" style="text-align: right;">
                        <b>${firstTdText}</b>
                    </td>
                    <td style="text-align: center; font-weight: bold; padding-left: 20px; padding-right: 20px;">
                        <b>- BBLuck预测 -</b>
                    </td>
                    <td colspan="2">
                        <b>${thirdTdText}</b>
                    </td>
                `;

                // Insert the new row after the 17th row
                seventeenthRow.parentNode.insertBefore(newRow2, seventeenthRow.nextSibling);

                // Access the newly added 18th row
                const eighteenthRow = newRow2;

                // Create the third new row with the specified content
                const newRow3 = document.createElement('tr');
                newRow3.innerHTML = `
                    <td colspan="2" style="text-align: right;">
                        <b>${formattedProbabilityXGreaterThanZero}%</b>
                    </td>
                    <td style="text-align: center; font-weight: bold; padding-left: 20px; padding-right: 20px;">
                        <b>- 胜率预测 -</b>
                    </td>
                    <td colspan="2">
                        <b>${formattedProbabilityXLessThanZero}%</b>
                    </td>
                `;

                // Insert the third new row after the newly added 18th row
                eighteenthRow.parentNode.insertBefore(newRow3, eighteenthRow.nextSibling);

                // Access the newly added 19th row
                const nineteeenthRow = newRow3;

                // Create the third new row with the specified content
                const newRow4 = document.createElement('tr');
                newRow4.innerHTML = `
                    <td colspan="2" style="text-align: right;">
                        <b></b>
                    </td>
                    <td style="text-align: center; padding-left: 20px; padding-right: 20px;">
                        上方数字为每提升<br>一整级期望多赢几分<br>数据仅供参考
                    </td>
                    <td colspan="2">
                        <b></b>
                    </td>
                `;

                // Insert the third new row after the newly added 18th row
                eighteenthRow.parentNode.insertBefore(newRow4, nineteeenthRow.nextSibling);



                console.log('New row added below the 16th row.');
            } else {
                console.log('Less than 16 rows found in the tbody.');
            }
        } else {
            console.log('No tbody found in the second table.');
        }
    } else {
        console.log('Less than 2 tables found in the div.');
    }
} else {
    console.log('No div found with the ID #cphContent_pnlBoxScore.');
}

// Assuming spanElement is already defined
if (spanElement) {
    // Create a new line element
    const newLine = document.createElement('div');

    // Ensure array3 is formatted to one decimal place
    const oneDecimalPlace = array3[0].toFixed(1);

    // Set the inner HTML with the bold text
    newLine.innerHTML = `<strong>每级努力度预计多赢 ${oneDecimalPlace} 分</strong>`;

    // Append the new line to the span element
    spanElement.appendChild(newLine);
} else {
    console.log('Element with id "cphContent_lblEffort" not found.');
}




// Function to reconstruct the model (example)
function reconstructModel(tensors) {
    // Define your model architecture here
    // For example, using TensorFlow.js layers API
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 18, inputShape: [13], activation: 'tanh'}));
    model.add(tf.layers.dense({units: 8, activation: 'tanh'}));
    model.add(tf.layers.dense({units: 1}));
    // Set the weights from the tensors
    const weights = [
        tensors['layer1.weight'].transpose(), tensors['layer1.bias'],
        tensors['layer2.weight'].transpose(), tensors['layer2.bias'],
        tensors['layer3.weight'].transpose(), tensors['layer3.bias']
    ];
    model.setWeights(weights);
    return model;
}

// Function to map a value to a class
function getClass(value) {
    // Define your class scale here
    const min = 0;
    const max = 6;
    const clampedValue = Math.max(min, Math.min(max, value)); // Clamp the value between min and max
    const level = Math.round((clampedValue / max) * 19) + 1; // Map to a level between 1 and 20
    return `lev${level}`;
}