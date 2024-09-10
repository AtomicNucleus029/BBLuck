// ==UserScript==
// @name         BBLuck
// @namespace
// @version      0.65.0
// @description  Analyze your luck in Buzzerbeater match based on rating.
// @author       AtomicNucleus
// @match        https://www.buzzerbeater.com/match/*/boxscore.aspx
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.jsdelivr.net/npm/@tensorflow/tfjs
// @require      https://cdnjs.cloudflare.com/ajax/libs/mathjs/10.0.0/math.min.js
// @grant        GM_log
// @grant        GM_addElement
// @downloadURL
// @updateURL
// ==/UserScript==


// Fetch the model JSON file
const stateDict = {"layer1.weight": [[-0.32660847902297974, -0.4375276267528534, -0.15730500221252441, -1.0770357847213745, -0.6531774401664734, -0.2265261560678482, -0.7092909812927246, 1.2346020936965942, 0.633089005947113, 0.05455062910914421, 0.11133470386266708, -0.182840034365654, 0.06364503502845764], [0.05758826434612274, 0.6892653107643127, -0.7314329147338867, -0.6193954944610596, 0.14182761311531067, 0.22492365539073944, 0.2070811241865158, 0.3801146447658539, 0.28093138337135315, -0.4309510290622711, 0.11849908530712128, 0.43920737504959106, 0.10368623584508896], [0.4251411557197571, 0.17153526842594147, -1.035700798034668, -0.6403917074203491, -0.19993095099925995, 0.4541919231414795, 0.4889602065086365, -0.16654884815216064, 0.6081256866455078, 0.48830464482307434, -0.27954334020614624, -0.17174550890922546, 0.09290552884340286], [-0.1415594220161438, 0.09963564574718475, -0.7251352071762085, -0.41885051131248474, 0.2202107310295105, 0.04588368907570839, -0.2713199555873871, -0.30565977096557617, 0.3572571873664856, 0.4777541160583496, 0.168679341673851, -0.13882289826869965, 0.1994551122188568], [0.32268139719963074, 0.3584447503089905, 0.8784968852996826, -0.060833729803562164, -0.19162052869796753, 0.1788729727268219, -0.33753418922424316, 0.05526788532733917, -0.7113093137741089, -0.658858597278595, -0.07487829774618149, -0.3342064619064331, 0.027247263118624687], [0.4379487931728363, -0.5801963806152344, 0.3689752221107483, 0.4630475640296936, -0.41150417923927307, -0.1831182837486267, 0.5132646560668945, 0.3205634653568268, -0.433392196893692, 0.43384450674057007, 0.7682867646217346, 0.5413203239440918, -0.052556149661540985], [-0.3078991770744324, 0.35870733857154846, 0.2297484576702118, 0.14621368050575256, 0.1540985256433487, -0.26951754093170166, -0.0035947682335972786, -0.25898146629333496, -0.054217904806137085, -0.06703509390354156, -0.3069092929363251, 0.11216319352388382, -0.030805319547653198], [-1.037001609802246, -0.9121385216712952, 0.8311010003089905, -0.04907095432281494, -1.0755246877670288, -0.6628382802009583, -0.49481531977653503, 0.10358201712369919, -0.5682138800621033, -0.6966534852981567, 0.48763206601142883, -0.01146008912473917, -0.30198749899864197], [1.1200780868530273, 0.575785756111145, 0.8095910549163818, -0.19604042172431946, 0.2780446708202362, 0.7996124625205994, -0.6880574226379395, 0.8295472264289856, 0.12886233627796173, 0.3581121861934662, -0.06915310770273209, 0.09650328010320663, -0.12270195782184601], [0.1546730399131775, -0.07560858875513077, -0.7697427272796631, -0.5063818097114563, -0.1359511762857437, -0.19568780064582825, 0.06813732534646988, 0.4267655909061432, -0.021215608343482018, -0.16587892174720764, 0.010788263753056526, 0.4670727849006653, -0.3854489326477051], [-0.7025589942932129, 0.01426326110959053, -0.4362902343273163, 0.007303435821086168, -0.15131287276744843, -0.33180171251296997, -0.2492499202489853, -0.6760826706886292, 1.2193453311920166, 0.38113269209861755, -0.06346458941698074, -0.22871823608875275, 0.12306199967861176], [-0.2606697678565979, 0.12071798741817474, -0.2738529443740845, -0.48568153381347656, 0.23889866471290588, -0.08581642806529999, -1.1097522974014282, -0.9318073987960815, 0.4835975170135498, -0.29852473735809326, -1.130645990371704, -0.5634127855300903, 0.34427782893180847], [0.7784377932548523, -1.0915166139602661, -0.25101107358932495, -0.39191675186157227, 0.0520402193069458, 0.004033864475786686, 0.32880714535713196, 0.27297884225845337, -0.08327532559633255, 0.913745641708374, 0.6574830412864685, -0.1714000701904297, 0.02938900515437126], [0.35020050406455994, -0.5744654536247253, 0.09100846946239471, 0.20087830722332, -0.2889283299446106, -0.1321713626384735, 0.18499861657619476, -0.1929931938648224, 0.14756330847740173, 0.32202500104904175, 0.17399951815605164, 0.2729811668395996, -0.09414790570735931], [-0.46249160170555115, 0.9270426630973816, 0.45190587639808655, 0.23044204711914062, -0.44701868295669556, 0.03490634262561798, 0.8975166082382202, 0.5670653581619263, 0.1833081692457199, -0.1964944750070572, 0.3743499517440796, 0.6441781520843506, 0.06376636028289795], [0.2031153291463852, -0.4393046200275421, 0.19088420271873474, -0.07779581844806671, -0.3665301203727722, 0.11553162336349487, 0.16710545122623444, 0.3153487741947174, -0.6028122305870056, -0.09649642556905746, 0.5363436341285706, -0.12104126065969467, 0.48342615365982056], [0.13165771961212158, -0.272926926612854, 0.27398452162742615, 0.0635695829987526, -0.26439496874809265, -0.3566896319389343, -0.07743474841117859, -0.30258744955062866, 0.08754727989435196, 0.27960407733917236, 0.22565104067325592, 0.037559155374765396, -0.038575466722249985], [-0.9588617086410522, 0.462210476398468, -0.24205558001995087, 0.3133677840232849, -0.06314850598573685, 0.24797920882701874, 1.102067470550537, 0.5377164483070374, 0.893502414226532, 0.06394196301698685, 0.34937775135040283, 0.7012466788291931, 0.04288409277796745]], "layer1.bias": [0.025420863181352615, -0.22250230610370636, -0.3989154100418091, 0.6919376254081726, 0.16482611000537872, 0.01347467489540577, -0.14333650469779968, -0.42527851462364197, -0.9268341064453125, 0.11673274636268616, 0.6841371059417725, -0.4534776210784912, 0.12223740667104721, -0.20573753118515015, -0.38674643635749817, 0.047030456364154816, -0.2151092290878296, -0.9051512479782104], "layer2.weight": [[-0.24939827620983124, 0.14468948543071747, -0.0013851893600076437, 0.06822377443313599, -0.04033086821436882, 0.10929949581623077, -0.083229660987854, -0.266886442899704, 0.0428631529211998, 0.13253088295459747, -0.07303755730390549, 0.12097129970788956, 0.008576704189181328, 0.09585758298635483, 0.16191235184669495, 0.09854544699192047, 0.04595743864774704, 0.030040904879570007], [-0.5520064830780029, -0.5995842814445496, -0.7659180164337158, -0.25098416209220886, 0.8406540155410767, -0.4752417504787445, 0.29878154397010803, -0.8645286560058594, 0.7739260792732239, -0.8453043103218079, -0.22627399861812592, 1.1318166255950928, -0.6650509834289551, -0.21402963995933533, -0.6143531203269958, -0.07574146240949631, 0.12727303802967072, -0.6970868110656738], [0.656696081161499, -0.34871336817741394, 0.41964390873908997, 0.27193117141723633, -0.823492705821991, 0.6353653073310852, 0.24878709018230438, 1.3382196426391602, -0.955808699131012, -0.15238505601882935, 1.0102143287658691, -0.6976690888404846, 0.29734593629837036, 0.20092545449733734, 0.16900718212127686, -0.5707180500030518, 0.34045979380607605, 0.7561898827552795], [0.2691046893596649, -0.08992774784564972, 0.140963613986969, 0.2913725972175598, 0.285260945558548, 0.059817537665367126, -0.18788906931877136, -0.1989346444606781, -0.210112065076828, -0.19758610427379608, 0.09081081300973892, -0.00981021299958229, 0.43401655554771423, -0.09123649448156357, -0.18569505214691162, 0.04174502566456795, 0.06691265851259232, 0.032952118664979935], [0.38213226199150085, 0.7750800251960754, 0.3400861918926239, 0.4937806725502014, 0.14214903116226196, 0.236939936876297, 0.32714343070983887, 0.8742026090621948, -0.6147609949111938, 0.09311701357364655, 0.261018842458725, -0.6560721397399902, -0.04257994517683983, -0.6350486278533936, 0.506050169467926, -0.6436246037483215, -0.36591094732284546, 0.5438576936721802], [-0.30988994240760803, 0.26461273431777954, -0.15657822787761688, -0.2380879819393158, -0.02952837385237217, -0.31990793347358704, 0.1976393163204193, -0.10857367515563965, -0.17681507766246796, 0.006542276591062546, -0.07420358061790466, -0.08439291268587112, -0.7568748593330383, -0.296599417924881, -0.1613660603761673, -0.15461908280849457, -0.35079777240753174, -0.11589464545249939], [0.27494803071022034, -0.14994151890277863, 0.05245625972747803, 0.0007263512234203517, -0.17442338168621063, 0.3683938682079315, -0.06571543961763382, 0.49955323338508606, -0.25586333870887756, 0.16271920502185822, 0.10288455337285995, -0.28510981798171997, 0.2474043071269989, 0.2810221016407013, 0.3157392740249634, 0.19425664842128754, -0.07900402694940567, -0.11504468321800232], [-0.4604164659976959, -0.05685090273618698, -0.3999175429344177, -0.1618882417678833, -0.45117896795272827, -0.3164677619934082, 0.323757529258728, -0.8535623550415039, 0.13141144812107086, -0.07995156198740005, -0.16679233312606812, 0.27103567123413086, -0.4655230641365051, 0.014064062386751175, -0.31064051389694214, 0.0883946418762207, 0.11288733780384064, -0.08266199380159378]], "layer2.bias": [0.2195986658334732, -0.29949814081192017, -0.5241256952285767, -0.08289184421300888, 0.204692542552948, 0.21771813929080963, -0.07000186294317245, 0.14940914511680603], "layer3.weight": [[0.1325407326221466, 1.1113436222076416, -1.6631842851638794, -0.5332601070404053, -1.567348599433899, 0.9065073132514954, -0.7566218972206116, 1.4239675998687744]], "layer3.bias": [0.03273739665746689]}

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
    const max = 7;
    const clampedValue = Math.max(min, Math.min(max, value)); // Clamp the value between min and max
    const level = Math.round((clampedValue / max) * 19) + 1; // Map to a level between 1 and 20
    return `lev${level}`;
}