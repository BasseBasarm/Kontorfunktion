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
                { speaker: 'HR', text: 'Hov, hov — et øjeblik.' },
                { speaker: 'Dig', text: 'Jeg har lidt travlt...' },
                { speaker: 'HR', text: 'Dine tidsregistreringer for sidste måned står stadig som kladde.' },
                { speaker: 'Dig', text: 'Jeg har arbejdet hele måneden.' },
                { speaker: 'HR', text: 'Det betvivler jeg ikke. Men systemet kan jo kun forholde sig til det, der er tastet ind.' },
            ],
            timeCost: 12,
        },
        B: {
            lines: [
                { speaker: 'HR', text: 'Lige præcis dig ville jeg gerne snakke med.' },
                { speaker: 'Dig', text: 'Kan det vente? Jeg har en deadline.' },
                { speaker: 'HR', text: 'Du har registreret nul timer i sidste måned.' },
                { speaker: 'Dig', text: 'Det passer ikke.' },
                { speaker: 'HR', text: 'Det er i hvert fald det, systemet fortæller mig.' },
                { speaker: 'HR', text: '...Og systemet tager sjældent fejl.' },
            ],
            timeCost: 12,
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
                { speaker: 'Sekretær', text: 'Ministeren er i et kort møde.' },
                { speaker: 'Dig', text: 'Hvor kort?' },
                { speaker: 'Sekretær', text: 'Det startede i morges.' },
            ],
            timeCost: 6,
        },
        B: {
            lines: [
                { speaker: 'Sekretær', text: 'Han har blokket kalenderen.' },
                { speaker: 'Dig', text: 'Med hvad?' },
                { speaker: 'Sekretær', text: 'Strategisk tænkning.' },
            ],
            timeCost: 0,
            timeBonus: 7,
        },
    },

    smalltalk: {
        A: {
            lines: [
                { speaker: 'Kollega', text: 'Nå, hvordan går det?' },
                { speaker: 'Dig', text: 'Jeg leder efter chefen.' },
                { speaker: 'Kollega', text: 'Det gør vi alle sammen.' },
                { speaker: 'Kollega', text: 'Kontorchefen er vist på toilettet.' },
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
                { speaker: 'Særlig rådgiver', text: 'Vi skal nok lige koordinere fredagsbaren.' },
                { speaker: 'Dig', text: 'Hvordan?' },
                { speaker: 'Særlig rådgiver', text: 'Med et møde.' },
                { speaker: 'Dig', text: 'Kan mødet ikke bare være en mail?' },
                { speaker: 'Særlig rådgiver', text: 'Det undersøger vi på mødet.' },
            ],
            timeCost: 11,
        },
        B: {
            lines: [
                { speaker: 'Særlig rådgiver', text: 'Jeg har et hurtigt spørgsmål om fredagsbaren.' },
                { speaker: 'Dig', text: 'Jeg har travlt!' },
                { speaker: 'Særlig rådgiver', text: 'Det tager kun et øjeblik.' },
                { speaker: 'Særlig rådgiver', text: '...' },
                { speaker: 'Særlig rådgiver', text: 'Jeg sender lige en mødeindkaldelse.' },
            ],
            timeCost: 10,
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
                { speaker: 'Kollega', text: 'Forresten — jeg tror kontorchefen er på toilettet.' },
            ],
            timeCost: 8,
        },
    },

    toilet: {
        A: {
            lines: [
                { speaker: 'Kollega', text: 'Jeg tager en hurtig powernap herude.' },
                { speaker: 'Dig', text: 'På toilettet?' },
                { speaker: 'Kollega', text: 'Det er det eneste sted uden mødeindkaldelser.' },
            ],
            timeCost: 7,
        },
        B: {
            lines: [
                { speaker: 'Kollega', text: 'Jeg var lige ude og græde lidt.' },
                { speaker: 'Dig', text: '...' },
                { speaker: 'Kollega', text: 'Jeg ved ikke længere, om jeg er i Red Ocean eller Blue Ocean.' },
            ],
            timeCost: 10,
        },
    },

    minister: {
        A: {
            lines: [
                { speaker: 'Dig', text: 'Undskyld, har du set kontorchefen. Det er en haster.' },
                { speaker: 'Ministeren', text: 'Hvis det handler om en orientering, så er jeg ikke orienteret.' },
                { speaker: 'Dig', text: 'Jeg har ikke sagt noget endnu.' },
                { speaker: 'Ministeren', text: 'Perfekt. Fortsæt med det.' },
            ],
            timeCost: 9,
        },
        B: {
            lines: [
                { speaker: 'Dig', text: 'Undskyld, jeg leder efter kontorchefen.' },
                { speaker: 'Ministeren', text: 'Jeg tager lige en strategisk pause herinde.' },
                { speaker: 'Dig', text: 'Fra hvad?' },
                { speaker: 'Ministeren', text: 'Min særlige rådgiver.' },
            ],
            timeCost: 8,
        },
    },

    // Chief dialogue (success ending)
    chief: {
        A: {
            lines: [
                { speaker: 'Dig', text: 'Nå, der var du.' },
                { speaker: 'Kontorchef', text: 'Ja vi har sgu rykket deadline et par uger.' },
                { speaker: 'Dig', text: 'Okay.' },
                { speaker: 'Kontorchef', text: 'Indkalder du ikke til et nyt formøde efter weekenden, så genbesøger vi det der.' },
            ],
            timeCost: 0, // Success — no time deduction
            isEnding: true,
        },
        B: {
            lines: [
                { speaker: 'Dig', text: 'Nå, der var du.' },
                { speaker: 'Kontorchef', text: 'Ja vi har sgu rykket deadline et par uger.' },
                { speaker: 'Dig', text: '...Seriously?' },
                { speaker: 'Kontorchef', text: 'Ja. Lad os parkere den til vi har bedre tid.' },
            ],
            timeCost: 0,
            isEnding: true,
        },
    },
};
