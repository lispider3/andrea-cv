// Vercel Serverless — AI F1 Race Preview Generator
// Generates a contextual race preview using Ergast data + race-week awareness

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');

    try {
        const API = 'https://api.jolpi.ca/ergast/f1/current';

        // Fetch all F1 data in parallel
        const [nextRes, driverRes, constructorRes, lastRes, qualifyRes] = await Promise.all([
            safeFetch(`${API}/next.json`),
            safeFetch(`${API}/driverStandings.json`),
            safeFetch(`${API}/constructorStandings.json`),
            safeFetch(`${API}/last/results.json`),
            // Try to get qualifying for the next race (may 404 if not yet run)
            safeFetch(`${API}/next/qualifying.json`),
        ]);

        const nextRaces = nextRes?.MRData?.RaceTable?.Races;
        const nextRace = nextRaces?.length ? nextRaces[0] : null;

        if (!nextRace) {
            return res.status(200).json({ preview: 'The next race has not been announced yet. Check back soon for the race preview.', phase: 'off-season' });
        }

        const driverStandings = driverRes?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
        const constructorStandings = constructorRes?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];
        const lastRaceResults = lastRes?.MRData?.RaceTable?.Races?.[0] || null;

        // Qualifying data for the upcoming race (null if not yet run)
        const qualifyRaces = qualifyRes?.MRData?.RaceTable?.Races;
        const qualifyData = qualifyRaces?.length ? qualifyRaces[0] : null;
        const hasQualifying = qualifyData?.QualifyingResults?.length > 0;

        // Determine the phase of the race week
        const raceDate = new Date(`${nextRace.date}T${nextRace.time || '14:00:00Z'}`);
        const now = new Date();
        const daysUntilRace = Math.floor((raceDate - now) / (1000 * 60 * 60 * 24));

        let phase;
        if (daysUntilRace < 0) phase = 'race-day';
        else if (hasQualifying) phase = 'post-qualifying';
        else if (daysUntilRace <= 2) phase = 'race-week';
        else if (daysUntilRace <= 7) phase = 'build-up';
        else phase = 'pre-race';

        const preview = generateF1Preview(nextRace, driverStandings, constructorStandings, lastRaceResults, qualifyData, hasQualifying, phase, daysUntilRace);

        res.status(200).json({
            preview,
            phase,
            race: nextRace.raceName,
            circuit: nextRace.Circuit?.circuitName,
            daysUntilRace,
            hasQualifying,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function safeFetch(url) {
    try {
        const r = await fetch(url);
        if (!r.ok) return null;
        return r.json();
    } catch { return null; }
}

function generateF1Preview(race, drivers, constructors, lastRace, qualifying, hasQualifying, phase, daysUntilRace) {
    const lines = [];
    const raceName = race.raceName;
    const circuit = race.Circuit?.circuitName || '';
    const country = race.Circuit?.Location?.country || '';
    const locality = race.Circuit?.Location?.locality || '';

    // ── POST-QUALIFYING PREVIEW ──
    if (hasQualifying && qualifying?.QualifyingResults?.length) {
        const grid = qualifying.QualifyingResults;
        const pole = grid[0];
        const p2 = grid[1];
        const p3 = grid[2];

        lines.push(`Qualifying is done at ${circuit}. ${pole.Driver.givenName} ${pole.Driver.familyName} takes pole position for the ${raceName}.`);

        if (p2) {
            lines.push(`${p2.Driver.givenName} ${p2.Driver.familyName} lines up P2${p3 ? `, with ${p3.Driver.givenName} ${p3.Driver.familyName} completing the front row and P3` : ''}.`);
        }

        // Find Ferrari drivers in the grid
        const ferrariGrid = grid.filter(g => g.Constructor?.name === 'Ferrari');
        if (ferrariGrid.length) {
            const ferrPositions = ferrariGrid.map(f => `${f.Driver.familyName} P${f.position}`).join(', ');
            lines.push(`Ferrari line up: ${ferrPositions}.`);
        }

        // Talking point: anyone out of position?
        if (drivers.length) {
            const leader = drivers[0];
            const leaderGrid = grid.findIndex(g => g.Driver.driverId === leader.Driver.driverId);
            if (leaderGrid > 4) {
                lines.push(`Championship leader ${leader.Driver.familyName} starts from a modest P${leaderGrid + 1} — recovery drive incoming?`);
            }
        }

        lines.push(`Lights out at ${circuit}, ${locality}. Race day will determine if qualifying advantages translate to race pace.`);
        return lines.join(' ');
    }

    // ── RACE-WEEK PREVIEW ──
    if (phase === 'race-week' || phase === 'build-up') {
        lines.push(`Race week is here for the ${raceName} at ${circuit}, ${locality}.`);

        if (daysUntilRace <= 2) {
            lines.push(`With just ${daysUntilRace} day${daysUntilRace !== 1 ? 's' : ''} until lights out, teams are fine-tuning setups for the unique demands of this track.`);
        }
    } else {
        // PRE-RACE or OFF-SEASON
        lines.push(`The ${raceName} at ${circuit} in ${country} is next on the calendar.`);
    }

    // Championship context from standings
    if (drivers.length >= 3) {
        const p1 = drivers[0], p2 = drivers[1], p3 = drivers[2];
        const gap12 = parseInt(p1.points) - parseInt(p2.points);
        const gap13 = parseInt(p1.points) - parseInt(p3.points);

        if (gap12 === 0 && parseInt(p1.points) === 0) {
            // Season hasn't started yet
            lines.push(`The ${new Date().getFullYear()} season is yet to begin — all eyes on the season opener to see who has the edge after the winter break.`);
        } else if (gap12 <= 10) {
            lines.push(`The championship battle is razor-thin: ${p1.Driver.familyName} leads ${p2.Driver.familyName} by just ${gap12} point${gap12 !== 1 ? 's' : ''}, with ${p3.Driver.familyName} only ${gap13} points behind.`);
        } else if (gap12 <= 30) {
            lines.push(`${p1.Driver.familyName} leads the championship on ${p1.points} points, ${gap12} ahead of ${p2.Driver.familyName}. ${p3.Driver.familyName} sits P3 with ${p3.points} points.`);
        } else {
            lines.push(`${p1.Driver.familyName} has built a commanding ${gap12}-point lead over ${p2.Driver.familyName} in the title race.`);
        }
    }

    // Constructor context
    if (constructors.length >= 2) {
        const c1 = constructors[0], c2 = constructors[1];
        const cGap = parseInt(c1.points) - parseInt(c2.points);
        if (parseInt(c1.points) > 0) {
            if (cGap <= 20) {
                lines.push(`In the constructors' fight, ${c1.Constructor.name} and ${c2.Constructor.name} are separated by just ${cGap} points.`);
            } else {
                lines.push(`${c1.Constructor.name} lead the constructors' championship on ${c1.points} points.`);
            }
        }
    }

    // Last race context
    if (lastRace?.Results?.length) {
        const winner = lastRace.Results[0];
        const raceLast = lastRace.raceName;
        lines.push(`Coming into this weekend, momentum is with ${winner.Driver.givenName} ${winner.Driver.familyName} (${winner.Constructor.name}), who won the ${raceLast}.`);
    }

    // Circuit character hints
    const circuitHints = getCircuitHint(race.Circuit?.circuitId || '');
    if (circuitHints) {
        lines.push(circuitHints);
    }

    return lines.join(' ');
}

function getCircuitHint(circuitId) {
    const hints = {
        'albert_park': 'Albert Park is a semi-street circuit that rewards a well-balanced car. Overtaking is possible but track position from qualifying is key.',
        'bahrain': 'Bahrain\'s Sakhir circuit is tough on rear tyres with heavy braking zones. Tyre management and race strategy often decide the outcome here.',
        'jeddah': 'The Jeddah Corniche Circuit is the fastest street circuit on the calendar — raw speed is king, but the walls punish any mistake.',
        'suzuka': 'Suzuka is the ultimate drivers\' circuit. The high-speed Esses and 130R reward bravery and aerodynamic excellence.',
        'monaco': 'Monaco is all about qualifying — overtaking is nearly impossible. Track position is everything around the famous streets.',
        'silverstone': 'Silverstone\'s high-speed corners like Copse and Maggotts-Becketts reward aerodynamic efficiency and driver confidence.',
        'spa': 'Spa-Francorchamps is one of the longest and most demanding circuits. Eau Rouge and Raidillon are the ultimate test of courage, and weather can change everything.',
        'monza': 'Monza — the Temple of Speed. Low downforce and slipstream battles define this iconic Italian Grand Prix venue.',
        'interlagos': 'Interlagos is legendary for dramatic races. The short lap and altitude create close racing and unpredictable weather.',
        'yas_marina': 'The Yas Marina circuit under the lights is where seasons are decided. The long straights and tight final sector create strategic variety.',
        'red_bull_ring': 'The Red Bull Ring is short, sharp, and intense. High altitude and aggressive kerbs put significant stress on the cars.',
        'hungaroring': 'Budapest\'s Hungaroring is often called "Monaco without the walls" — qualifying pace is crucial as overtaking opportunities are limited.',
        'zandvoort': 'Zandvoort\'s banked corners and narrow layout create a unique challenge. It\'s a qualifying-focused circuit with limited overtaking.',
        'americas': 'COTA blends high-speed sweeps (inspired by Silverstone) with heavy braking zones. The Turn 1 climb is one of the most dramatic starts in F1.',
        'rodriguez': 'Mexico City\'s high altitude (2,240m) reduces engine power and downforce significantly, creating a unique challenge for all teams.',
        'villeneuve': 'The Circuit Gilles Villeneuve\'s "Wall of Champions" at the final chicane has caught out many a title contender. Street-circuit character with big braking events.',
        'marina_bay': 'Singapore\'s Marina Bay street circuit is physically the most demanding race on the calendar — a gruelling night race under the lights.',
        'losail': 'Qatar\'s Losail circuit features long, flowing corners that stress tyres heavily, particularly the front-left.',
        'vegas': 'Las Vegas brings high-speed straights through the neon-lit Strip. Cold track temperatures and low-grip conditions make it treacherous.',
        'shanghai': 'Shanghai\'s long back straight and technical first sector test both top speed and mechanical grip.',
        'imola': 'Imola\'s narrow, old-school layout makes overtaking a challenge. Qualifying position and tyre strategy are crucial here.',
        'miami': 'The Miami International Autodrome combines a fast first sector with a tight, technical second half. Overtaking chances exist but require precision.',
        'baku': 'Baku\'s street circuit is chaos incarnate — the long blast to Turn 1 and tight old-town section create drama every year.',
        'catalunya': 'Barcelona\'s Circuit de Barcelona-Catalunya is where teams know their cars best from testing. High-speed Turn 3 is a key differentiator.',
    };
    return hints[circuitId] || null;
}
