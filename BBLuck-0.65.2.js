// ==UserScript==
// @name         BBLuck
// @namespace
// @version      0.65.2
// @description  Analyze your luck in Buzzerbeater match based on rating.
// @author       AtomicNucleus
// @include      https://*buzzerbeater.*/match/*/boxscore.aspx
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.jsdelivr.net/npm/@tensorflow/tfjs
// @require      https://cdnjs.cloudflare.com/ajax/libs/mathjs/10.0.0/math.min.js
// @grant        GM_log
// @grant        GM_addElement
// @downloadURL
// @updateURL
// ==/UserScript==


// Fetch the model JSON file
const stateDict = {"layer1.weight": [[0.027114443480968475, -0.13386894762516022, -0.6350972056388855, -0.359544038772583, 0.009551712311804295, -0.01641157455742359, -0.026096530258655548, 0.14843185245990753, 0.6228144764900208, 0.3556627631187439, -0.002663855440914631, 0.018089821562170982, -0.39237213134765625], [0.011997989378869534, 0.010869591496884823, -0.3715325593948364, -0.22551779448986053, -0.03936728462576866, 0.04476134851574898, -0.010031589306890965, -0.010711983777582645, 0.3771802484989166, 0.2329188734292984, 0.04046532139182091, -0.04394318908452988, 0.08938317000865936], [-0.020321838557720184, -0.021611176431179047, 0.4960276782512665, 0.29051706194877625, 0.04499991238117218, -0.060994088649749756, 0.018548322841525078, 0.024656008929014206, -0.477751761674881, -0.2831067144870758, -0.04350912943482399, 0.06218447536230087, -0.07986512780189514], [0.00032750677200965583, -0.002123106736689806, -0.12389352917671204, -0.0792456641793251, -0.01666337437927723, 0.01126696914434433, 0.0003546548541635275, 0.0015952539397403598, 0.12383746355772018, 0.08059758692979813, 0.01711341179907322, -0.011285888031125069, 0.06523118913173676], [0.003457307117059827, 0.0001094292601919733, -0.23143310844898224, -0.145615354180336, -0.02867373451590538, 0.023681629449129105, -0.002631514798849821, -0.0010202170815318823, 0.2314191311597824, 0.14794397354125977, 0.028876997530460358, -0.02388113923370838, 0.0878567174077034], [-0.005261988844722509, -0.0019560984801501036, 0.2668553590774536, 0.1668907254934311, 0.032045878469944, -0.028382908552885056, 0.004388808738440275, 0.0026919248048216105, -0.26723355054855347, -0.1697097271680832, -0.03231206163764, 0.028482243418693542, -0.09036553651094437], [-0.013381607830524445, -0.011652889661490917, 0.38906651735305786, 0.23531469702720642, 0.04075147584080696, -0.04679066315293312, 0.011493081226944923, 0.012804687954485416, -0.39053529500961304, -0.24000489711761475, -0.041212428361177444, 0.04670361056923866, -0.08843124657869339], [-0.00035509178997017443, 0.0019206765573471785, 0.1302906572818756, 0.08332113921642303, 0.01750854402780533, -0.011954842135310173, -0.00018841530254576355, -0.0016403336776420474, -0.1303534209728241, -0.08454491198062897, -0.017652083188295364, 0.011906436644494534, -0.06742019951343536], [-0.0038771936669945717, -0.0004649427719414234, 0.24001343548297882, 0.15070782601833344, 0.029550794512033463, -0.024778911843895912, 0.0028548571281135082, 0.001483545289374888, -0.2400517463684082, -0.1533462554216385, -0.029790576547384262, 0.024944502860307693, -0.08863060176372528], [-0.014658492058515549, -0.01354009285569191, 0.4126337766647339, 0.24795272946357727, 0.04217366874217987, -0.05001261085271835, 0.013357982039451599, 0.015340297482907772, -0.4110313057899475, -0.2506069242954254, -0.04185916483402252, 0.0505279004573822, -0.08686976134777069], [-0.5528025031089783, 0.6651541590690613, -0.17120717465877533, 0.09192463010549545, -0.1056087464094162, 0.14813075959682465, 0.9341105222702026, 0.5809180736541748, 0.5873106122016907, 0.06495256721973419, 0.3430125117301941, 0.5920965075492859, 0.17121614515781403], [0.011756676249206066, 0.009936723858118057, -0.3668869733810425, -0.2232707440853119, -0.03930928185582161, 0.043591808527708054, -0.010148555040359497, -0.010502212680876255, 0.37033337354660034, 0.22914718091487885, 0.04005445912480354, -0.043437615036964417, 0.08967184275388718], [-0.946061909198761, -0.5864781737327576, -0.582173764705658, -0.05261395499110222, -0.34490475058555603, -0.6068217754364014, 0.5618377923965454, -0.672418475151062, 0.16345714032649994, -0.09543577581644058, 0.12319065630435944, -0.14408721029758453, 0.1738949418067932], [-0.9705052971839905, -0.9434768557548523, 0.19993294775485992, -0.39249879121780396, -0.7568719387054443, -0.6728066802024841, -0.25027012825012207, 0.3673669397830963, 0.15655870735645294, 0.012913674116134644, 0.35326582193374634, 0.06258933246135712, -0.2461320161819458], [-0.00026968467864207923, 0.002111798617988825, 0.1225481927394867, 0.07837437838315964, 0.016636330634355545, -0.011110732331871986, -0.0001757150748744607, -0.001544731785543263, -0.12265687435865402, -0.07959267497062683, -0.016716787591576576, 0.011158529669046402, -0.06476777046918869], [-0.24201588332653046, 0.36137351393699646, 0.15606753528118134, 0.002781359013170004, 0.36376112699508667, 0.0641208067536354, -0.9721667766571045, -0.9497031569480896, 0.19915708899497986, -0.3872200548648834, -0.7601297497749329, -0.6829559803009033, 0.24336682260036469], [-0.00019450037507340312, -0.0008339323103427887, -0.03921610489487648, -0.025252146646380424, -0.005597906652837992, 0.0032671336084604263, 0.00032844123779796064, 0.0008836245397105813, 0.039232898503541946, 0.02565418928861618, 0.005514191463589668, -0.0032790799159556627, 0.024441182613372803], [-0.004827750381082296, -0.0014487509615719318, 0.2575978934764862, 0.1613239198923111, 0.031248223036527634, -0.027229757979512215, 0.003787625813856721, 0.0023337481543421745, -0.258129358291626, -0.16405275464057922, -0.03147498890757561, 0.027315378189086914, -0.0898917019367218]], "layer1.bias": [0.007515425328165293, -0.008639703504741192, -0.025761457160115242, -0.00033907932811416686, -0.0003655013570096344, 0.0009182818466797471, 0.002272629411891103, 0.00033446363522671163, 0.0005747653776779771, -0.002868145704269409, -0.7043811082839966, -0.005062976852059364, 0.6935379505157471, -0.025800997391343117, 0.0001473768352298066, -0.02215258777141571, -3.9471633499488235e-05, 0.0009942993056029081], "layer2.weight": [[-0.2748648524284363, -0.16240425407886505, 0.20646007359027863, -0.056959789246320724, -0.10343367606401443, 0.11833355575799942, 0.16845063865184784, 0.05971042811870575, 0.10704931616783142, 0.177219420671463, -0.3733731806278229, -0.15993838012218475, -0.37222325801849365, -0.4779050052165985, 0.056304026395082474, 0.47787705063819885, -0.01836363971233368, 0.11447910219430923], [-0.26352459192276, -0.15926215052604675, 0.20298992097377777, -0.05643542483448982, -0.1021268218755722, 0.11656752228736877, 0.16546179354190826, 0.05923715978860855, 0.10570188611745834, 0.17401595413684845, -0.38395386934280396, -0.15712016820907593, -0.38093647360801697, -0.45864829421043396, 0.05594984441995621, 0.4729551374912262, -0.01821274310350418, 0.11289577931165695], [-0.26805180311203003, -0.1590276062488556, 0.20230773091316223, -0.05621807649731636, -0.10177256911993027, 0.11634983122348785, 0.165091872215271, 0.059137698262929916, 0.10542002320289612, 0.17359423637390137, -0.3655586242675781, -0.15676277875900269, -0.3789803385734558, -0.46928921341896057, 0.055733319371938705, 0.47331103682518005, -0.018130602315068245, 0.11272206157445908], [-0.27058932185173035, -0.1605202853679657, 0.2049168348312378, -0.05623510479927063, -0.1020812839269638, 0.11697067320346832, 0.16667909920215607, 0.05898396298289299, 0.10560591518878937, 0.17541854083538055, -0.37804922461509705, -0.15829235315322876, -0.37258127331733704, -0.47001370787620544, 0.055511847138404846, 0.46330901980400085, -0.018129445612430573, 0.11303897202014923], [-0.2743675112724304, -0.16232648491859436, 0.20615315437316895, -0.056785743683576584, -0.1031813845038414, 0.11813882738351822, 0.16831426322460175, 0.0596124567091465, 0.10679762065410614, 0.17706704139709473, -0.37318849563598633, -0.1599528193473816, -0.37580224871635437, -0.4798995554447174, 0.05619441345334053, 0.4775471091270447, -0.018374113366007805, 0.1142907440662384], [0.2592410445213318, 0.15948063135147095, -0.2025240808725357, 0.056697506457567215, 0.1022566631436348, -0.11692992597818375, -0.16548573970794678, -0.05948172137141228, -0.10586711764335632, -0.17395661771297455, 0.3724006116390228, 0.1573513001203537, 0.36386042833328247, 0.4649735391139984, -0.05615422874689102, -0.4708140194416046, 0.018294166773557663, -0.11310561001300812], [-0.2717754542827606, -0.15873460471630096, 0.20332594215869904, -0.0555092990398407, -0.10093457251787186, 0.11563620716333389, 0.16500990092754364, 0.058325089514255524, 0.10454879701137543, 0.17378942668437958, -0.37063586711883545, -0.15645931661128998, -0.3785124719142914, -0.4665312170982361, 0.05495632067322731, 0.47449392080307007, -0.017930883914232254, 0.1119174137711525], [-0.2635975778102875, -0.16007573902606964, 0.20390558242797852, -0.05664799362421036, -0.10252418369054794, 0.11724092811346054, 0.16629630327224731, 0.05947196111083031, 0.10596174001693726, 0.17488689720630646, -0.36789679527282715, -0.15790775418281555, -0.37606674432754517, -0.4626152813434601, 0.05600651726126671, 0.46156707406044006, -0.018243703991174698, 0.11334654688835144]], "layer2.bias": [0.01419274602085352, -0.011879293248057365, -0.001064988668076694, -0.00047307100612670183, 0.006450659595429897, -0.009323258884251118, -0.007407245226204395, -0.008031927049160004], "layer3.weight": [[0.9452412724494934, 0.9404950737953186, 0.9286538362503052, 0.9325980544090271, 0.9556745290756226, -0.9272004961967468, 0.935756266117096, 0.9199422001838684]], "layer3.bias": [0.0025587452109903097]}
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

console.log(gradients_1);
console.log(gradients_2);

// Create the first new array
const array1 = [];
for (let i = 0; i < 6; i++) {
    array1.push(math.max(0.0, (gradients_1[i] - gradients_2[6 + i]) / 2));
}

// Create the second new array
const array2 = [];
for (let i = 0; i < 6; i++) {
    array2.push(math.max(0.0,(gradients_2[i] - gradients_1[6 + i]) / 2));
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
const variance = 188;
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
    model.add(tf.layers.dropout({rate: 0.1}));
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