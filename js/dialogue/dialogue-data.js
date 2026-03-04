// All dialogue encounters — 11 NPCs × 2 variants (Danish)
// Each dialogue has: lines (array of {speaker, text}), timeCost (seconds)

export const DIALOGUE_DATA = {
    teamleder: {
        A: {
            lines: [
                { speaker: 'Teamleder', text: 'Har du to minutter?' },
                { speaker: 'Dig', text: 'Ikke rigtigt.' },
                { speaker: 'Teamleder', text: 'Perfekt. Det handler bare om en foreløbig præcisering af kommissoriet for vores midlertidige arbejdsgruppe.' },
                { speaker: 'Dig', text: 'Er det besluttet?' },
                { speaker: 'Teamleder', text: 'Nej, men vi skal have besluttet, hvordan vi beslutter det.' },
            ],
            timeCost: 12,
        },
        B: {
            lines: [
                { speaker: 'Teamleder', text: 'Vi mangler lige en hurtig afstemning.' },
                { speaker: 'Dig', text: 'Om hvad?' },
                { speaker: 'Teamleder', text: 'Om hvorvidt vi kalder det en afklaring eller en præcisering.' },
            ],
            timeCost: 9,
        },
    },

    kollega_moede: {
        A: {
            lines: [
                { speaker: 'Kollega', text: 'Vi tager lige et kort møde om mailen.' },
                { speaker: 'Dig', text: 'Hvad stod der i mailen?' },
                { speaker: 'Kollega', text: 'At vi burde tage et møde.' },
            ],
            timeCost: 14,
        },
        B: {
            lines: [
                { speaker: 'Kollega', text: 'Vi har lavet et forberedende møde om næste mødes dagsorden.' },
                { speaker: 'Dig', text: 'Er der en dagsorden?' },
                { speaker: 'Kollega', text: 'Det er det, vi skal have en proces for.' },
            ],
            timeCost: 16,
        },
    },

    hr: {
        A: {
            lines: [
                { speaker: 'HR', text: 'Jeg kan se, at dine tidsregistreringer for sidste måned fortsat står som kladde.' },
                { speaker: 'Dig', text: 'Jeg har arbejdet hele måneden.' },
                { speaker: 'HR', text: 'Det betvivler jeg ikke. Men systemet kan jo kun forholde sig til det, der er tastet ind.' },
            ],
            timeCost: 11,
        },
        B: {
            lines: [
                { speaker: 'HR', text: 'Du har registreret nul timer i sidste måned.' },
                { speaker: 'Dig', text: 'Det passer ikke.' },
                { speaker: 'HR', text: 'Det er i hvert fald det, systemet fortæller mig.' },
                { speaker: 'HR', text: '...Og systemet tager sjældent fejl.' },
            ],
            timeCost: 10,
        },
    },

    f2_superbruger: {
        A: {
            lines: [
                { speaker: 'Kollega', text: 'Har du journaliseret din foreløbige version?' },
                { speaker: 'Dig', text: 'Den er ikke færdig.' },
                { speaker: 'Kollega', text: 'Det er vigtigt at dokumentere, at den ikke er færdig.' },
            ],
            timeCost: 8,
        },
        B: {
            lines: [
                { speaker: 'Kollega', text: 'Har du sat den på den rigtige sag?' },
                { speaker: 'Dig', text: 'Hvilken sag?' },
                { speaker: 'Kollega', text: 'Den midlertidige samle-sag.' },
            ],
            timeCost: 9,
        },
    },

    sekretaer: {
        A: {
            lines: [
                { speaker: 'Sekretær', text: 'Hun er i et kort møde.' },
                { speaker: 'Dig', text: 'Hvor kort?' },
                { speaker: 'Sekretær', text: 'Det startede i morges.' },
            ],
            timeCost: 6,
        },
        B: {
            lines: [
                { speaker: 'Sekretær', text: 'Hun har blokket kalenderen.' },
                { speaker: 'Dig', text: 'Med hvad?' },
                { speaker: 'Sekretær', text: 'Strategisk tænkning.' },
            ],
            timeCost: 7,
        },
    },

    smalltalk: {
        A: {
            lines: [
                { speaker: 'Kollega', text: 'Nå, hvordan går det?' },
                { speaker: 'Dig', text: 'Jeg leder efter chefen.' },
                { speaker: 'Kollega', text: 'Det gør vi alle sammen.' },
            ],
            timeCost: 7,
        },
        B: {
            lines: [
                { speaker: 'Kollega', text: 'Har du også en følelse af, at vi forankrer uden at flytte noget?' },
                { speaker: 'Dig', text: 'Jeg skal bare have feedback.' },
                { speaker: 'Kollega', text: 'Det er også en form for bevægelse.' },
            ],
            timeCost: 11,
        },
    },

    raadgiver: {
        A: {
            lines: [
                { speaker: 'Rådgiver', text: 'Har du tænkt den politiske vinkel ind?' },
                { speaker: 'Dig', text: 'Det er bare en status på næste uges fredagsbar.' },
                { speaker: 'Rådgiver', text: 'Netop derfor.' },
            ],
            timeCost: 9,
        },
        B: {
            lines: [
                { speaker: 'Rådgiver', text: 'Vi skal risikovurdere den.' },
                { speaker: 'Dig', text: 'Det er en fredagsbar.' },
                { speaker: 'Rådgiver', text: 'Der kan opstå narrativer.' },
            ],
            timeCost: 12,
        },
    },

    moededeltager: {
        A: {
            lines: [
                { speaker: 'Mødedeltager', text: 'Vi er midt i en gensidig orientering.' },
                { speaker: 'Dig', text: 'Om hvad?' },
                { speaker: 'Mødedeltager', text: 'Status på opfølgning.' },
            ],
            timeCost: 11,
        },
        B: {
            lines: [
                { speaker: 'Mødedeltager', text: 'Vi har ikke beslutningsrum.' },
                { speaker: 'Dig', text: 'Hvornår får I det?' },
                { speaker: 'Mødedeltager', text: 'Det skal kvalificeres.' },
            ],
            timeCost: 10,
        },
    },

    kaffe: {
        A: {
            lines: [
                { speaker: 'Kollega', text: 'Har du smagt espressochokoen?' },
                { speaker: 'Dig', text: 'Nej.' },
                { speaker: 'Kollega', text: 'Den får ens blodsukker til at spike helt vildt. Jeg crashede midt i en governance-drøftelse.' },
            ],
            timeCost: 6,
        },
        B: {
            lines: [
                { speaker: 'Kollega', text: 'Jeg har skåret ned på kaffe.' },
                { speaker: 'Dig', text: 'Hvorfor?' },
                { speaker: 'Kollega', text: 'Jeg kunne mærke min puls stige, når vi sagde "leveranceplan".' },
            ],
            timeCost: 8,
        },
    },

    toilet: {
        A: {
            lines: [
                { speaker: 'Kollega', text: '(hviskende) Jeg var lige herude.' },
                { speaker: 'Dig', text: 'Ja?' },
                { speaker: 'Kollega', text: 'For at græde lidt.' },
                { speaker: 'Dig', text: 'Over hvad?' },
                { speaker: 'Kollega', text: 'Snitfladerne.' },
            ],
            timeCost: 9,
        },
        B: {
            lines: [
                { speaker: 'Kollega', text: 'Jeg tager en hurtig powernap herude.' },
                { speaker: 'Dig', text: 'På toilettet?' },
                { speaker: 'Kollega', text: 'Det er det eneste sted uden mødeindkaldelser.' },
            ],
            timeCost: 7,
        },
    },

    // Chief dialogue (success ending)
    chief: {
        A: {
            lines: [
                { speaker: 'Dig', text: 'Jeg har bedt om feedback på minister-notatet i F2, men du har ikke svaret.' },
                { speaker: 'Kontorchef', text: 'Nå ja. Vi har rykket det to uger.' },
                { speaker: 'Dig', text: 'Okay.' },
                { speaker: 'Kontorchef', text: 'Indkalder du ikke til et nyt formøde efter weekenden, så genbesøger vi det der.' },
            ],
            timeCost: 0, // Success — no time deduction
            isEnding: true,
        },
        B: {
            lines: [
                { speaker: 'Dig', text: 'Jeg mangler din feedback.' },
                { speaker: 'Kontorchef', text: 'Ja, den er vigtig.' },
                { speaker: 'Kontorchef', text: '...Lad os parkere den.' },
                { speaker: 'Dig', text: 'Til hvornår?' },
                { speaker: 'Kontorchef', text: 'Til vi har bedre tid.' },
            ],
            timeCost: 0,
            isEnding: true,
        },
    },
};
